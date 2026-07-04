import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Mail, MapPin, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/SEO';
import { sponsorsEvents } from '../config';

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string | null;
  link: string;
};

type Tab = 'upcoming' | 'past';

export const EventsPage = () => {
  const { t } = useLanguage();
  const { hash } = useLocation();
  const [eventsData, setEventsData] = useState<{ upcoming: Event[]; past: Event[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
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

  useEffect(() => {
    fetch('/data/events.json')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setEventsData(data); })
      .catch(() => setFetchError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const upcomingCount = eventsData?.upcoming.length ?? 0;
  const pastCount = eventsData?.past.length ?? 0;
  const activeEvents = activeTab === 'upcoming' ? (eventsData?.upcoming ?? []) : (eventsData?.past ?? []);

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'upcoming', label: t.events.upcomingTab, count: upcomingCount },
    { id: 'past',     label: t.events.pastTab,     count: pastCount },
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

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-[11px] font-black transition-all border-2 ${
                  activeTab === tab.id
                    ? 'bg-lbbc-green border-lbbc-green text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-lbbc-green hover:text-lbbc-green'
                }`}
              >
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Fetch error */}
          {fetchError && (
            <div className="text-center py-24 space-y-4">
              <p className="text-slate-500 font-semibold">Unable to load events. Please try again.</p>
              <button
                onClick={() => { setFetchError(false); setIsLoading(true); fetch('/data/events.json').then(r => r.ok ? r.json() : Promise.reject()).then(data => setEventsData(data)).catch(() => setFetchError(true)).finally(() => setIsLoading(false)); }}
                className="bg-lbbc-green text-white px-6 py-2 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-lbbc-red transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Skeleton loading */}
          {!fetchError && isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-100 overflow-hidden animate-pulse">
                  <div className="aspect-video bg-slate-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                    <div className="h-4 bg-slate-100 rounded" />
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-8 bg-slate-50 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Event cards */}
          {!isLoading && !fetchError && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {activeEvents.length === 0 ? (
                  <div className="text-center py-24 text-slate-400">
                    <Calendar size={40} className="mx-auto mb-4 opacity-30" />
                    <p className="font-bold text-sm">
                      {activeTab === 'upcoming' ? t.events.noUpcoming : t.events.noPast}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeEvents.map((event, i) => (
                      <motion.a
                        key={event.id}
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.4) }}
                        className="group bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col"
                      >
                        {/* Image */}
                        <div className="relative aspect-video bg-slate-100 overflow-hidden">
                          {event.image ? (
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-lbbc-green/10 to-lbbc-green/5 flex items-center justify-center">
                              <Calendar size={32} className="text-lbbc-green/30" />
                            </div>
                          )}
                          {/* Date badge — positioned at bottom-start (flips with RTL) */}
                          {event.date && (
                            <div className="absolute bottom-3 start-3 bg-lbbc-green text-white text-[11px] font-black px-2.5 py-1 rounded-sm shadow-md">
                              {event.date.split('(')[0].trim()}
                            </div>
                          )}
                        </div>

                        {/* Card body */}
                        <div className="p-5 flex flex-col gap-2.5 flex-1">
                          <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-2 group-hover:text-lbbc-green transition-colors">
                            {event.title}
                          </h3>
                          {event.location && (
                            <div className="flex items-start gap-1.5 text-slate-500">
                              <MapPin size={12} className="mt-0.5 flex-shrink-0 text-lbbc-red/70" />
                              <span className="text-xs font-medium leading-tight line-clamp-1">{event.location}</span>
                            </div>
                          )}
                          <div className="mt-auto pt-3">
                            <span className="inline-flex items-center gap-1.5 bg-lbbc-green text-white text-[11px] font-black px-4 py-2.5 rounded-sm shadow-sm group-hover:bg-lbbc-red transition-colors">
                              {activeTab === 'upcoming' ? t.events.registerNow : t.events.viewDetails}
                              <ExternalLink size={11} />
                            </span>
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

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
