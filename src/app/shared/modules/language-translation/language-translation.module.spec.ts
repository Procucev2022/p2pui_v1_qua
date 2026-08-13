import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { of } from 'rxjs';
import {
  HttpLoaderFactory,
  LanguageTranslationModule,
} from './language-translation.module';

describe('LanguageTranslationModule', () => {
  function mockTranslate(browserLang: string): TranslateService {
    const translate = jasmine.createSpyObj(
      'TranslateService',
      [
        'setDefaultLang',
        'use',
        'get',
        'stream',
        'instant',
        'addLangs',
        'getBrowserLang',
      ],
      {
        onLangChange: of({}),
        onTranslationChange: of({}),
        onDefaultLangChange: of({}),
      }
    ) as any;
    translate.getBrowserLang.and.returnValue(browserLang);
    return translate;
  }

  it('should create an instance and configure languages for matching browser lang', () => {
    const translate = mockTranslate('fr');
    const mod = new LanguageTranslationModule(translate);
    expect(mod).toBeTruthy();
    expect(translate.addLangs).toHaveBeenCalledWith([
      'en',
      'fr',
      'ur',
      'es',
      'it',
      'fa',
      'de',
      'zh-CHS',
    ]);
    expect(translate.setDefaultLang).toHaveBeenCalledWith('en');
    expect(translate.use).toHaveBeenCalledWith('fr');
  });

  it('should fall back to en when browser lang does not match', () => {
    const translate = mockTranslate('pt');
    const mod = new LanguageTranslationModule(translate);
    expect(mod).toBeTruthy();
    expect(translate.use).toHaveBeenCalledWith('en');
  });

  it('should create TranslateHttpLoader via HttpLoaderFactory', () => {
    const http = {} as HttpClient;
    const loader = HttpLoaderFactory(http);
    expect(loader instanceof TranslateHttpLoader).toBe(true);
  });
});
