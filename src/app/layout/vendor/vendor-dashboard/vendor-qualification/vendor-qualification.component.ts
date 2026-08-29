import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { VendorDashboardService } from '../services/vendor-dashboard.service';
import {
  ModuleId,
  QualificationModule,
  QualificationQuestion,
  VendorEvaluationResult,
  VendorProfileSummary
} from '../models/vendor-dashboard.model';
import { VENDOR_QUALIFICATION_QUESTIONS } from './vendor-qualification.questions';

@Component({
  selector: 'app-vendor-qualification',
  templateUrl: './vendor-qualification.component.html',
  styleUrls: ['./vendor-qualification.component.scss']
})
export class VendorQualificationComponent implements OnInit {

  @Input() profile: VendorProfileSummary | null = null;
  @Output() back = new EventEmitter<void>();

  /** Benchmark thresholds that gate direct RFQ dispatch. */
  static readonly PREFERRED_THRESHOLD = 80;
  static readonly CONDITIONAL_THRESHOLD = 65;

  modules: QualificationModule[] = [
    { id: 'M1', code: 'Module 1', name: 'Commercial Terms', weight: 25, colorClass: 'mod-indigo' },
    { id: 'M2', code: 'Module 2', name: 'Technical Capabilities', weight: 15, colorClass: 'mod-sky' },
    { id: 'M3', code: 'Module 3', name: 'Quality & Warranty', weight: 20, colorClass: 'mod-emerald' },
    { id: 'M4', code: 'Module 4', name: 'Operational Delivery', weight: 20, colorClass: 'mod-purple' },
    { id: 'M5', code: 'Module 5', name: 'Financial Stability', weight: 10, colorClass: 'mod-amber' },
    { id: 'M6', code: 'Module 6', name: 'Governance & ESG', weight: 10, colorClass: 'mod-rose' }
  ];

  questions: QualificationQuestion[] = [];
  activeModule: ModuleId = 'M1';
  submitting = false;
  evaluationResult: VendorEvaluationResult | null = null;

  constructor(
    private vendorDashboardService: VendorDashboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Deep copy so the shared question definitions stay pristine between visits.
    this.questions = VENDOR_QUALIFICATION_QUESTIONS.map(q => ({
      ...q,
      options: q.options.map(o => ({ ...o }))
    }));
  }

  get activeModuleMeta(): QualificationModule {
    const found = this.modules.filter(m => m.id === this.activeModule);
    return found.length > 0 ? found[0] : this.modules[0];
  }

  get activeModuleIndex(): number {
    return this.modules.findIndex(m => m.id === this.activeModule);
  }

  get isFirstModule(): boolean {
    return this.activeModuleIndex === 0;
  }

  get isLastModule(): boolean {
    return this.activeModuleIndex === this.modules.length - 1;
  }

  get activeQuestions(): QualificationQuestion[] {
    return this.questions.filter(q => q.moduleId === this.activeModule);
  }

  setActiveModule(id: ModuleId): void {
    this.activeModule = id;
  }

  nextModule(): void {
    if (!this.isLastModule) {
      this.activeModule = this.modules[this.activeModuleIndex + 1].id;
    }
  }

  prevModule(): void {
    if (!this.isFirstModule) {
      this.activeModule = this.modules[this.activeModuleIndex - 1].id;
    }
  }

  /** Score is 0-5; weighted score scales that against the question's share of the 100-point total. */
  onScoreChange(question: QualificationQuestion, rawValue: any): void {
    const value = Number(rawValue);
    question.score = value;
    question.weightedScore = Math.round((value / 5) * question.maxWeight * 100) / 100;
  }

  attachDocument(question: QualificationQuestion, fileName: string): void {
    if (!fileName) { return; }
    question.attachmentName = fileName;
    // Verification is performed server-side on submission.
    question.attachmentVerified = false;
  }

