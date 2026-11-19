import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { settings } from '../config';

const ELFSIGHT_SRC = 'https://elfsightcdn.com/platform.js';

// LinkedIn preview (Elfsight widget). Shared by the Home and Contact pages so both show
// the same feed. 
export const LinkedInFeed = ({ className = 'pt-6 md:pt-10 pb-12 md:pb-20 bg-white' }: { className?: string }) => {
  const { t } = useLanguage();

  // Same loader the Contact page used: (re)run the Elfsight script on mount so the widget
  // initialises after client-side navigation, and clean it up on unmount.
  useEffect(() => {
    const script = document.createElement('script');
    script.src = ELFSIGHT_SRC;
    script.async = true;
    script.onerror = () => {};
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  return (
    <section id="linkedin" className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block mb-3 md:mb-4">{t.contact.socialTag}</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">{t.contact.socialTitle}</h2>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className={`elfsight-app-${settings.elfsightAppId}`} data-elfsight-app-lazy></div>
        </div>
      </div>
    </section>
  );
};
