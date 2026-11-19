import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Building2, Calendar, Newspaper, FileText, Hash } from 'lucide-react';
import { newsData } from '../data/news';

type ResultKind = 'page' | 'member' | 'event' | 'news';

interface Result {
  id: string;
  kind: ResultKind;
  title: string;
  subtitle: string;
  href: string;
  external?: boolean;
}

const PAGES: Result[] = [
  { id: 'home',       kind: 'page', title: 'Home',             subtitle: 'Main page',                          href: '/' },
  { id: 'about',      kind: 'page', title: 'About LBBC',       subtitle: 'Mission, leadership & board',        href: '/about' },
  { id: 'membership', kind: 'page', title: 'Membership',       subtitle: 'Join the council',                   href: '/membership' },
  { id: 'events',     kind: 'page', title: 'Events',           subtitle: 'Upcoming & past events',             href: '/events' },
  { id: 'directory',  kind: 'page', title: 'Members',          subtitle: 'Council & corporate members',        href: '/members' },
  { id: 'resources',  kind: 'page', title: 'Resources',        subtitle: 'Guides, news & media gallery',       href: '/resources' },
  { id: 'contact',    kind: 'page', title: 'Contact',          subtitle: 'Get in touch with the secretariat',  href: '/contact' },
];

const NEWS_RESULTS: Result[] = newsData.map(n => ({
  id:       n.id,
  kind:     'news',
  title:    n.title,
  subtitle: n.category,
  href:     `/news/${n.id}`,
}));

const KIND_ORDER: ResultKind[] = ['page', 'member', 'event', 'news'];

const KIND_LABELS: Record<ResultKind, string> = {
  page:   'Pages',
  member: 'Members',
  event:  'Events',
  news:   'News',
};

const KindIcon = ({ kind }: { kind: ResultKind }) => {
  const cls = 'flex-shrink-0';
  if (kind === 'page')   return <Hash   size={15} className={cls} />;
  if (kind === 'member') return <Building2 size={15} className={cls} />;
  if (kind === 'event')  return <Calendar  size={15} className={cls} />;
  return                        <Newspaper size={15} className={cls} />;
};

