import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// The "view all" link in a home-page section header. One component so every section
// (members, events, partners, news) gets the same size, colour and tap area:
// 14px brand-green text (5.4:1 on white, WCAG AA) in a 44px-high target (WCAG 2.5.8).
export const SectionLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="group inline-flex items-center justify-center gap-2 min-h-11 text-sm font-bold uppercase tracking-widest text-lbbc-green hover:text-lbbc-red underline-offset-8 hover:underline focus-visible:underline transition-colors"
  >
    {children}
    <ArrowRight size={18} aria-hidden="true" className="flex-shrink-0 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
  </Link>
);
