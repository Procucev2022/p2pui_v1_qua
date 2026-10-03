import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AnalyticsConsoleComponent } from './analytics-console.component';
import { AnalyticsService } from '../../services/analytics.service';
import { autoMock } from 'src/testing/test-helpers';

describe('AnalyticsConsoleComponent', () => {
  let component: AnalyticsConsoleComponent;
  let fixture: ComponentFixture<AnalyticsConsoleComponent>;
  let analyticsService: any;

  const company1 = { id: 'c1', pocName: 'Alice', totalCredits: 10, tier: 'Growth' };
  const company2 = { id: 'c2', pocName: 'Bob', chatMessages: [{ id: 'm1', sender: 'user', text: 'hi' }], dayWiseChats: [{ dayLabel: 'Today', messages: [] }] };

  function setup() {
    analyticsService = autoMock('AnalyticsService');
    TestBed.configureTestingModule({
      declarations: [AnalyticsConsoleComponent],
      providers: [{ provide: AnalyticsService, useValue: analyticsService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideTemplate(AnalyticsConsoleComponent, '');
    fixture = TestBed.createComponent(AnalyticsConsoleComponent);
    component = fixture.componentInstance;
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create and search companies on init', () => {
    setup();
    analyticsService.searchCompanies.and.returnValue(of({ companies: [company1] }));
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.companies.length).toBe(1);
    expect(component.selectedCompany).toEqual(company1);
    expect(component.isLoading).toBe(false);
  });

  it('should set selectedCompany to null when no companies returned', () => {
    setup();
    analyticsService.searchCompanies.and.returnValue(of({ companies: [] }));
    fixture.detectChanges();
    expect(component.selectedCompany).toBeNull();
  });

  it('should handle response without companies key', () => {
    setup();
    analyticsService.searchCompanies.and.returnValue(of({}));
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
  });

  it('should handle error from searchCompanies', () => {
    setup();
    analyticsService.searchCompanies.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
  });

  it('should set active tab', () => {
    setup();
    analyticsService.searchCompanies.and.returnValue(of({ companies: [company1] }));
    fixture.detectChanges();
    component.setTab('accounts');
    expect(component.activeTab).toBe('accounts');
    component.setTab('whatsapp');
    expect(component.activeTab).toBe('whatsapp');
  });

  it('should select a company and build default dayWiseChats when missing', () => {
    setup();
    analyticsService.searchCompanies.and.returnValue(of({ companies: [company1] }));
    fixture.detectChanges();
    component.selectCompany(company1);
    expect(component.selectedCompany).toEqual(company1);
    expect(component.dayWiseChats.length).toBe(2);
    expect(component.chatMessages).toEqual([]);
  });

  it('should build default dayWiseChats using fallback text when pocName/totalCredits/tier are missing', () => {
    setup();
    const bareCompany = { id: 'c3' };
    analyticsService.searchCompanies.and.returnValue(of({ companies: [bareCompany] }));
    fixture.detectChanges();
    component.selectCompany(bareCompany);
    const todayMsgs = component.dayWiseChats[0].messages;
    expect(todayMsgs[0].senderName).toBe('Client');
    expect(todayMsgs[1].text).toContain('Partner');
    const yesterdayMsgs = component.dayWiseChats[1].messages;
    expect(yesterdayMsgs[1].text).toContain('0 RFQ credits');
    expect(yesterdayMsgs[1].text).toContain('Growth');
  });

  it('should select a company and use provided chatMessages/dayWiseChats', () => {
    setup();
    analyticsService.searchCompanies.and.returnValue(of({ companies: [company2] }));
    fixture.detectChanges();
    component.selectCompany(company2);
    expect(component.chatMessages).toEqual(company2.chatMessages);
    expect(component.dayWiseChats).toEqual(company2.dayWiseChats);
  });

  it('should not send chat when input is empty', () => {
    setup();
    analyticsService.searchCompanies.and.returnValue(of({ companies: [company1] }));
    fixture.detectChanges();
    component.chatInput = '   ';
    component.sendChat();
    expect(analyticsService.processChat).not.toHaveBeenCalled();
  });

  it('should not send chat when no company selected', () => {
    setup();
    analyticsService.searchCompanies.and.returnValue(of({ companies: [] }));
    fixture.detectChanges();
    component.chatInput = 'hello';
    component.sendChat();
    expect(analyticsService.processChat).not.toHaveBeenCalled();
  });

  it('should send chat message and append bot response', () => {
    setup();
    analyticsService.searchCompanies.and.returnValue(of({ companies: [company1] }));
    fixture.detectChanges();
    component.chatInput = 'What is my balance?';
    const botMsg = { id: 'm-bot', sender: 'agent', text: 'Your balance is 10 credits' };
    analyticsService.processChat.and.returnValue(of(botMsg));
    component.sendChat();
    expect(component.chatInput).toBe('');
    expect(component.chatMessages.some((m: any) => m.text === 'What is my balance?')).toBe(true);
    expect(component.chatMessages).toContain(botMsg);
    expect(component.isSendingChat).toBe(false);
  });

  it('should not send chat while a message is already sending', () => {
    setup();
    analyticsService.searchCompanies.and.returnValue(of({ companies: [company1] }));
    fixture.detectChanges();
    component.isSendingChat = true;
    component.chatInput = 'hello';
    component.sendChat();
    expect(analyticsService.processChat).not.toHaveBeenCalled();
  });

  it('should append fallback message on chat error', () => {
    setup();
    analyticsService.searchCompanies.and.returnValue(of({ companies: [company1] }));
    fixture.detectChanges();
    component.chatInput = 'hello';
    analyticsService.processChat.and.returnValue(throwError(() => new Error('fail')));
    component.sendChat();
    expect(component.chatMessages.some((m: any) => m.id === 'msg-err')).toBe(true);
    expect(component.isSendingChat).toBe(false);
  });
});