function highlight(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-lbbc-green/20 text-lbbc-green rounded-[2px] px-0.5 not-italic font-inherit">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [members, setMembers] = useState<Result[]>([]);
  const [events, setEvents]   = useState<Result[]>([]);
  const [cursor, setCursor]   = useState(0);
  const inputRef  = useRef<HTMLInputElement>(null);
  const listRef   = useRef<HTMLDivElement>(null);

  // Load member + event data once when palette first opens
  useEffect(() => {
    if (!isOpen) return;
    if (members.length === 0) {
      fetch('/data/members.json')
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return;
          const all = [...(data.council || []), ...(data.corporate || [])];
          setMembers(all.map((m: any) => ({
            id:       m.id,
            kind:     'member' as ResultKind,
            title:    m.name,
            subtitle: m.sector,
            href:     '/members',
          })));
        })
        .catch(() => {});
    }
    if (events.length === 0) {
      fetch('/data/events.json')
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return;
          const all = [...(data.upcoming || []), ...(data.past || [])];
          setEvents(all.map((e: any) => ({
            id:       e.id,
            kind:     'event' as ResultKind,
            title:    e.title,
            subtitle: e.date ? `${e.date}${e.location ? ' · ' + e.location : ''}` : (e.location || ''),
            href:     e.link || '/events',
            external: !!e.link && e.link.startsWith('http'),
          })));
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const allResults: Result[] = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const search = (pool: Result[]) =>
      pool.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q)
      );

    return [
      ...search(PAGES),
      ...search(members),
      ...search(events),
      ...search(NEWS_RESULTS),
    ].slice(0, 24);
  }, [query, members, events]);

  // Default suggestions when query is empty
  const defaultResults: Result[] = PAGES.slice(0, 5);
  const displayResults = query.trim() ? allResults : defaultResults;

  // Reset cursor when results change
  useEffect(() => { setCursor(0); }, [query]);

  const groupedResults = useMemo(() => {
    const groups: Partial<Record<ResultKind, Result[]>> = {};
    for (const r of displayResults) {
      if (!groups[r.kind]) groups[r.kind] = [];
      groups[r.kind]!.push(r);
    }
    return groups;
  }, [displayResults]);

  const flatForNav = displayResults;

  const go = useCallback((result: Result) => {
    onClose();
    if (result.external) {
      window.open(result.href, '_blank', 'noopener,noreferrer');
    } else {
      navigate(result.href);
    }
  }, [navigate, onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCursor(c => Math.min(c + 1, flatForNav.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCursor(c => Math.max(c - 1, 0));
      }
      if (e.key === 'Enter' && flatForNav[cursor]) {
        go(flatForNav[cursor]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, cursor, flatForNav, go, onClose]);

  // Scroll active item into view
  useEffect(() => {
    const active = listRef.current?.querySelector('[data-active="true"]') as HTMLElement | null;
    active?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  let flatIdx = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[10vh] md:pt-[12vh] bg-slate-950/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80"
            onClick={e => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
              <Search size={18} className="text-slate-400 flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search pages, members, events, news…"
                className="flex-1 text-sm text-slate-900 placeholder-slate-400 bg-transparent outline-none font-medium"
              />
              <div className="flex items-center gap-2">
                {query && (
                  <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={16} />
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-400 text-[10px] font-bold rounded border border-slate-200">
                  ESC
                </kbd>
              </div>
            </div>

            {/* Results */}
            <div ref={listRef} className="overflow-y-auto max-h-[420px] py-2 custom-scrollbar">
              {displayResults.length === 0 && query.trim() ? (
                <div className="py-14 text-center">
                  <Search size={28} className="mx-auto mb-3 text-slate-200" />
                  <p className="text-sm font-bold text-slate-400">No results for <span className="text-slate-600">"{query}"</span></p>
                  <p className="text-xs text-slate-300 mt-1">Try a member name, event title, or page</p>
                </div>
              ) : (
                <>
                  {!query.trim() && (
                    <p className="px-5 pt-2 pb-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick navigation</p>
                  )}
                  {KIND_ORDER.filter(k => groupedResults[k]).map(kind => {
                    const items = groupedResults[kind]!;
                    return (
                      <div key={kind}>
                        {query.trim() && (
                          <p className="px-5 pt-3 pb-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {KIND_LABELS[kind]}
                          </p>
                        )}
                        {items.map(result => {
                          const itemIdx = flatIdx++;
                          const isActive = itemIdx === cursor;
                          return (
                            <button
                              key={result.id}
                              data-active={isActive}
                              onClick={() => go(result)}
                              onMouseEnter={() => setCursor(itemIdx)}
                              className={`w-full flex items-center gap-3.5 px-5 py-3 text-left transition-colors ${
                                isActive ? 'bg-lbbc-green/8 text-slate-900' : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                                isActive ? 'bg-lbbc-green text-white' : 'bg-slate-100 text-slate-400'
                              }`}>
                                <KindIcon kind={result.kind} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold leading-tight truncate">
                                  {highlight(result.title, query)}
                                </p>
                                {result.subtitle && (
                                  <p className="text-xs text-slate-400 leading-tight mt-0.5 truncate">
                                    {highlight(result.subtitle, query)}
                                  </p>
                                )}
                              </div>
                              <ArrowRight
                                size={14}
                                className={`flex-shrink-0 transition-all ${isActive ? 'text-lbbc-green opacity-100' : 'opacity-0'}`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Footer hint */}
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
              <div className="hidden sm:flex items-center gap-4 text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 text-[9px] font-bold">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 text-[9px] font-bold">↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 text-[9px] font-bold">↵</kbd>
                  open
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium ms-auto">
                {query.trim() && allResults.length > 0 ? `${allResults.length} result${allResults.length !== 1 ? 's' : ''}` : 'LBBC Search'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