  onFileSelected(question: QualificationQuestion, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.attachDocument(question, input.files[0].name);
    }
  }

  getModuleTotals(moduleId: ModuleId): { avg: number; weighted: number } {
    const list = this.questions.filter(q => q.moduleId === moduleId);
    if (list.length === 0) { return { avg: 0, weighted: 0 }; }
    const scoreSum = list.reduce((acc, q) => acc + q.score, 0);
    const weightedSum = list.reduce((acc, q) => acc + q.weightedScore, 0);
    return {
      avg: Math.round((scoreSum / list.length) * 10) / 10,
      weighted: Math.round(weightedSum * 10) / 10
    };
  }

  get totalScore(): number {
    return Math.round(this.questions.reduce((acc, q) => acc + q.weightedScore, 0));
  }

  get currentStatus(): string {
    return this.getStatusForScore(this.totalScore);
  }

  getStatusForScore(score: number): string {
    if (score >= VendorQualificationComponent.PREFERRED_THRESHOLD) {
      return 'PREFERRED ENTERPRISE SUPPLIER';
    }
    if (score >= VendorQualificationComponent.CONDITIONAL_THRESHOLD) {
      return 'CONDITIONAL / UNDER REVIEW';
    }
    return 'DISQUALIFIED SUPPLIER';
  }

  get statusClass(): string {
    const score = this.totalScore;
    if (score >= VendorQualificationComponent.PREFERRED_THRESHOLD) { return 'status-preferred'; }
    if (score >= VendorQualificationComponent.CONDITIONAL_THRESHOLD) { return 'status-conditional'; }
    return 'status-disqualified';
  }

  get attachmentsVerifiedCount(): number {
    return this.questions.filter(q => q.attachmentVerified).length;
  }

  private getSystemAction(score: number): string {
    if (score >= VendorQualificationComponent.PREFERRED_THRESHOLD) {
      return 'Automatic direct RFQ dispatch to vendor inbox enabled. All mandatory attachments verified. '
        + 'Vendor added to the Mode 3 active bidding roster.';
    }
    if (score >= VendorQualificationComponent.CONDITIONAL_THRESHOLD) {
      return 'RFQ dispatch held. A Corrective Action Plan (CAPA) or document clarification has been requested.';
    }
    return 'Excluded from active RFQ dispatch. Re-audit option unlocks after 90 days.';
  }

  submit(): void {
    this.submitting = true;
    const score = this.totalScore;

    const moduleScores: { [key: string]: any } = {};
    this.modules.forEach(m => {
      const totals = this.getModuleTotals(m.id);
      moduleScores[m.id] = {
        score: totals.avg,
        maxScore: 5,
        weight: m.weight,
        weightedScore: totals.weighted,
        remarks: m.name
      };
    });

    const payload = {
      vendorCode: this.profile ? this.profile.vendorCode : '',
      vendorName: this.profile ? this.profile.vendorName : '',
      overallScore: score,
      status: this.getStatusForScore(score),
      moduleScores,
      questions: this.questions.map(q => ({
        refId: q.refId,
        moduleId: q.moduleId,
        criteria: q.criteria,
        score: q.score,
        weightedScore: q.weightedScore,
        attachmentName: q.attachmentName,
        attachmentVerified: q.attachmentVerified,
        remarks: q.remarks
      }))
    };

    this.vendorDashboardService.submitQualification(payload).subscribe({
      next: (res: any) => {
        this.submitting = false;
        const evaluation = res && res.data ? res.data.evaluation : null;
        if (!evaluation) {
          this.toastr.error('Evaluation result was not returned', 'Error');
          return;
        }
        // Server recomputes the score, so display its authoritative result.
        this.evaluationResult = evaluation;
        this.toastr.success(
          `Evaluation complete: ${evaluation.overallScore}% — ${evaluation.status}`, 'Submitted'
        );
      },
      error: () => {
        this.submitting = false;
        this.toastr.error('Could not submit your qualification', 'Error');
      }
    });
  }

  resetForm(): void {
    this.evaluationResult = null;
    this.activeModule = 'M1';
    this.ngOnInit();
  }

  trackByRefId(index: number, q: QualificationQuestion): string {
    return q.refId;
  }
}
