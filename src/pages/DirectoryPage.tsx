import { useEffect, useId, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Search, X, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/SEO';
import { partners } from '../config';

// Members page (/members). Council and Corporate members are shown as two separate sections,
// Council first, each with its own search + sector filter. There is no Individual Members list.
//
// Data comes from public/data/members.json (the GlueUp snapshot that also feeds the home page
// ticker and site search). GlueUp's own embeddable widget can't be used for this layout: it
// only offers "Company Members" and "Individual Members" tabs inside its iframe, with council
// and corporate mixed into one list, and nothing inside that iframe can be changed from here.

interface Member {
  id?: string;
  name: string;
  sector?: string;
  logo?: string;
  about?: string;
  website?: string;
}

const MemberModal = ({ member, onClose }: { member: Member | null; onClose: () => void }) => {
  const { t } = useLanguage();
  const titleId = useId();

  useEffect(() => {
    if (!member) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [member, onClose]);

  return (
    <AnimatePresence>
      {member && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-xl md:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto p-6 md:p-10"
          >
            <button
              autoFocus
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 end-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-800"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-5 mb-6 pe-12">
              <div className="w-24 h-20 flex-shrink-0 rounded-xl border border-slate-100 bg-white flex items-center justify-center p-3">
                {member.logo ? (
                  <img src={member.logo} alt="" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <Building2 size={28} className="text-slate-300" />
                )}
              </div>
              <div>
                <h3 id={titleId} className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">{member.name}</h3>
                {member.sector && (
                  <p className="text-lbbc-green font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mt-2">{member.sector}</p>
                )}
              </div>
            </div>

            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.directory.about}</h4>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
              {member.about || t.directory.noDescription}
            </p>

            {member.website && (
              <a
                href={member.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 bg-lbbc-green text-white px-8 py-3 rounded-sm text-[11px] font-black hover:bg-lbbc-red transition-all uppercase tracking-widest"
              >
                {t.directory.visitWebsite}
                <ArrowUpRight size={14} />
              </a>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const MemberSection = ({
  id,
  title,
  members,
  isLoading,
  hasError,
  onSelect,
  className = '',
}: {
  id: string;
  title: string;
  members: Member[];
  isLoading: boolean;
  hasError: boolean;
  onSelect: (m: Member) => void;
  className?: string;
}) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('');
  const searchId = useId();
  const sectorId = useId();

  const sectors = useMemo(
    () => Array.from(new Set(members.map((m) => m.sector).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b)),
    [members],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (sector && m.sector !== sector) return false;
      if (!q) return true;
      return m.name.toLowerCase().includes(q) || (m.sector || '').toLowerCase().includes(q);
    });
  }, [members, query, sector]);

  const isFiltered = query.trim() !== '' || sector !== '';
  const clear = () => { setQuery(''); setSector(''); };

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`py-12 md:py-16 scroll-mt-32 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 id={`${id}-title`} className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-6 md:mb-8">{title}</h2>

        {/* Search + sector filter (each section has its own) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-5 mb-4 flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="relative flex-1">
            <label htmlFor={searchId} className="sr-only">{`${title} – ${t.directory.searchLabel}`}</label>
            <Search size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.directory.searchLabel}
              className="w-full h-12 ps-11 pe-4 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-500 focus:outline-none focus:border-lbbc-green focus:ring-2 focus:ring-lbbc-green/30"
            />
          </div>
          <div className="md:w-72">
            <label htmlFor={sectorId} className="sr-only">{`${title} – ${t.directory.allSectors}`}</label>
            <select
              id={sectorId}
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:border-lbbc-green focus:ring-2 focus:ring-lbbc-green/30"
            >
              <option value="">{t.directory.allSectors}</option>
              {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mb-6 min-h-[24px]">
          <p className="text-sm text-slate-600" aria-live="polite">
            {!isLoading && !hasError && (
              <>{t.directory.showing} <strong className="text-slate-900">{filtered.length}</strong> {filtered.length === 1 ? t.directory.memberSingular : t.directory.memberPlural}</>
            )}
          </p>
          {isFiltered && (
            <button onClick={clear} className="text-sm font-bold text-lbbc-green hover:text-lbbc-red underline underline-offset-4">
              {t.directory.clearFilters}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" aria-label={t.directory.loading}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : hasError ? (
          <p className="bg-white rounded-2xl border border-slate-100 px-6 py-10 text-center text-slate-600">{t.directory.errorText}</p>
        ) : filtered.length === 0 ? (
          <p className="bg-white rounded-2xl border border-slate-100 px-6 py-10 text-center text-slate-600">
            {t.directory.noResults.replace('{tab}', title)}
          </p>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((m) => (
              <li key={m.id || m.name}>
                <button
                  onClick={() => onSelect(m)}
                  className="w-full h-full text-start bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lbbc-green transition-all p-4 md:p-5 flex flex-col"
                >
                  <span className="h-20 md:h-24 w-full flex items-center justify-center mb-4">
                    {m.logo ? (
                      <img src={m.logo} alt="" className="max-w-[85%] max-h-full object-contain" loading="lazy" referrerPolicy="no-referrer" />
                    ) : (
                      <Building2 size={32} className="text-slate-300" />
                    )}
                  </span>
                  <span className="block text-sm md:text-base font-extrabold text-slate-900 leading-snug">{m.name}</span>
                  {m.sector && <span className="block text-xs text-slate-600 mt-1">{m.sector}</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export const DirectoryPage = () => {
  const { t } = useLanguage();
  const [council, setCouncil] = useState<Member[]>([]);
  const [corporate, setCorporate] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selected, setSelected] = useState<Member | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const byName = (a: Member, b: Member) => a.name.localeCompare(b.name);
    fetch('/data/members.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        setCouncil([...(data.council || [])].sort(byName));
        setCorporate([...(data.corporate || [])].sort(byName));
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="pt-32">
      <SEO
        title={t.nav.directory}
        description="Explore LBBC Council and Corporate members – leading British and Libyan companies across various sectors."
        canonical="members"
      />

      {/* Hero Banner */}
      <section className="relative h-[250px] md:h-[300px] flex items-center overflow-hidden bg-gradient-to-br from-[#1a3323] via-lbbc-green to-[#0f2117]">
        <picture className="absolute inset-0 w-full h-full">
          <source srcSet="/images/1m0pcFsUJoAa0h4oTj57jnTosPbhuOTjS.webp" type="image/webp" />
          <img
            src="/images/1m0pcFsUJoAa0h4oTj57jnTosPbhuOTjS.png"
            alt=""
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

      {/* Council members first, then Corporate members — each with its own search */}
      <MemberSection
        id="council"
        title={t.directory.councilTab}
        members={council}
        isLoading={isLoading}
        hasError={hasError}
        onSelect={setSelected}
        className="bg-slate-50/50"
      />
      <MemberSection
        id="corporate"
        title={t.directory.corporateTab}
        members={corporate}
        isLoading={isLoading}
        hasError={hasError}
        onSelect={setSelected}
        className="bg-white border-t border-slate-100"
      />

      {/* Partners — its own box at the bottom of the page */}
      <section id="partners" aria-labelledby="partners-title" className="py-12 md:py-16 bg-slate-50/50 border-t border-slate-100 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-10">
            <h2 id="partners-title" className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-8">{t.directory.partnersTitle}</h2>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {partners.map((partner) => (
                <li key={partner.name}>
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-3 h-full rounded-xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-lg transition-all p-5"
                  >
                    <span className="h-20 md:h-24 w-full flex items-center justify-center">
                      <img src={partner.logo} alt="" className="max-h-full max-w-[85%] object-contain" loading="lazy" referrerPolicy="no-referrer" />
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-600 text-center group-hover:text-lbbc-green transition-colors">{partner.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <MemberModal member={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default DirectoryPage;
