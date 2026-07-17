import { Injectable, signal, computed } from '@angular/core';
import { es } from '../../../assets/i18n/es';
import { en } from '../../../assets/i18n/en';

export type SupportedLanguage = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private translations: Record<SupportedLanguage, any> = { es, en };
  currentLang = signal<SupportedLanguage>('es');

  t = computed(() => this.translations[this.currentLang()]);

  setLanguage(lang: SupportedLanguage) {
    this.currentLang.set(lang);
    localStorage.setItem('ot_lang', lang);
  }

  constructor() {
    const saved = localStorage.getItem('ot_lang') as SupportedLanguage;
    if (saved && (saved === 'es' || saved === 'en')) {
      this.currentLang.set(saved);
    }
  }
}
