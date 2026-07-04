// UI copy now lives in editable JSON under content/translations/ (managed by the CMS).
// This module preserves the original `translations[language]` contract so LanguageContext
// and every `t.section.key` consumer keep working unchanged.
import en from '../content/translations/en.json';
import ar from '../content/translations/ar.json';

export const translations = { en, ar };
