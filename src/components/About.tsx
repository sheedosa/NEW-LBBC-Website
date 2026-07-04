import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { settings } from '../config';

export const About = () => {
  const { t } = useLanguage();
  return (
    <section id="about" className="py-16 md:py-32 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          <div className="lg:w-2/5 space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block">{t.about.tag}</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">{t.about.title}</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-base md:text-lg">
              {t.about.p1}{t.about.p2}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8 pt-2 md:pt-4">
              <div className="space-y-1 md:space-y-2">
                <h4 className="text-2xl md:text-3xl font-black text-lbbc-green tracking-tighter">{settings.stats.years}</h4>
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.about.stats.years}</p>
              </div>
              <div className="space-y-1 md:space-y-2">
                <h4 className="text-2xl md:text-3xl font-black text-lbbc-green tracking-tighter">{settings.stats.members}</h4>
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.about.stats.members}</p>
              </div>
              <div className="space-y-1 md:space-y-2">
                <h4 className="text-2xl md:text-3xl font-black text-lbbc-green tracking-tighter">{settings.stats.network}</h4>
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.about.stats.network}</p>
              </div>
            </div>
            <div className="pt-6 md:pt-8">
              <Link 
                to="/about"
                className="inline-flex items-center justify-center gap-3 bg-lbbc-green text-white px-10 py-4 rounded-sm text-[11px] font-black uppercase tracking-[0.2em] hover:bg-lbbc-red transition-all shadow-xl active:scale-95"
              >
                {t.about.cta} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="lg:w-3/5 w-full relative">
            <div className="aspect-video lg:aspect-[16/10] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl relative z-10 bg-slate-200">
              <picture className="block w-full h-full">
                <source srcSet="/images/1vl2WDNPa1kGhixUCXHLuwlueyT1JLMNX.webp" type="image/webp" />
                <img
                  src="/images/1vl2WDNPa1kGhixUCXHLuwlueyT1JLMNX.jpg"
                  alt="The Bridge Between British and Libyan Business"
                  className="w-full h-full object-cover lg:object-center"
                  loading="lazy"
                />
              </picture>
            </div>
            <div className="absolute -top-6 -right-6 md:-top-12 md:-right-12 w-48 h-48 md:w-64 md:h-64 bg-lbbc-green/5 rounded-full blur-2xl md:blur-3xl -z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
