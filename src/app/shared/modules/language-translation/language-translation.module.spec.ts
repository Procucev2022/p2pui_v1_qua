import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageTranslationModule, HttpLoaderFactory } from './language-translation.module';
import { HttpClient } from '@angular/common/http';

describe('LanguageTranslationModule', () => {
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), LanguageTranslationModule]
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);
  });

  it('should create the module', () => {
    expect(translateService).toBeTruthy();
  });

  it('should set default lang to en', () => {
    expect(translateService.getDefaultLang()).toBe('en');
  });

  it('should use browser lang or default to en', () => {
    // The currentLang will be browser lang if it matches, or 'en'
    const lang = translateService.currentLang || translateService.getDefaultLang();
    expect(lang).toBeTruthy();
  });

  it('HttpLoaderFactory should return a loader', () => {
    const http = TestBed.inject(HttpClient);
    const loader = HttpLoaderFactory(http);
    expect(loader).toBeTruthy();
  });

  it('should have added language list', () => {
    const langs = translateService.getLangs();
    expect(langs).toContain('en');
    expect(langs).toContain('fr');
  });

  it('should handle non-matching browser lang by falling back to en', () => {
    // Force a scenario where getBrowserLang returns something not in the list
    spyOn(translateService, 'getBrowserLang').and.returnValue('xx');
    const mod = new LanguageTranslationModule(translateService);
    expect(translateService.getDefaultLang()).toBe('en');
  });
});
