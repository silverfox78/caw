import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../i18n/languages.js'

function LanguageSwitcher({ variant = 'floating' }) {
  const { i18n, t } = useTranslation()
  const current = i18n.language?.split('-')[0] ?? 'en'

  return (
    <div
      className={`lang-switcher lang-switcher--${variant}`}
      role="group"
      aria-label={t('lang.switchAria')}
    >
      {LANGUAGES.map((lang) => {
        const isActive = current === lang.code

        return (
          <button
            key={lang.code}
            type="button"
            className={`lang-switcher__btn${isActive ? ' lang-switcher__btn--active' : ''}`}
            onClick={() => i18n.changeLanguage(lang.code)}
            title={lang.nativeName}
            aria-label={lang.nativeName}
            aria-pressed={isActive}
          >
            <span className="lang-switcher__flag" aria-hidden="true">
              {lang.flag}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default LanguageSwitcher
