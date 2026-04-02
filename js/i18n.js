/**
 * Internationalization (i18n) System
 * Manages language switching and translation loading
 */

class I18n {
  constructor() {
    this.currentLanguage = this.getDefaultLanguage();
    this.translations = {};
    this.listeners = [];
    this.init();
  }

  /**
   * Initialize i18n system
   */
  async init() {
    await this.loadTranslations();
    this.setupLanguageSwitcher();
    this.observeLanguageChanges();
    this.updateDOMTranslations();
  }

  /**
   * Get default language from URL, localStorage, or browser
   */
  getDefaultLanguage() {
    // Check URL parameter first (e.g., #lang=en)
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const urlLang = urlParams.get('lang');
    if (urlLang && ['ro', 'en'].includes(urlLang)) return urlLang;
    
    // Check localStorage
    const stored = localStorage.getItem('language');
    if (stored) return stored;
    
    // Fall back to browser language or default to Romanian
    const browserLang = navigator.language.split('-')[0];
    return ['ro', 'en'].includes(browserLang) ? browserLang : 'ro';
  }

  /**
   * Load all translation files
   */
  async loadTranslations() {
    try {
      const [roData, enData] = await Promise.all([
        fetch('translations/ro.json').then(r => r.json()),
        fetch('translations/en.json').then(r => r.json())
      ]);

      this.translations['ro'] = roData;
      this.translations['en'] = enData;
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  /**
   * Get translation key
   */
  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return value || key;
  }

  /**
   * Change language and trigger updates
   */
  setLanguage(lang) {
    if (!['ro', 'en'].includes(lang)) return;

    this.currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;

    // Notify all listeners of language change
    this.listeners.forEach(callback => callback(lang));
  }

  /**
   * Get current language
   */
  getLanguage() {
    return this.currentLanguage;
  }

  /**
   * Subscribe to language changes
   */
  onChange(callback) {
    this.listeners.push(callback);
  }

  /**
   * Setup language switcher in navigation
   */
  setupLanguageSwitcher() {
    const langSwitcher = document.querySelector('.lang-switch');
    if (!langSwitcher) return;

    const langLinks = langSwitcher.querySelectorAll('a');
    
    langLinks.forEach(link => {
      // Extract language from URL (e.g., #lang=en)
      const hrefParams = new URLSearchParams(link.href.split('#')[1]);
      const lang = hrefParams.get('lang') || 'ro';
      
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.setLanguage(lang);
      });

      // Mark current language as active
      if (lang === this.currentLanguage) {
        link.classList.add('active');
      }
    });

    this.onChange((lang) => {
      langLinks.forEach(link => {
        const hrefParams = new URLSearchParams(link.href.split('#')[1]);
        const linkLang = hrefParams.get('lang') || 'ro';
        link.classList.toggle('active', linkLang === lang);
      });
    });
  }

  /**
   * Observe language changes and update DOM
   */
  observeLanguageChanges() {
    this.onChange(() => {
      this.updateDOMTranslations();
    });
  }

  /**
   * Update all translations in DOM
   */
  updateDOMTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.dataset.i18n;
      const translation = this.t(key);
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.placeholder === element.dataset.placeholder) {
          element.placeholder = translation;
        }
      } else {
        element.textContent = translation;
      }
    });

    // Update page title
    document.title = this.t('site.title');

    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLanguage } }));
  }

  /**
   * Get all translations for a namespace
   */
  getNamespace(namespace) {
    return this.translations[this.currentLanguage]?.[namespace] || {};
  }
}

// Create global i18n instance
const i18n = new I18n();
