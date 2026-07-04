import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Globe, Briefcase, Users, Building2, Handshake, Target } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/SEO';
import { BioModal } from '../components/Modals';
import { leadership, board, partners } from '../config';

export const AboutPage = () => {
  const { t } = useLanguage();
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);


  return (
    <div className="pt-32">
      <SEO 
        title={t.nav.about} 
        description="Learn about the Libyan British Business Council, our leadership, board of directors, and our mission to foster UK-Libya trade."
        canonical="about"
      />
      {/* Header Banner */}
      <section className="relative h-[250px] md:h-[300px] flex items-center overflow-hidden bg-gradient-to-br from-[#1a3323] via-lbbc-green to-[#0f2117]">
        <img 
          src="/images/1Gvq_EVuoyOiiBD4ZQvVIOwMOVlMQAC0h.png" 
          alt="About Header" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3323]/95 via-lbbc-green/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white font-black text-[8px] md:text-[9px] uppercase tracking-[0.4em] mb-4 md:mb-6 border border-white/20">
              {t.about.page.tag}
            </span>
            <h1 className="text-2xl md:text-5xl font-black text-white leading-tight max-w-3xl tracking-tight">
              {t.about.page.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="py-16 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 lg:items-center">
            <div className="lg:w-1/2 space-y-6 md:space-y-10">
              <div className="space-y-3 md:space-y-4">
                <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block">{t.about.page.overviewTag}</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">{t.about.page.overviewTitle}</h2>
              </div>
              <div className="prose prose-slate prose-base md:prose-lg max-w-none text-slate-600 space-y-4 md:space-y-6">
                <p>
                  {t.about.page.overviewP1}
                </p>
                <p>
                  {t.about.page.overviewP2}
                </p>
                <p>
                  {t.about.page.overviewP3}
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
              <div className="bg-slate-50 p-6 md:p-8 rounded-xl md:rounded-2xl border border-slate-100 space-y-3 md:space-y-4 h-full">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-lbbc-green/10 rounded-lg md:rounded-xl flex items-center justify-center text-lbbc-green">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] md:text-xs">{t.about.page.feature1}</h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{t.about.page.feature1Text}</p>
              </div>
              <div className="bg-slate-50 p-6 md:p-8 rounded-xl md:rounded-2xl border border-slate-100 space-y-3 md:space-y-4 h-full">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-lbbc-green/10 rounded-lg md:rounded-xl flex items-center justify-center text-lbbc-green">
                  <Globe size={24} />
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] md:text-xs">{t.about.page.feature2}</h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{t.about.page.feature2Text}</p>
              </div>
              <div className="bg-slate-50 p-6 md:p-8 rounded-xl md:rounded-2xl border border-slate-100 space-y-3 md:space-y-4 h-full">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-lbbc-green/10 rounded-lg md:rounded-xl flex items-center justify-center text-lbbc-green">
                  <Briefcase size={24} />
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] md:text-xs">{t.about.page.feature3}</h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{t.about.page.feature3Text}</p>
              </div>
              <div className="bg-slate-50 p-6 md:p-8 rounded-xl md:rounded-2xl border border-slate-100 space-y-3 md:space-y-4 h-full">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-lbbc-green/10 rounded-lg md:rounded-xl flex items-center justify-center text-lbbc-green">
                  <Users size={24} />
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] md:text-xs">{t.about.page.feature4}</h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{t.about.page.feature4Text}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12 md:mb-16">
            <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block mb-3 md:mb-4">{t.about.page.missionTag}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight mb-4 md:mb-6">{t.about.page.missionTitle}</h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              {t.about.page.missionDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <div className="bg-white p-8 md:p-10 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 space-y-4 md:space-y-6 group hover:shadow-xl transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-lbbc-green text-white rounded-lg md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Handshake size={32} />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight whitespace-nowrap">{t.about.page.pillar1Title}</h3>
              <p className="text-sm md:text-slate-600 leading-relaxed">
                {t.about.page.pillar1Text}
              </p>
            </div>
            <div className="bg-white p-8 md:p-10 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 space-y-4 md:space-y-6 group hover:shadow-xl transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-lbbc-green text-white rounded-lg md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target size={32} />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight whitespace-nowrap">{t.about.page.pillar2Title}</h3>
              <p className="text-sm md:text-slate-600 leading-relaxed">
                {t.about.page.pillar2Text}
              </p>
            </div>
            <div className="bg-white p-8 md:p-10 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 space-y-4 md:space-y-6 group hover:shadow-xl transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-lbbc-green text-white rounded-lg md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight whitespace-nowrap">{t.about.page.pillar3Title}</h3>
              <p className="text-sm md:text-slate-600 leading-relaxed">
                {t.about.page.pillar3Text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Leadership Section */}
      <section id="leadership" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block mb-3 md:mb-4">{t.nav.leadership.toUpperCase()}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">{t.nav.leadership}</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {leadership.map((person) => (
              <div key={person.name} className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
                <div 
                  onClick={() => setSelectedPerson(person)}
                  className="aspect-square rounded-lg md:rounded-xl overflow-hidden bg-slate-50 mb-4 md:mb-6 relative cursor-pointer"
                >
                  <img 
                    src={person.image} 
                    alt={person.name} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-lbbc-green/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm md:text-xl font-black text-slate-900 tracking-tight">{person.name}</h3>
                  <p className="text-lbbc-green font-bold uppercase tracking-widest text-[8px] md:text-[10px]">{person.role}</p>
                  <button 
                    onClick={() => setSelectedPerson(person)}
                    className="mt-3 md:mt-4 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-lbbc-red flex items-center gap-2 transition-colors"
                  >
                    Read Bio <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Board Section */}
      <section id="board" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block mb-3 md:mb-4">{t.board.tag}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">{t.board.title}</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {board.map((person) => (
              <div key={person.name} className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
                <div 
                  onClick={() => setSelectedPerson(person)}
                  className="aspect-square rounded-lg md:rounded-xl overflow-hidden bg-slate-50 mb-4 md:mb-6 cursor-pointer"
                >
                  <img 
                    src={person.image} 
                    alt={person.name} 
                    className="w-full h-full object-cover transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm md:text-lg font-black text-slate-900 tracking-tight">{person.name}</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-[9px]">{person.role}</p>
                  <button 
                    onClick={() => setSelectedPerson(person)}
                    className="pt-3 md:pt-4 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-lbbc-green flex items-center gap-2 hover:text-lbbc-red transition-colors"
                  >
                    Read Bio <ArrowRight size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Partners Section */}
      <section id="partners" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block mb-3 md:mb-4">{t.partners.tag}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">{t.partners.title}</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10 items-center">
            {partners.map((partner) => (
              <a key={partner.name} href={partner.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 group w-full sm:w-[calc(50%-20px)] lg:w-[calc(25%-30px)] max-w-[320px]">
                <div className="h-32 md:h-48 w-full flex items-center justify-center transition-all bg-slate-50 rounded-2xl p-6 md:p-10 border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-xl">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-[70%] max-w-[85%] object-contain transition-all duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center group-hover:text-lbbc-green transition-colors">{partner.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <BioModal 
        person={selectedPerson} 
        isOpen={!!selectedPerson} 
        onClose={() => setSelectedPerson(null)} 
      />
    </div>
  );
};

export default AboutPage;
