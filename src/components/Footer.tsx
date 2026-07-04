import { Link } from 'react-router-dom';
import { Linkedin, Facebook, Mail, Phone, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { footerPartners, footerSponsors, settings, telHref } from '../config';

export const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-gradient-to-br from-[#1a3323] via-[#264d31] to-[#3d7050] text-white pt-16 md:pt-24 pb-8 md:pb-12 relative overflow-hidden border-t-2 border-white/10">
      {/* Dot texture overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px'}} />
      {/* Ambient glow orbs — layered depth */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-[#1a3323]/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-white/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-lbbc-green/20 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-24">
          <div>
            <h4 className="font-bold text-white mb-6 md:mb-8 uppercase tracking-widest text-xs md:text-sm border-b border-white/15 pb-4">{t.footer.navigate}</h4>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm font-medium text-white">
              {[
                { label: t.nav.home, path: '/' },
                { label: t.nav.about, path: '/about' },
                { label: t.nav.membership, path: '/membership' },
                { label: t.nav.events, path: '/events' },
                { label: t.nav.directory, path: '/directory' },
                { label: t.nav.resources, path: '/resources' },
                { label: t.nav.contact, path: '/contact' }
              ].map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="hover:text-white transition-colors flex items-center gap-2 group">
                    <ArrowUpRight size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Our Partners */}
          <div>
            <h4 className="font-bold text-white mb-6 md:mb-8 uppercase tracking-widest text-xs md:text-sm border-b border-white/15 pb-4">{t.footer.partners}</h4>
            <div className="grid grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              {footerPartners.map((p) => (
                <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="group">
                  <div className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl w-full flex items-center justify-center h-20 md:h-24 overflow-hidden transition-all group-hover:scale-[1.02] shadow-lg">
                    <picture>
                      <source srcSet={p.logoWebp} type="image/webp" />
                      <img src={p.logo} alt={p.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                    </picture>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Sponsors */}
          <div>
            <h4 className="font-bold text-white mb-6 md:mb-8 uppercase tracking-widest text-xs md:text-sm border-b border-white/15 pb-4">{t.footer.sponsors}</h4>
            <div className="grid grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              {footerSponsors.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="group">
                  <div className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl w-full flex items-center justify-center h-20 md:h-24 overflow-hidden transition-all group-hover:scale-[1.02] shadow-lg">
                    <picture>
                      <source srcSet={s.logoWebp} type="image/webp" />
                      <img src={s.logo} alt={s.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                    </picture>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-bold text-white mb-6 md:mb-8 uppercase tracking-widest text-xs md:text-sm border-b border-white/15 pb-4">{t.footer.contact}</h4>
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-3 md:space-y-4">
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 md:gap-4 text-[11px] md:text-xs text-white hover:text-white transition-colors group font-bold">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Mail size={14} className="text-white" />
                  </div>
                  {t.footer.email}: {settings.email}
                </a>
                <a href={telHref(settings.phone)} className="flex items-center gap-3 md:gap-4 text-[11px] md:text-xs text-white hover:text-white transition-colors group font-bold">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Phone size={14} className="text-white" />
                  </div>
                  {t.footer.tel}: {settings.phone}
                </a>
              </div>
              <Link to="/contact" className="w-full block text-center py-3 md:py-4 bg-white text-lbbc-green rounded-sm text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-lbbc-red hover:text-white transition-all shadow-xl active:scale-95">
                {t.nav.contact}
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-12 md:pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center md:items-end gap-10 md:gap-12">
          <div className="space-y-6 md:space-y-8 text-center md:text-start">
            <div className="flex justify-center md:justify-start gap-8 md:gap-10">
              <a href={settings.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-all hover:scale-110"><Linkedin size={24} /></a>
              <a href={settings.social.x} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-all hover:scale-110">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="md:w-6 md:h-6">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z" />
                </svg>
              </a>
              <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-all hover:scale-110"><Facebook size={24} /></a>
            </div>
            <p className="text-[9px] md:text-[11px] text-white uppercase tracking-[0.3em] font-bold">
              {t.footer.rights}
            </p>
          </div>
          <Link to="/" className="flex flex-col items-center md:items-end gap-3 md:gap-4 group">
            <picture>
              <source srcSet="/images/1PGomWa780IpyKLEScVCwx5SOUtqGimcM.webp" type="image/webp" />
              <img
                src="/images/1PGomWa780IpyKLEScVCwx5SOUtqGimcM.png"
                alt="LBBC Logo"
                className="h-12 md:h-16 brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                loading="lazy"
              />
            </picture>
            <span className="text-[8px] md:text-[9px] uppercase tracking-[0.5em] text-white font-black group-hover:text-white transition-colors">Libyan British Business Council</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};
