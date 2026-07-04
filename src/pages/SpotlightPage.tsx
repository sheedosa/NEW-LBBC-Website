import { motion } from 'framer-motion';
import { Mail, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/SEO';
import { settings, spotlight, telHref } from '../config';

export const SpotlightPage = () => {
  const { t } = useLanguage();
  const story = t.featured.fullStory;

  return (
    <div className="pt-32">
      <SEO 
        title={`${story.title} | Spotlight`} 
        description={story.p1.substring(0, 160)}
        canonical="spotlight/capterio"
      />
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center overflow-hidden bg-gradient-to-br from-[#1a3323] via-lbbc-green to-[#0f2117]">
        <img src={spotlight.heroImage} alt="Capterio Spotlight" className="absolute inset-0 w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl">
            <span className="inline-block bg-lbbc-green text-white px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-[0.4em] mb-6">{t.featured.tag}</span>
            <h1 className="text-3xl md:text-6xl font-black text-white leading-tight tracking-tight">{story.title}</h1>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-2/3">
              <div className="prose prose-slate prose-lg max-w-none space-y-8 text-slate-600 leading-relaxed">
                <p className="text-xl font-medium text-slate-900 leading-relaxed">{story.p1}</p>
                <p>{story.p2}</p>
                <p>{story.p3}</p>
                <div className="bg-slate-50 p-8 rounded-2xl border-l-4 border-lbbc-green my-12">
                  <p className="text-slate-900 font-bold italic text-lg m-0">{story.p4}</p>
                </div>
                <p>{story.p5}</p>
                <p>{story.p6}</p>
                <div className="pt-12 border-t border-slate-100">
                  <Link to="/membership" className="inline-flex items-center gap-3 bg-lbbc-green text-white px-8 py-4 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-lbbc-accent transition-all shadow-xl group">
                    {story.cta}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3 space-y-12">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 space-y-6">
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">{t.featured.aboutLbbc}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {t.featured.aboutLbbcText}
                </p>
              </div>
              <div className="space-y-6">
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">{t.footer.contact}</h4>
                <div className="space-y-4">
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-lbbc-green transition-colors font-bold">
                    <Mail size={18} className="text-lbbc-green" /> {settings.email}
                  </a>
                  <a href={telHref(settings.phone)} className="flex items-center gap-3 text-sm text-slate-600 hover:text-lbbc-green transition-colors font-bold">
                    <Phone size={18} className="text-lbbc-green" /> {settings.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpotlightPage;
