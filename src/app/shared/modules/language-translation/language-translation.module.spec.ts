import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory, LanguageTranslationModule } from './language-translation.module';

describe('LanguageTranslationModule', () => {
  it('should create HttpLoaderFactory instance', () => {
    const http = {} as HttpClient;
    const loader = HttpLoaderFactory(http);
    expect(loader).toBeTruthy();
  });

  it('should construct module with TranslateService', () => {
    const translate = jasmine.createSpyObj('TranslateService', [
      'addLangs',
      'setDefaultLang',
      'getBrowserLang',
      'use'
    ]);
    translate.getBrowserLang.and.returnValue('en');
    const module = new LanguageTranslationModule(translate);
    expect(module).toBeTruthy();
    expect(translate.addLangs).toHaveBeenCalled();
    expect(translate.setDefaultLang).toHaveBeenCalledWith('en');
    expect(translate.use).toHaveBeenCalledWith('en');
  });

  it('should fall back to en for unsupported browser language', () => {
    const translate = jasmine.createSpyObj('TranslateService', [
      'addLangs',
      'setDefaultLang',
      'getBrowserLang',
      'use'
    ]);
    translate.getBrowserLang.and.returnValue('xx');
    // match on unsupported returns nullish path -> 'en'
    // browserLang.match(...) is null for 'xx'
    new LanguageTranslationModule(translate);
    expect(translate.use).toHaveBeenCalledWith('en');
  });
});
