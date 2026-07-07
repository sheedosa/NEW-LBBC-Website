import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Calendar, MapPin, Newspaper, Clock, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { GlueUpWidget } from './GlueUpWidget';

export const MemberDirectory = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/data/members.json')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          const all = [...(data.council || []), ...(data.corporate || [])];
          const withLogos = all.filter((m: any) => m.logo);
          setMembers(withLogos.slice(0, 20));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const allMembers = members.length > 0 ? [...members, ...members, ...members, ...members] : [];

  return (
    <section id="directory" className="py-12 md:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 md:mb-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-4 md:gap-6">
        <div className="text-center md:text-left">
          <span className="text-lbbc-green font-bold text-[9px] md:text-[11px] uppercase tracking-[0.3em] mb-2 block">{t.directory.tag}</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{t.directory.title}</h2>
        </div>
        <Link
          to="/directory"
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-lbbc-green transition-all"
        >
          {t.directory.cta}
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* w-full prevents RTL flex shrink-to-content on first render */}
      <div className="relative flex overflow-hidden w-full">
        {isLoading ? (
          <div className="flex gap-12 px-4 w-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-24 md:w-32 aspect-square rounded-full bg-slate-50 animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : (
          /* CSS marquee: content is ×4 so scrolling 25% of total = one full copy = seamless loop.
             Direction flips for RTL so items scroll in the reading direction. */
          <div
            key={language}
            className={`flex gap-6 md:gap-12 px-4 ${isRtl ? 'animate-marquee-rtl' : 'animate-marquee-ltr'}`}
          >
            {allMembers.map((member, i) => (
              <div key={`${member.id || member.name}-${i}`} className="flex-shrink-0 w-24 md:w-32 text-center group">
                <div className="aspect-square rounded-full overflow-hidden bg-white mb-3 border border-slate-100 shadow-sm group-hover:shadow-lg transition-all duration-500 group-hover:-translate-y-1 flex items-center justify-center p-4">
                  {member.logo ? (
                    <img
                      src={member.logo}
                      alt={member.name}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Building2 size={24} className="text-slate-200 group-hover:text-lbbc-red transition-colors duration-500" />
                  )}
                </div>
                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity truncate px-2">{member.name}</p>
              </div>
            ))}
          </div>
        )}

        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
      </div>

      <div className="mt-10 md:mt-12 text-center px-4">
        <Link
          to="/directory"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-lbbc-green text-white px-8 md:px-10 py-3 md:py-4 rounded-full text-[10px] font-bold hover:bg-lbbc-red transition-all shadow-lg hover:shadow-lbbc-red/20 hover:-translate-y-0.5 uppercase tracking-widest"
        >
          {t.directory.cta}
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
};

export const UpcomingEvents = () => {
  const { t } = useLanguage();

  return (
    <section id="events" className="py-16 md:py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-14 gap-6">
          <div className="text-center md:text-left">
            <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] mb-3 md:mb-4 block">{t.nav.upcoming.toUpperCase()}</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">{t.nav.events}</h2>
          </div>
          <Link
            to="/events"
            className="group inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-lbbc-red hover:text-white transition-all shadow-xl active:scale-95"
          >
            {t.events.viewAll}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Live GlueUp upcoming-events widget (renders in the visitor's browser — always current) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-2 md:p-4">
          <GlueUpWidget
            src="https://lbbc.glueup.com/organization/5915/widget/event-list/full-view"
            title="LBBC Upcoming Events"
            minHeight="520px"
          />
        </div>
      </div>
    </section>
  );
};

export const FeaturedStory = () => {
  const { t } = useLanguage();
  return (
    <section className="py-8 md:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-12 md:gap-24 items-center">
          <div className="lg:w-1/2 space-y-6 md:space-y-8 text-center md:text-left">
            <div className="space-y-4">
              <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block">{t.featured.tag}</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">{t.featured.title}</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-base md:text-lg">
              {t.featured.text}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 md:gap-8 pt-4">
              <Link
                to="/news/lbbc-noc-mou-energy-forum"
                className="w-full sm:w-auto bg-lbbc-green text-white px-8 md:px-10 py-4 rounded-sm text-xs font-bold hover:bg-lbbc-red transition-all uppercase tracking-widest shadow-xl text-center"
              >
                {t.featured.cta}
              </Link>
              <Link to="/resources#news" className="text-slate-900 font-bold text-xs uppercase tracking-widest flex items-center gap-2 group">
                {t.featured.allNews}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 w-full relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(64,119,79,0.2)] relative z-10 bg-slate-100 flex items-center justify-center">
              <picture className="block w-full h-full">
                <source srcSet="/images/lbbc-noc-mou-article.webp" type="image/webp" />
                <img
                  src="/images/lbbc-noc-mou-article.png"
                  alt="NOC and LBBC MoU Signing"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </picture>
            </div>
            <div className="absolute -top-6 -right-6 md:-top-12 md:-right-12 w-48 h-48 md:w-64 md:h-64 bg-lbbc-green/5 rounded-full blur-3xl -z-0"></div>
            <div className="absolute -bottom-6 -left-6 md:-bottom-12 md:-left-12 w-48 h-48 md:w-64 md:h-64 bg-lbbc-green/10 rounded-full blur-3xl -z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

import { newsData } from '../data/news';

export const LatestNews = () => {
  const { t } = useLanguage();
  const news = newsData;

  return (
    <section id="resources" className="py-8 md:py-16 bg-slate-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] mb-4 block">{t.news.tag}</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">{t.news.title}</h2>
          </div>
          <Link to="/resources#news" className="text-lbbc-green font-bold text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-2 group">
            {t.news.cta}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {news.map((item) => (
            <Link to={`/news/${item.id}`} key={item.id} className="space-y-4 md:space-y-6 group cursor-pointer block">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500 bg-slate-100 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-lbbc-green/5"></div>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lbbc-green font-black text-[8px] md:text-[9px] tracking-widest uppercase">{item.category}</span>
                </div>
                <h3 className="text-base md:text-lg font-extrabold text-slate-900 leading-snug group-hover:text-lbbc-red transition-colors line-clamp-2">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 md:mt-20 flex flex-col sm:flex-row justify-center gap-4 md:gap-6 px-4">
          <Link
            to="/resources#news"
            className="w-full sm:w-auto bg-lbbc-green text-white px-8 md:px-10 py-3 md:py-4 rounded-sm text-xs font-bold hover:bg-lbbc-red transition-all uppercase tracking-widest shadow-xl text-center"
          >
            {t.news.more}
          </Link>
          <Link
            to="/membership"
            className="w-full sm:w-auto bg-white border-2 border-lbbc-green text-lbbc-green px-8 md:px-10 py-3 md:py-4 rounded-sm text-xs font-bold hover:bg-lbbc-red hover:border-lbbc-red hover:text-white transition-all uppercase tracking-widest text-center"
          >
            {t.news.exclusive}
          </Link>
        </div>
      </div>
    </section>
  );
};

