import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/SEO';
import { GlueUpWidget } from '../components/GlueUpWidget';

// GlueUp's live membership-directory widget renders in the visitor's own browser (with its own
// search + filtering), so it is always current and unaffected by the datacenter IP block that
// stopped the server-side scrape.
const DIRECTORY_URL = 'https://lbbc.glueup.com/organization/5915/widget/membership-directory/corporate/';

export const DirectoryPage = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32">
      <SEO
        title={t.nav.directory}
        description="Explore the LBBC Member Directory to find leading British and Libyan companies across various sectors."
        canonical="directory"
      />

      {/* Hero Banner */}
      <section className="relative h-[250px] md:h-[300px] flex items-center overflow-hidden bg-gradient-to-br from-[#1a3323] via-lbbc-green to-[#0f2117]">
        <picture className="absolute inset-0 w-full h-full">
          <source srcSet="/images/1m0pcFsUJoAa0h4oTj57jnTosPbhuOTjS.webp" type="image/webp" />
          <img
            src="/images/1m0pcFsUJoAa0h4oTj57jnTosPbhuOTjS.png"
            alt="Directory Header"
            className="w-full h-full object-cover opacity-60"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3323]/95 via-lbbc-green/50 to-transparent rtl:from-[#1a3323]/95 rtl:via-lbbc-green/50 rtl:to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white font-black text-[9px] mb-4 md:mb-6 border border-white/20">
              {t.directory.pageTag}
            </span>
            <h1 className="text-2xl md:text-5xl font-black text-white leading-tight max-w-3xl tracking-tight">
              {t.directory.pageTitle}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-10 md:py-14 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-slate-600 leading-relaxed text-base max-w-2xl">
            {t.directory.intro}
          </p>
        </div>
      </section>

      {/* Live GlueUp member directory */}
      <section className="py-8 md:py-12 bg-slate-50/50 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-2 md:p-4">
            <GlueUpWidget src={DIRECTORY_URL} title="LBBC Member Directory" minHeight="900px" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DirectoryPage;
