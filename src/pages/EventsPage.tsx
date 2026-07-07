import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/SEO';
import { sponsorsEvents } from '../config';
import { GlueUpWidget } from '../components/GlueUpWidget';

type Tab = 'upcoming' | 'past';

// GlueUp's live event-list widget renders client-side (always current), replacing the
// server-side scrape that GlueUp now blocks.
const EVENTS_UPCOMING_URL = 'https://lbbc.glueup.com/organization/5915/widget/event-list/full-view';
const EVENTS_PAST_URL = 'https://lbbc.glueup.com/organization/5915/widget/event-list/full-view?listType=past';

export const EventsPage = () => {
  const { t } = useLanguage();
  const { hash } = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

  useEffect(() => {
    if (hash === '#past') {
      setActiveTab('past');
      const element = document.getElementById('upcoming');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'upcoming', label: t.events.upcomingTab },
    { id: 'past', label: t.events.pastTab },
  ];

  return (
    <div className="pt-32">
      <SEO
        title={t.nav.events}
        description="Stay updated on upcoming LBBC events, trade missions, and conferences focused on UK-Libya business opportunities."
        canonical="events"
      />

      {/* Header Banner */}
      <section className="relative h-[250px] md:h-[300px] flex items-center overflow-hidden bg-gradient-to-br from-[#1a3323] via-lbbc-green to-[#0f2117]">
        <picture className="absolute inset-0 w-full h-full">
          <source srcSet="/images/1BwuIsuhH6LWOAfM-5WB965n8lGqlBKYF.webp" type="image/webp" />
          <img
            src="/images/1BwuIsuhH6LWOAfM-5WB965n8lGqlBKYF.png"
            alt="Events Header"
            className="w-full h-full object-cover opacity-60"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3323]/95 via-lbbc-green/50 to-transparent rtl:from-[#1a3323]/95 rtl:via-lbbc-green/50 rtl:to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white font-black text-[9px] mb-4 md:mb-6 border border-white/20">
              {t.events.pageTag}
            </span>
            <h1 className="text-2xl md:text-5xl font-black text-white leading-tight max-w-3xl tracking-tight">
              {t.events.pageTitle}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Events Section */}
      <section id="upcoming" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Section header */}
          <div className="max-w-3xl mb-10 md:mb-14">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-lbbc-green/10 rounded-lg flex items-center justify-center text-lbbc-green flex-shrink-0">
                <Calendar size={20} />
              </div>
              <span className="text-lbbc-green font-bold text-[11px]">{t.events.tag}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">{t.events.calendarTitle}</h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              {t.events.calendarDesc}
            </p>
          </div>

          {/* Upcoming / Past tabs — swap the live widget source */}
          <div className="flex flex-wrap gap-2 mb-10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-sm text-[11px] font-black transition-all border-2 ${
                  activeTab === tab.id
                    ? 'bg-lbbc-green border-lbbc-green text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-lbbc-green hover:text-lbbc-green'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Live GlueUp event list (key forces a fresh load + spinner when switching tabs) */}
          <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-2 md:p-4 min-h-[500px]">
            <GlueUpWidget
              key={activeTab}
              src={activeTab === 'upcoming' ? EVENTS_UPCOMING_URL : EVENTS_PAST_URL}
              title={activeTab === 'upcoming' ? 'LBBC Upcoming Events' : 'LBBC Past Events'}
              minHeight="700px"
            />
          </div>

          {/* CTA buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 justify-center pt-8 border-t border-slate-200">
            <a
              href="https://lbbc.glueup.com/home/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-lbbc-green text-white px-10 py-4 rounded-sm text-[11px] font-black hover:bg-lbbc-red transition-all shadow-xl active:scale-95 text-center"
            >
              {t.events.memberSignIn}
            </a>
            <Link
              to="/membership"
              className="w-full sm:w-auto border-2 border-lbbc-green text-lbbc-green px-10 py-4 rounded-sm text-[11px] font-black hover:bg-lbbc-green hover:text-white transition-all shadow-lg active:scale-95 text-center"
            >
              {t.events.joinLBBC}
            </Link>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-lbbc-red font-bold text-[11px] block mb-4">{t.events.sponsorsTag}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{t.events.sponsorsTitle}</h2>
          </div>
          {/* Sponsor logo wall */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 mb-16">
            {sponsorsEvents.map(sponsor => (
              <div key={sponsor.alt}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center p-5 md:p-6 h-32 md:h-36 hover:shadow-md transition-shadow">
                <img src={sponsor.src} alt={sponsor.alt} loading="lazy"
                  className="max-h-16 md:max-h-20 max-w-[88%] w-auto object-contain" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              {t.events.sponsorsDesc}
            </p>
            <a
              href="mailto:events@lbbc.org.uk"
              className="inline-flex items-center justify-center gap-3 bg-lbbc-green text-white px-10 py-4 rounded-sm text-[11px] font-black hover:bg-lbbc-red transition-all shadow-xl active:scale-95"
            >
              {t.events.contactUs} <Mail size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
