import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuyerIngestionWizardComponent } from './buyer-ingestion-wizard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('BuyerIngestionWizardComponent', () => {
  let component: BuyerIngestionWizardComponent;
  let fixture: ComponentFixture<BuyerIngestionWizardComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyerIngestionWizardComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerIngestionWizardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create BuyerIngestionWizardComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle between file upload and email ingestion modes', () => {
    expect(component.ingestionMode).toBe('upload');
    component.setIngestionMode('email');
    expect(component.ingestionMode).toBe('email');
    component.setIngestionMode('upload');
    expect(component.ingestionMode).toBe('upload');
  });

  it('should handle file selection and drag-drop events', () => {
    component.handleFileSelected('Test_BOQ.xlsx');
    expect(component.selectedFileName).toBe('Test_BOQ.xlsx');
    expect(component.toastMessage).toContain('Test_BOQ.xlsx');

    // Call again to test timer clear
    component.handleFileSelected('Another_BOQ.xlsx');

    const fakeDragEvent = { preventDefault: () => {}, stopPropagation: () => {} } as any;
    component.onDragOver(fakeDragEvent);
    expect(component.isDragging).toBe(true);

    component.onDragLeave(fakeDragEvent);
    expect(component.isDragging).toBe(false);

    // Test onDrop with files
    const dropWithFiles = {
      preventDefault: () => {},
      stopPropagation: () => {},
      dataTransfer: { files: [{ name: 'Dropped_File.pdf' }] }
    } as any;
    component.onDrop(dropWithFiles);
    expect(component.selectedFileName).toBe('Dropped_File.pdf');

    // Test onDrop without files
    const dropEmpty = {
      preventDefault: () => {},
      stopPropagation: () => {},
      dataTransfer: { files: [] }
    } as any;
    component.onDrop(dropEmpty);

    // Test onFileInputChange with files
    const fileChangeWithFiles = {
      target: { files: [{ name: 'Input_File.docx' }] }
    };
    component.onFileInputChange(fileChangeWithFiles);
    expect(component.selectedFileName).toBe('Input_File.docx');

    // Test onFileInputChange without files
    const fileChangeEmpty = { target: { files: [] } };
    component.onFileInputChange(fileChangeEmpty);
  });

  it('should navigate through wizard steps', (done) => {
    component.parseAndReview();
    expect(component.isProcessing).toBe(true);

    setTimeout(() => {
      expect(component.currentStep).toBe(2);
      component.proceedToSourcingMode();
      expect(component.currentStep).toBe(3);

      component.selectSourcingMode(component.sourcingModes[0]);
      expect(component.sourcingModes[0].selected).toBe(true);

      spyOn(router, 'navigateByUrl');
      component.dispatchRfq();
      expect(component.toastMessage).toContain('dispatched');

      component.exitWizard();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/buyer-dashboard/command-center');
      done();
    }, 900);
  });
});
