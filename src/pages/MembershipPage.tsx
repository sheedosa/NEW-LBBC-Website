import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/SEO';
import { MemberDirectory } from '../components/HomeComponents';
import { GovernanceModal } from '../components/Modals';
import { settings } from '../config';

export const MembershipPage = () => {
  const { t } = useLanguage();
  const [showAllCouncilSupport, setShowAllCouncilSupport] = useState(false);
  const [showAllCorporateSupport, setShowAllCorporateSupport] = useState(false);
  const [showAllSoleTraderSupport, setShowAllSoleTraderSupport] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [location, setLocation] = useState<'uk' | 'libya'>('uk');
  const { hash } = useLocation();
  
  const tiers = [
    {
      ...t.membership.council,
      color: 'lbbc-green',
      price: location === 'uk' ? settings.membership.councilUk : settings.membership.councilLibya,
      link: {
        label: t.membership.joinNow,
        url: location === 'uk' ? settings.membership.applyCouncilUk : settings.membership.applyCouncilLibya
      }
    },
    {
      ...t.membership.corporate,
      color: 'lbbc-green',
      price: location === 'uk' ? settings.membership.corporateUk : settings.membership.corporateLibya,
      link: {
        label: t.membership.joinNow,
        url: location === 'uk' ? settings.membership.applyCorporateUk : settings.membership.applyCorporateLibya
      }
    },
    {
      ...t.membership.soleTrader,
      color: 'lbbc-green',
      price: settings.membership.soleTrader,
      link: { label: t.membership.joinNow, url: settings.membership.applySoleTrader }
    }
  ];

  const governancePolicies = t.membership.governancePolicies;
  const faqCategories = t.membership.faqCategories;

  const [activeFaqCategory, setActiveFaqCategory] = useState(faqCategories[0].id);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  
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
        title={t.nav.membership} 
        description="Join the LBBC network to access strategic dialogue, networking opportunities, and business support for the Libyan market."
        canonical="membership"
      />
      {/* Hero Banner */}
      <section className="relative h-[250px] md:h-[300px] flex items-center overflow-hidden bg-gradient-to-br from-[#1a3323] via-lbbc-green to-[#0f2117]">
        <picture className="absolute inset-0 w-full h-full">
          <source srcSet="/images/1AZ2sT2x2_l17cXYFOK3EwBg5Uocf-PVi.webp" type="image/webp" />
          <img
            src="/images/1AZ2sT2x2_l17cXYFOK3EwBg5Uocf-PVi.png"
            alt="Membership Header"
            className="w-full h-full object-cover opacity-60"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3323]/95 via-lbbc-green/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white font-black text-[8px] md:text-[9px] uppercase tracking-[0.4em] mb-4 md:mb-6 border border-white/20">
              {t.membership.tag}
            </span>
            <h1 className="text-2xl md:text-5xl font-black text-white leading-tight max-w-3xl tracking-tight">
              {t.membership.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Foundations Section */}
      <section id="value" className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 space-y-6 md:space-y-8"
            >
              <div className="space-y-4">
                <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block">{t.membership.foundationsTag}</span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {t.membership.foundationsTitle}
                </h2>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                {t.membership.foundationsDesc}
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Link 
                  to="/membership#tiers"
                  className="inline-flex items-center gap-2 bg-lbbc-green text-white px-8 py-4 rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-lbbc-accent transition-all shadow-lg hover:shadow-xl group"
                >
                  {t.membership.exploreTiers}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 relative"
            >
              <div className="absolute -inset-4 bg-lbbc-green/5 rounded-2xl -rotate-2"></div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[4/3]">
                <picture className="block w-full h-full">
                  <source srcSet="/images/1x6yFFfjnyRp7zKI70QDJrPyWt702-G7P.webp" type="image/webp" />
                  <img
                    src="/images/1x6yFFfjnyRp7zKI70QDJrPyWt702-G7P.png"
                    alt="LBBC Membership"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </picture>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Membership Tiers Section */}
      <section id="tiers" className="py-12 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-4 mb-12 md:mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block mb-4">{t.membership.tiersTag}</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {t.membership.tiersTitle}
              </h2>
            </motion.div>
          </div>

          {/* Location Toggle */}
          <div className="max-w-3xl mx-auto mb-12 md:mb-16">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100 text-center space-y-6">
              <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed">
                {t.membership.locationToggleLabel}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => setLocation('uk')}
                  className={`px-8 py-4 rounded-sm font-black text-[10px] uppercase tracking-widest transition-all border-2 ${
                    location === 'uk' 
                      ? 'bg-lbbc-green border-lbbc-green text-white shadow-lg' 
                      : 'bg-white border-slate-200 text-slate-400 hover:border-lbbc-green hover:text-lbbc-green'
                  }`}
                >
                  {t.membership.ukBased}
                </button>
                <button
                  onClick={() => setLocation('libya')}
                  className={`px-8 py-4 rounded-sm font-black text-[10px] uppercase tracking-widest transition-all border-2 ${
                    location === 'libya' 
                      ? 'bg-lbbc-green border-lbbc-green text-white shadow-lg' 
                      : 'bg-white border-slate-200 text-slate-400 hover:border-lbbc-green hover:text-lbbc-green'
                  }`}
                >
                  {t.membership.libyaBased}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:hidden space-y-8">
            {tiers.map((tier) => (
              <div key={tier.name} className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100">
                <div className={`p-6 ${tier.name === t.membership.council.name ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tight">{tier.name}</h3>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${tier.name === t.membership.council.name ? 'text-lbbc-green' : 'text-slate-400'}`}>
                        {tier.tag}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-lbbc-green">{tier.price}</span>
                      <span className="text-[10px] text-slate-400 block font-bold">/yr</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.membership.term}</p>
                      <p className="text-sm font-bold text-slate-900">{tier.term}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.membership.members}</p>
                      <p className="text-sm font-bold text-slate-900">{tier.members}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.membership.visibility}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{tier.visibility}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.membership.events}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{tier.events}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.membership.directory}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{tier.directory}</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.membership.support}</p>
                    <ul className="space-y-2">
                      {tier.support.map((item: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-lbbc-green flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                    <a
                      href={tier.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 rounded-sm font-black text-[10px] uppercase tracking-widest text-center transition-all shadow-md bg-lbbc-green text-white hover:bg-lbbc-accent"
                    >
                      {tier.link.label}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block overflow-x-auto pb-8"
          >
            <table className="w-full min-w-[1000px] border-collapse bg-white rounded-xl overflow-hidden shadow-xl border border-slate-200">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-6 py-8 text-left text-sm font-black uppercase tracking-widest border-r border-white/10 w-1/4">{t.membership.features}</th>
                  <th className="px-6 py-8 text-center text-sm font-black uppercase tracking-widest border-r border-white/10 w-1/4">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">{t.membership.council.name}</span>
                      <span className="text-[10px] text-lbbc-green font-bold tracking-tighter">{t.membership.council.tag}</span>
                    </div>
                  </th>
                  <th className="px-6 py-8 text-center text-sm font-black uppercase tracking-widest border-r border-white/10 w-1/4">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">{t.membership.corporate.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold tracking-tighter">{t.membership.corporate.tag}</span>
                    </div>
                  </th>
                  <th className="px-6 py-8 text-center text-sm font-black uppercase tracking-widest w-1/4">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">{t.membership.soleTrader.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold tracking-tighter">{t.membership.soleTrader.tag}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-lbbc-green/5">
                  <td className="px-6 py-8 font-extrabold text-slate-900 border-r border-slate-100 bg-slate-50/50">{t.membership.price}</td>
                  <td className="px-6 py-8 text-center border-r border-slate-100">
                    <span className="text-3xl font-black text-lbbc-green">{tiers[0].price}</span>
                    <span className="text-xs text-slate-400 block font-bold mt-1">/yr</span>
                  </td>
                  <td className="px-6 py-8 text-center border-r border-slate-100">
                    <span className="text-3xl font-black text-lbbc-green">{tiers[1].price}</span>
                    <span className="text-xs text-slate-400 block font-bold mt-1">/yr</span>
                  </td>
                  <td className="px-6 py-8 text-center">
                    <span className="text-3xl font-black text-lbbc-green">{tiers[2].price}</span>
                    <span className="text-xs text-slate-400 block font-bold mt-1">/yr</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-8 font-extrabold text-slate-900 border-r border-slate-100 bg-slate-50/50">{t.membership.term}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.council.term}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.corporate.term}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium">{t.membership.soleTrader.term}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-8 font-extrabold text-slate-900 border-r border-slate-100 bg-slate-50/50">{t.membership.members}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.council.members}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.corporate.members}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium">{t.membership.soleTrader.members}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-8 font-extrabold text-slate-900 border-r border-slate-100 bg-slate-50/50">{t.membership.visibility}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.council.visibility}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.corporate.visibility}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium">{t.membership.soleTrader.visibility}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-8 font-extrabold text-slate-900 border-r border-slate-100 bg-slate-50/50">{t.membership.events}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.council.events}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.corporate.events}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium">{t.membership.soleTrader.events}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-8 font-extrabold text-slate-900 border-r border-slate-100 bg-slate-50/50">{t.membership.support}</td>
                  <td className="px-6 py-8 text-slate-600 font-medium border-r border-slate-100">
                    <div className="space-y-3">
                      <ul className="space-y-2 text-sm list-disc list-inside text-left">
                        {t.membership.council.support.slice(0, 3).map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                        <AnimatePresence>
                          {showAllCouncilSupport && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden space-y-2 pt-2"
                            >
                              {t.membership.council.support.slice(3).map((item: string, i: number) => (
                                <li key={i}>{item}</li>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </ul>
                      <button 
                        onClick={() => setShowAllCouncilSupport(!showAllCouncilSupport)}
                        className="flex items-center gap-1 text-lbbc-green hover:text-lbbc-accent font-bold text-[10px] uppercase tracking-wider transition-colors"
                      >
                        {showAllCouncilSupport ? t.membership.showLess : t.membership.showMore}
                        {showAllCouncilSupport ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-slate-600 font-medium border-r border-slate-100">
                    <div className="space-y-3">
                      <ul className="space-y-2 text-sm list-disc list-inside text-left">
                        {t.membership.corporate.support.slice(0, 3).map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                        <AnimatePresence>
                          {showAllCorporateSupport && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden space-y-2 pt-2"
                            >
                              {t.membership.corporate.support.slice(3).map((item: string, i: number) => (
                                <li key={i}>{item}</li>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </ul>
                      <button 
                        onClick={() => setShowAllCorporateSupport(!showAllCorporateSupport)}
                        className="flex items-center gap-1 text-lbbc-green hover:text-lbbc-accent font-bold text-[10px] uppercase tracking-wider transition-colors"
                      >
                        {showAllCorporateSupport ? t.membership.showLess : t.membership.showMore}
                        {showAllCorporateSupport ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-slate-600 font-medium">
                    <div className="space-y-3">
                      <ul className="space-y-2 text-sm list-disc list-inside text-left">
                        {t.membership.soleTrader.support.slice(0, 3).map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                        <AnimatePresence>
                          {showAllSoleTraderSupport && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden space-y-2 pt-2"
                            >
                              {t.membership.soleTrader.support.slice(3).map((item: string, i: number) => (
                                <li key={i}>{item}</li>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </ul>
                      <button 
                        onClick={() => setShowAllSoleTraderSupport(!showAllSoleTraderSupport)}
                        className="flex items-center gap-1 text-lbbc-green hover:text-lbbc-accent font-bold text-[10px] uppercase tracking-wider transition-colors"
                      >
                        {showAllSoleTraderSupport ? t.membership.showLess : t.membership.showMore}
                        {showAllSoleTraderSupport ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-8 font-extrabold text-slate-900 border-r border-slate-100 bg-slate-50/50">{t.membership.directory}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.council.directory}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.corporate.directory}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium">{t.membership.soleTrader.directory}</td>
                </tr>
                <tr className="bg-slate-50/30">
                  <td className="px-6 py-10 font-extrabold text-slate-900 border-r border-slate-100 bg-slate-50/50">{t.membership.cta}</td>
                  <td className="px-6 py-10 text-center border-r border-slate-100">
                    <a href={tiers[0].link.url} target="_blank" rel="noopener noreferrer" className="bg-lbbc-green text-white px-4 py-3 rounded-sm font-black text-[9px] uppercase tracking-widest hover:bg-lbbc-accent transition-all shadow-md w-full max-w-[200px] text-center inline-block">{tiers[0].link.label}</a>
                  </td>
                  <td className="px-6 py-10 text-center border-r border-slate-100">
                    <a href={tiers[1].link.url} target="_blank" rel="noopener noreferrer" className="bg-lbbc-green text-white px-4 py-3 rounded-sm font-black text-[9px] uppercase tracking-widest hover:bg-lbbc-accent transition-all shadow-md w-full max-w-[200px] text-center inline-block">{tiers[1].link.label}</a>
                  </td>
                  <td className="px-6 py-10 text-center">
                    <a href={tiers[2].link.url} target="_blank" rel="noopener noreferrer" className="bg-lbbc-green text-white px-4 py-3 rounded-sm font-black text-[9px] uppercase tracking-widest hover:bg-lbbc-accent transition-all shadow-md w-full max-w-[200px] text-center inline-block">{tiers[2].link.label}</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Member Advantage Section */}
      <section id="why-join" className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block">{t.membership.tag}</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">{t.membership.title}</h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">{t.membership.desc}</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-16 md:mb-24">
            {[
              { title: t.membership.pillar1Title, description: t.membership.pillar1Desc },
              { title: t.membership.pillar2Title, description: t.membership.pillar2Desc },
              { title: t.membership.pillar3Title, description: t.membership.pillar3Desc },
              { title: t.membership.pillar4Title, description: t.membership.pillar4Desc }
            ].map((pillar, idx) => (
              <motion.div key={pillar.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-[2px] bg-lbbc-green"></div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{pillar.title}</h3>
                </div>
                <p className="text-slate-600 leading-relaxed pl-12">{pillar.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="bg-gradient-to-br from-[#1a3323] via-lbbc-green to-[#0f2117] rounded-2xl p-8 md:p-16 text-center space-y-8 relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight">{t.membership.cta}</h3>
              <div className="pt-4">
                <Link to="/membership#tiers" className="inline-flex items-center gap-3 bg-lbbc-green text-white px-10 py-4 rounded-sm font-black text-xs uppercase tracking-[0.2em] hover:bg-lbbc-accent transition-all shadow-xl group">
                  {t.hero.slides[0].cta1}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Membership Carousel */}
      <MemberDirectory />

      {/* FAQ Section */}
      <section className="py-16 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-20">
            <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block mb-3 md:mb-4">{t.membership.faqTag}</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">{t.membership.faqTitle}</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4 mb-12 md:mb-16">
              {faqCategories.map((category) => (
                <button key={category.id} onClick={() => { setActiveFaqCategory(category.id); setActiveQuestion(null); }} className={`px-6 py-3 rounded-sm font-black text-[10px] md:text-[11px] uppercase tracking-widest transition-all ${activeFaqCategory === category.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {category.title}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {faqCategories.find(c => c.id === activeFaqCategory)?.questions.map((item, idx) => (
                <div key={idx} className={`border border-slate-100 rounded-lg overflow-hidden transition-all ${activeQuestion === idx ? 'ring-1 ring-lbbc-green/30 shadow-md' : 'hover:border-slate-200'}`}>
                  <button onClick={() => setActiveQuestion(activeQuestion === idx ? null : idx)} className="w-full px-6 py-5 md:px-8 md:py-6 flex items-center justify-between text-left group">
                    <span className={`text-sm md:text-base font-bold transition-colors ${activeQuestion === idx ? 'text-lbbc-green' : 'text-slate-900 group-hover:text-lbbc-green'}`}>{item.q}</span>
                    <div className={`flex-shrink-0 ml-4 transition-transform duration-300 ${activeQuestion === idx ? 'rotate-180' : ''}`}>
                      <ChevronDown size={20} className={activeQuestion === idx ? 'text-lbbc-green' : 'text-slate-400'} />
                    </div>
                  </button>
                  <AnimatePresence>
                    {activeQuestion === idx && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0">
                          <div className="h-[1px] w-full bg-slate-100 mb-6"></div>
                          <div className="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-line">{item.a}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Governance Section */}
      <section id="governance" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block mb-3 md:mb-4">{t.membership.governanceTag}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight mb-4">{t.membership.governanceTitle}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {governancePolicies.map((policy) => (
              <button key={policy.title} onClick={() => setSelectedPolicy(policy)} className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-lbbc-green transition-all text-left group flex flex-col justify-between h-full">
                <h4 className="text-sm md:text-base font-black text-slate-900 leading-tight group-hover:text-lbbc-green transition-colors mb-4">{policy.title}</h4>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-lbbc-red transition-colors">
                  {t.membership.viewPolicy} <ArrowRight size={12} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <GovernanceModal policy={selectedPolicy} isOpen={!!selectedPolicy} onClose={() => setSelectedPolicy(null)} />
    </div>
  );
};

export default MembershipPage;
