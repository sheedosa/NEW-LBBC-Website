import { 
  Users, 
  Calendar, 
  Newspaper, 
  ArrowRight, 
  MapPin, 
  Mail, 
  Phone, 
  Linkedin, 
  Facebook, 
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Globe,
  ShieldCheck,
  Zap,
  ExternalLink,
  Building2,
  Briefcase,
  Search,
  ChevronDown,
  ChevronUp,
  Target,
  Award,
  Handshake,
  Filter,
  FileText,
  Download,
  Camera,
  Image as ImageIcon,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { translations } from './translations';

// --- News Data ---

const newsData = [
  {
    id: 'lbbc-eic-partnership',
    image: 'https://lh3.googleusercontent.com/d/1nN2e19HBGnxoO9FwxAb7xYQHp5ndlS-G',
    category: 'PARTNERSHIPS',
    title: 'LBBC Partners with the Energy Industries Council (EIC)',
    date: 'APRIL 16, 2026',
    content: `The Libyan British Business Council is pleased to announce a new partnership with the [Energy Industries Council (EIC)](https://www.the-eic.com), strengthening links between the UK–Libya business community and one of the energy sector’s leading international trade associations.

The EIC is a London-headquartered global trade association for companies that supply goods and services across the energy industries. It supports a broad range of energy operators and service providers through market intelligence, business events, and sector-focused engagement, with members across 127 countries.

For the LBBC, our role is to promote bilateral trade and business relations between the UK and Libya and this partnership creates added value for members operating in or exploring Libya’s energy market. It broadens access to relevant networks, market insight and industry dialogue at a time when interest in Libya’s upstream, gas and wider energy opportunities continues to grow.

The partnership also provides a closer connection to the energy business community focused on Libya and creates an additional channel for dialogue around market entry, project opportunities and the practical conditions needed to support long-term business engagement in Libya. 

The LBBC and the EIC look forward to encouraging informed discussion on Libya energy, broadening relevant connections and creating new opportunities for engagement between members of both organisations.`
  },
  {
    id: 'noc-chairman-keynote',
    image: 'https://lh3.googleusercontent.com/d/1Na6BOfAiwd7ztdaTTDH_pDIU1JmCuIjz',
    category: 'ENERGY',
    title: 'NOC Chairman Joins Libya Energy Forum in London as Keynote Speaker',
    date: 'APRIL 08, 2026',
    content: `We are delighted to announce that HE Masoud Suleiman, Chairman of the National Oil Corporation of Libya (NOC), will be attending the Libya Energy Forum alongside a delegation of 20 senior Libyan energy experts.
 
Taking place on 13 May 2026 in London, the Libya Energy Forum will bring senior Libyan leadership, international oil companies, independents, investors, technical partners and advisors for a day of strategic dialogue, targeted networking and direct engagement.

Hosted in association with the National Oil Corporation of Libya (NOC) and convened by the Libyan British Business Council, the forum takes place as part of Africa’s premier global upstream gathering and brings Libya’s energy priorities into a broader regional and international context.

Discussions will explore unlocking value across Libya’s upstream portfolio, Libya’s positioning within the global energy landscape, gas development and domestic supply potential, the role of technology and international partnerships, and workforce development and long term sector capacity.
 
Don't miss this exceptional opportunity to engage directly with NOC leadership and the wider Libyan energy delegation.
 
[Register today to attend](https://lbbc.glueup.com/event/realising-libyas-energy-ambitions-173494/)`
  },
  {
    id: 'halo-trust-partners',
    image: 'https://lh3.googleusercontent.com/d/1aYtvKVprywiGJhSjM1ojJQhGKPwjVrNj',
    category: 'CSR',
    title: 'The HALO Trust Calls for Corporate Partners in Libya',
    date: 'APRIL 05, 2026',
    content: `The Senior Management Team of the LBBC were briefed by The HALO Trust, a specialist organisation in humanitarian mine clearance.

Since 2019, HALO has been working across Libya to support the clearance of explosive hazards and strengthen local capacity, helping create safer conditions for communities and enabling the gradual return of economic activity.

Their work highlights the important link between safety, recovery and a functioning business environment. As part of its role in supporting responsible engagement in Libya, the LBBC continues to connect members with initiatives that contribute to longer-term stability and development.

HALO is currently engaging with organisations interested in supporting its work in Libya through partnerships and other forms of collaboration.

For further information on HALO’s work, please contact Poppy Robinson at poppy.robinson@halotrust.org`
  },
  {
    id: 'uk-embassy-evisa',
    image: 'https://lh3.googleusercontent.com/d/1j4yenovlq9tMOVS3V3bClW7q4Y1fUpvg',
    category: 'TRAVEL',
    title: 'UK Embassy in Tripoli Introduces E Visa for Libyan Travellers',
    date: 'APRIL 01, 2026',
    content: `The British Embassy in Libya has announced an important update to UK travel procedures. From 25 February 2026, Libyan travellers to the United Kingdom will be required to hold digital permission to travel in advance, either through an eVisa or an Electronic Travel Authorisation (ETA), depending on their circumstances.

The UK Government has also confirmed that most applicants granted a UK visit visa, as well as many other visa types, on or after this date will receive an eVisa instead of a physical visa sticker. Applicants will be instructed on how to access their eVisa through a UKVI account before travelling.

This is particularly relevant for Libyan nationals, as Libya remains on the UK’s list of visa-national countries and does not have a UK visa application centre in-country. In practice, many Libyan applicants travel to Tunis to apply, submit biometrics and return to stamp their visa entry sticker at the UK visa application centre there. Under the updated system, applications are submitted online and the eVisa is issued electronically, meaning travel is generally required only for the biometric appointment.

LBBC members seeking support with UK business travel may contact the Secretariat at secretariat@lbbc.org.uk. Council members receive complimentary visa support.`
  }
];

// --- SEO Component ---

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  type?: string;
}

const SEO = ({ title, description, canonical, type = 'website' }: SEOProps) => {
  const fullTitle = `${title} | LBBC`;
  const siteDescription = description || "The premier network for bilateral UK-Libya commercial partnership. Fostering trade, investment, and strategic dialogue.";
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={siteDescription} />
      {canonical && <link rel="canonical" href={`https://lbbc.org.uk/#${canonical}`} />}
      <meta property="og:type" content={type} />
    </Helmet>
  );
};

const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const newsItem = newsData.find(item => item.id === id);

  if (!newsItem) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h1 className="text-2xl font-bold">News not found</h1>
        <Link to="/" className="text-lbbc-green hover:underline mt-4 inline-block">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <SEO 
        title={newsItem.title} 
        description={newsItem.content.substring(0, 160)} 
        canonical={`news/${newsItem.id}`}
        type="article"
      />
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <img 
          src={newsItem.image} 
          alt={newsItem.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="inline-block bg-lbbc-green text-white px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-[0.4em] mb-6">
              {newsItem.category}
            </span>
            <h1 className="text-3xl md:text-6xl font-black text-white leading-tight tracking-tight">
              {newsItem.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-2/3">
              <div className="prose prose-slate prose-lg max-w-none space-y-8 text-slate-600 leading-relaxed">
                <Markdown>{newsItem.content}</Markdown>
              </div>
              
              <div className="pt-12 mt-12 border-t border-slate-100">
                <Link 
                  to="/resources"
                  className="inline-flex items-center gap-3 bg-lbbc-green text-white px-8 py-4 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-lbbc-red transition-all shadow-xl group"
                >
                  Back to Resources
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3 space-y-12">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 space-y-6">
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">About the LBBC</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {t.footer.about}
                </p>
              </div>

              <div className="space-y-6">
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Contact Us</h4>
                <div className="space-y-4">
                  <a href="mailto:secretariat@lbbc.org.uk" className="flex items-center gap-3 text-sm text-slate-600 hover:text-lbbc-green transition-colors font-bold">
                    <Mail size={18} className="text-lbbc-green" />
                    secretariat@lbbc.org.uk
                  </a>
                  <a href="tel:+442077887935" className="flex items-center gap-3 text-sm text-slate-600 hover:text-lbbc-green transition-colors font-bold">
                    <Phone size={18} className="text-lbbc-green" />
                    +44 (0) 20 7788 7935
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Language Context ---

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('lbbc_language');
      if (saved === 'en' || saved === 'ar') return saved;
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lbbc_language', lang);
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.lang = lang;
  };

  useEffect(() => {
    document.body.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.lang = language;
  }, [language]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// --- Components ---

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.home, href: '/' },
    { 
      name: t.nav.about, 
      href: '/about',
      dropdown: [
        { name: t.nav.mission, href: '/about#mission' },
        { name: t.nav.leadership, href: '/about#leadership' },
        { name: t.nav.board, href: '/about#board' },
        { name: t.nav.partners, href: '/about#partners' },
      ]
    },
    { 
      name: t.nav.membership, 
      href: '/membership',
      dropdown: [
        { name: t.nav.value, href: '/membership#value' },
        { name: t.nav.tiers, href: '/membership#tiers' },
        { name: t.nav.whyJoin, href: '/membership#why-join' },
      ]
    },
    { 
      name: t.nav.events, 
      href: '/events',
      dropdown: [
        { name: t.nav.upcoming, href: '/events#upcoming' },
        { name: t.nav.archive, href: '/events#archive' },
      ]
    },
    { name: t.nav.directory, href: '/directory' },
    { 
      name: t.nav.resources, 
      href: '/resources',
      dropdown: [
        { name: t.nav.guides, href: '/resources#toolkit' },
        { name: t.nav.newsInsights, href: '/resources#news' },
        { name: t.nav.mediaGallery, href: '/resources#gallery' },
      ]
    },
    { name: t.nav.contact, href: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white shadow-lg">
      {/* Mini Menu */}
      <div className="bg-lbbc-green text-white py-2.5 md:py-2 border-b border-white/5 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="hidden sm:flex items-center gap-4 md:gap-6">
            <a href="https://www.linkedin.com/company/libyan-british-business-council/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-all hover:scale-110"><Linkedin size={14} /></a>
            <a href="https://x.com/LBBCnews" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-all hover:scale-110">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z" />
              </svg>
            </a>
            <a href="https://www.facebook.com/LibyanBritishBusinessCouncil/#" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-all hover:scale-110"><Facebook size={14} /></a>
          </div>
          <div className="flex items-center justify-between w-full sm:w-auto gap-4 md:gap-10">
            <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
              <span className="flex items-center gap-2 hover:text-lbbc-red transition-colors cursor-default"><Phone size={10} className="text-white" /> +44 (0) 20 7788 7935</span>
              <span className="w-px h-3 bg-white/20"></span>
              <span className="flex items-center gap-2 hover:text-lbbc-red transition-colors cursor-default"><Mail size={10} className="text-white" /> secretariat@lbbc.org.uk</span>
            </div>
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-6">
              {/* Language Switcher */}
              <div className="flex items-center border-r border-white/20 pr-4 mr-2">
                <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-1 gap-1">
                  <button 
                    onClick={() => setLanguage('en')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-[10px] font-black tracking-widest ${language === 'en' ? 'bg-white text-lbbc-green shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                    title="Switch to English"
                  >
                    <img src="https://flagcdn.com/w40/gb.png" alt="UK Flag" className="w-3.5 h-auto rounded-[1px]" referrerPolicy="no-referrer" />
                    EN
                  </button>
                  <button 
                    onClick={() => setLanguage('ar')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-[10px] font-black tracking-widest ${language === 'ar' ? 'bg-white text-lbbc-green shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                    title="Switch to Arabic"
                  >
                    <img src="https://flagcdn.com/w40/ly.png" alt="Libya Flag" className="w-3.5 h-auto rounded-[1px]" referrerPolicy="no-referrer" />
                    AR
                  </button>
                </div>
              </div>
              
              <Link 
                to="/membership"
                className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] bg-white text-lbbc-green px-3 md:px-5 py-1.5 md:py-2 rounded-sm hover:bg-lbbc-red hover:text-white transition-all shadow-lg active:scale-95 whitespace-nowrap"
              >
                {t.nav.joinUs}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className={`transition-all duration-500 ${scrolled ? 'py-2' : 'py-3 md:py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="group">
              <img 
                src="https://lh3.googleusercontent.com/d/1PGomWa780IpyKLEScVCwx5SOUtqGimcM" 
                alt="LBBC Logo" 
                className="h-8 sm:h-10 md:h-12 transition-all duration-500 group-hover:scale-105" 
                referrerPolicy="no-referrer" 
              />
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center space-x-12">
            {navLinks.map((link) => (
              <div 
                key={link.name} 
                className="relative group"
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
                onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
              >
                {link.dropdown ? (
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Link 
                      to={link.href} 
                      className={`text-[12px] font-black transition-colors uppercase tracking-[0.25em] ${location.pathname === link.href ? 'text-lbbc-green' : 'text-slate-800 hover:text-lbbc-red'}`}
                    >
                      {link.name}
                    </Link>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''} text-slate-400`} />
                  </div>
                ) : (
                  <Link 
                    to={link.href} 
                    className={`text-[12px] font-black transition-colors uppercase tracking-[0.25em] ${location.pathname === link.href ? 'text-lbbc-green' : 'text-slate-800 hover:text-lbbc-red'}`}
                  >
                    {link.name}
                  </Link>
                )}
                <span className={`absolute -bottom-2 left-0 h-0.5 transition-all duration-300 bg-lbbc-green ${location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>

                {/* Dropdown Menu */}
                {link.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-56 bg-white shadow-2xl rounded-sm border-t-2 border-lbbc-green py-4 mt-2"
                      >
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="block px-6 py-3 text-[11px] font-bold text-slate-600 hover:text-lbbc-red hover:bg-slate-50 transition-all uppercase tracking-widest"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    type="text"
                    placeholder="Search..."
                    className="mr-2 px-3 py-1.5 text-sm rounded-sm border border-slate-200 text-slate-900 bg-slate-50 focus:outline-none transition-all"
                    autoFocus
                  />
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 rounded-full transition-all text-slate-600 hover:bg-slate-100 hover:text-lbbc-red"
              >
                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
              </button>
            </div>
            
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="lg:hidden p-2.5 rounded-full transition-all text-slate-600 hover:bg-slate-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 z-[60] bg-white overflow-y-auto"
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-12">
                <img 
                  src="https://lh3.googleusercontent.com/d/1PGomWa780IpyKLEScVCwx5SOUtqGimcM" 
                  alt="LBBC Logo" 
                  className="h-10" 
                  referrerPolicy="no-referrer" 
                />
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    setActiveDropdown(null);
                  }} 
                  className="p-2 text-slate-800"
                >
                  <X size={32} />
                </button>
              </div>

              <div className="space-y-8 flex-grow">
                {navLinks.map((link) => (
                  <div key={link.name} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Link
                        to={link.href}
                        className="block text-2xl font-black text-slate-900 hover:text-lbbc-red uppercase tracking-widest transition-colors"
                        onClick={() => {
                          setIsOpen(false);
                          setActiveDropdown(null);
                        }}
                      >
                        {link.name}
                      </Link>
                      {link.dropdown && (
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                          className="p-2 text-slate-400 hover:text-lbbc-red transition-colors"
                        >
                          <ChevronDown size={24} className={`transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                    
                    {link.dropdown && (
                      <AnimatePresence>
                        {activeDropdown === link.name && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pl-6 space-y-4 border-l-2 border-lbbc-green/20 overflow-hidden"
                          >
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.name}
                                to={item.href}
                                className="block text-lg font-bold text-slate-500 hover:text-lbbc-red uppercase tracking-widest transition-colors pt-2 first:pt-0"
                                onClick={() => {
                                  setIsOpen(false);
                                  setActiveDropdown(null);
                                }}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-12 border-t border-slate-100 space-y-6">
                {/* Mobile Language Switcher */}
                <div className="flex justify-center">
                  <div className="flex items-center bg-slate-100 rounded-full p-1.5 gap-2 border border-slate-200 shadow-inner">
                    <button 
                      onClick={() => {
                        setLanguage('en');
                        setIsOpen(false);
                      }}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all text-xs font-black tracking-widest ${language === 'en' ? 'bg-white text-lbbc-green shadow-md' : 'text-slate-500 hover:text-lbbc-green'}`}
                    >
                      <img src="https://flagcdn.com/w40/gb.png" alt="UK Flag" className="w-5 h-auto rounded-[1px]" referrerPolicy="no-referrer" />
                      EN
                    </button>
                    <button 
                      onClick={() => {
                        setLanguage('ar');
                        setIsOpen(false);
                      }}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all text-xs font-black tracking-widest ${language === 'ar' ? 'bg-white text-lbbc-green shadow-md' : 'text-slate-500 hover:text-lbbc-green'}`}
                    >
                      <img src="https://flagcdn.com/w40/ly.png" alt="Libya Flag" className="w-5 h-auto rounded-[1px]" referrerPolicy="no-referrer" />
                      AR
                    </button>
                  </div>
                </div>

                <Link 
                  to="/membership"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-5 bg-lbbc-green text-white font-black uppercase tracking-[0.2em] rounded-sm shadow-xl hover:bg-lbbc-red transition-all text-center block"
                >
                  {t.nav.joinUs}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      image: 'https://lh3.googleusercontent.com/d/1fzfMN6hXA9CDWB_2RMIU6azYmksCSkCe',
      title: t.hero.slides[0].title,
      subtitle: t.hero.slides[0].subtitle,
      cta1: t.hero.slides[0].cta1,
      cta2: t.hero.slides[0].cta2,
      link1: '/membership',
      link2: 'https://lbbc.glueup.com/home/'
    },
    {
      id: 2,
      image: 'https://lh3.googleusercontent.com/d/1G7_hqOMqyE9YeNN58gubHQ2W3gtv5SQI',
      title: t.hero.slides[1].title,
      subtitle: t.hero.slides[1].subtitle,
      cta1: t.hero.slides[1].cta1,
      cta2: t.hero.slides[1].cta2,
      link1: 'https://lbbc.glueup.com/event/realising-libyas-energy-ambitions-173494/',
      link2: 'mailto:events@lbbc.org.uk'
    },
    {
      id: 3,
      image: 'https://lh3.googleusercontent.com/d/1PG3cPBxL9ce2a8nIgqmSPT1UWejsH8qZ',
      title: t.hero.slides[2].title,
      subtitle: t.hero.slides[2].subtitle,
      cta1: t.hero.slides[2].cta1,
      cta2: t.hero.slides[2].cta2,
      link1: '/membership',
      link2: 'https://lbbc.glueup.com/account/login?ret=S6bk1bwBqj5v4TlS%2B842Yg%3D%3D'
    }
  ];

  useEffect(() => {
    // Preload images
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[750px] flex items-center overflow-hidden bg-slate-950">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0 gpu"
        >
          <img 
            src={slides[currentSlide].image} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-transparent"></div>
        </motion.div>
      </AnimatePresence>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-white w-full pt-28 pb-20 md:pt-20 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center mb-4 md:mb-8"
            >
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-white drop-shadow-md">Libyan British Business Council</span>
            </motion.div>
            
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black leading-tight md:leading-[1.1] mb-5 md:mb-8 tracking-tight">
              {slides[currentSlide].title}
            </h1>
            
            <p className="text-xs sm:text-base md:text-lg font-medium leading-relaxed mb-8 md:mb-12 text-white/90 max-w-2xl">
              {slides[currentSlide].subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-5">
              {slides[currentSlide].link1.startsWith('http') ? (
                <a 
                  href={slides[currentSlide].link1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden bg-lbbc-green text-white px-8 md:px-10 py-3.5 md:py-4 rounded-sm text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:shadow-[0_20px_40px_-10px_rgba(239,68,68,0.5)] active:scale-95 w-full sm:w-auto text-center"
                >
                  <span className="relative z-10">{slides[currentSlide].cta1}</span>
                  <div className="absolute inset-0 bg-lbbc-red translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </a>
              ) : (
                <Link 
                  to={slides[currentSlide].link1}
                  className="group relative overflow-hidden bg-lbbc-green text-white px-8 md:px-10 py-3.5 md:py-4 rounded-sm text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:shadow-[0_20px_40px_-10px_rgba(239,68,68,0.5)] active:scale-95 w-full sm:w-auto text-center"
                >
                  <span className="relative z-10">{slides[currentSlide].cta1}</span>
                  <div className="absolute inset-0 bg-lbbc-red translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </Link>
              )}

              {slides[currentSlide].link2?.startsWith('http') || slides[currentSlide].link2?.startsWith('mailto:') ? (
                <a 
                  href={slides[currentSlide].link2}
                  target={slides[currentSlide].link2.startsWith('http') ? "_blank" : undefined}
                  rel={slides[currentSlide].link2.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 md:px-10 py-3.5 md:py-4 rounded-sm text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95 w-full sm:w-auto text-center"
                >
                  {slides[currentSlide].cta2}
                </a>
              ) : (
                <Link 
                  to={slides[currentSlide].link2 || '#'}
                  className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 md:px-10 py-3.5 md:py-4 rounded-sm text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95 w-full sm:w-auto text-center"
                >
                  {slides[currentSlide].cta2}
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Refined Controls */}
      <div className="absolute bottom-8 md:bottom-12 left-4 right-4 sm:left-6 sm:right-6 max-w-7xl mx-auto flex justify-between items-end z-20">
        <div className="flex gap-1.5 sm:gap-2">
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className="group py-4 px-1 outline-none"
            >
              <div className={`h-1 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-8 sm:w-12 bg-lbbc-red' : 'w-4 sm:w-6 bg-white/20 group-hover:bg-white/40'}`}></div>
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 sm:gap-3">
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-white/10 hover:bg-lbbc-red hover:text-white transition-all group"
          >
            <ChevronLeft size={18} className="group-active:scale-90 transition-transform" />
          </button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-white/10 hover:bg-lbbc-red hover:text-white transition-all group"
          >
            <ChevronRight size={18} className="group-active:scale-90 transition-transform" />
          </button>
        </div>
      </div>

      {/* Decorative vertical line */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-6 opacity-20">
        <span className="text-[10px] font-black uppercase tracking-[0.5em] rotate-90 whitespace-nowrap">{t.gallery.scrollToExplore}</span>
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-white to-transparent"></div>
      </div>
    </section>
  );
};

const About = () => {
  const { t } = useLanguage();
  return (
    <section id="about" className="py-16 md:py-32 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          <div className="lg:w-2/5 space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block">{t.about.tag}</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">{t.about.title}</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-base md:text-lg">
              {t.about.p1}{t.about.p2}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8 pt-2 md:pt-4">
              <div className="space-y-1 md:space-y-2">
                <h4 className="text-2xl md:text-3xl font-black text-lbbc-green tracking-tighter">20+</h4>
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.about.stats.years}</p>
              </div>
              <div className="space-y-1 md:space-y-2">
                <h4 className="text-2xl md:text-3xl font-black text-lbbc-green tracking-tighter">150+</h4>
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.about.stats.members}</p>
              </div>
              <div className="space-y-1 md:space-y-2">
                <h4 className="text-2xl md:text-3xl font-black text-lbbc-green tracking-tighter">1000+</h4>
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.about.stats.network}</p>
              </div>
            </div>
            <div className="pt-6 md:pt-8">
              <Link 
                to="/about"
                className="inline-flex items-center justify-center gap-3 bg-lbbc-green text-white px-10 py-4 rounded-sm text-[11px] font-black uppercase tracking-[0.2em] hover:bg-lbbc-red transition-all shadow-xl active:scale-95"
              >
                {t.about.cta} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="lg:w-3/5 w-full relative">
            <div className="aspect-video lg:aspect-[16/10] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl relative z-10 bg-slate-200">
              <img 
                src="https://lh3.googleusercontent.com/d/1vl2WDNPa1kGhixUCXHLuwlueyT1JLMNX" 
                alt="The Bridge Between British and Libyan Business" 
                className="w-full h-full object-cover lg:object-center"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -top-6 -right-6 md:-top-12 md:-right-12 w-48 h-48 md:w-64 md:h-64 bg-lbbc-green/5 rounded-full blur-2xl md:blur-3xl -z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BioModal = ({ person, isOpen, onClose }: { person: any, isOpen: boolean, onClose: () => void }) => {
  const { t } = useLanguage();
  if (!person) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-2xl flex flex-col-reverse md:flex-row max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-slate-100/80 hover:bg-slate-200 rounded-full transition-colors text-slate-800 md:text-white md:bg-black/20 backdrop-blur-sm"
            >
              <X size={20} />
            </button>

            <div className="hidden md:block md:w-2/5 relative bg-slate-100 flex-shrink-0">
              <img 
                src={person.image} 
                alt={person.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="w-full md:w-3/5 p-6 md:p-12 overflow-y-auto">
              <div className="mb-6 md:mb-8 pr-10 md:pr-0">
                <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mb-1 md:mb-2">{person.name}</h3>
                <p className="text-lbbc-green font-bold uppercase tracking-[0.3em] text-[10px] md:text-sm">{person.role}</p>
              </div>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed text-base md:text-lg whitespace-pre-line">
                  {person.bio || t.about.leadershipBioFallback.replace('{name}', person.name).replace('{role}', person.role)}
                </p>
              </div>
              <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-slate-100 flex items-center gap-6">
                <a href="#" className="text-slate-400 hover:text-lbbc-red transition-colors"><Linkedin size={20} /></a>
                <a href="#" className="text-slate-400 hover:text-lbbc-red transition-colors"><Mail size={20} /></a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const GovernanceModal = ({ policy, isOpen, onClose }: { policy: any, isOpen: boolean, onClose: () => void }) => {
  const { t } = useLanguage();
  if (!policy) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-2xl p-8 md:p-12 max-h-[90vh] overflow-y-auto"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-800"
            >
              <X size={20} />
            </button>

            <div className="mb-6 md:mb-8">
              <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block mb-2">{t.membership.policyStatement}</span>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{policy.title}</h3>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                {policy.content}
              </p>
            </div>
            
            <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
              <button 
                onClick={onClose}
                className="bg-lbbc-green text-white px-8 py-3 rounded-full text-xs font-bold hover:bg-lbbc-red transition-all uppercase tracking-widest"
              >
                {t.membership.close}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const AboutPage = () => {
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

  const leadership = [
    {
      name: 'Lord Trefgarne',
      role: 'Honorary President',
      image: 'https://lh3.googleusercontent.com/d/1GJzC8N2lF2CVOQJ32QxZpJi4CIgivksG',
      bio: 'Lord Trefgarne served in the Conservative administration of Margaret Thatcher as a Government Whip from 1979 to 1981 and as Parliamentary Under-Secretary of State at the Department of Trade in 1981; at the Foreign and Commonwealth Office from 1981 to 1982; at the Department of Health and Social Security from 1982 to 1983; and at the Ministry of Defence from 1983 to 1985. \n\nHe was then promoted to Minister of State for Defence Support, a post he held until 1986, and then served as Minister of State for Defence Procurement from 1986 to 1989 and as a Minister of State at the Department of Trade and Industry from 1989 to 1990. In 1989 he was admitted to the Privy Council. \n\nLord Trefgarne was Chairman of the LBBC from its foundation until December 2013.'
    },
    {
      name: 'Peter Millett CMG',
      role: 'Chairman',
      image: 'https://lh3.googleusercontent.com/d/1GaKHyh3sGNZ4J22uMJ0RHM4wHTZ5FvXN',
      bio: 'Peter Millett was appointed as Chairman of the LBBC on 2 March 2022.\n\nHe served as British Ambassador to Libya from June 2015 to January 2018.  \n\nDuring that time he played a role in supporting the UN’s efforts to negotiate and then implement the Libya Political Agreement. He met and built relationships with key political, security and economic players in Libya and in the international community. He also managed the return of the British Embassy from Tunis to Tripoli. \n\nBefore Libya, he was British Ambassador to Jordan from 2011 to 2015 and High Commissioner to Cyprus from 2015 to 2010. Earlier in his career he had diplomatic postings in Venezuela, Qatar, Brussels and Athens.'
    },
    {
      name: 'Susie Davies',
      role: 'CEO',
      image: 'https://lh3.googleusercontent.com/d/1wZxvkLfdJjlkWgNp_JSyAcNDVFLMxxIA',
      bio: `Susie Davies joined the LBBC in April 2018 and serves as CEO, running the Business Council from the UK alongside Awatef Shawish in Libya. She is responsible for supporting and growing the membership base, organising events and delegations across the UK and Libya, fostering strategic partnerships, and leading initiatives to strengthen bilateral trade relations between the two countries.

An expert in education and digital training, Susie has worked extensively with the NHS and other organisations across the UK, delivering elearning programmes and digital resources that enhance workforce capability and development.

Before joining the LBBC, Susie worked for Thomson Reuters as a Project Manager within the Global Operations division. Prior to joining Reuters, she organised international delegations to many countries including Libya, building valuable cross-border business connections.`
    },
    {
      name: 'Awatef Shawish',
      role: 'Business Development Director',
      image: 'https://lh3.googleusercontent.com/d/1yfeorNurq8NSzAojDA5Hj-Ij4OFXftV6',
      bio: `Awatef Shawish joined the LBBC in September 2024 and is currently the LBBC’s Business Development Director in Libya.

She is responsible for running the Business Council in Libya, focusing on growing and supporting members across Libya and the UK, organising events and delegations, developing strategic partnerships, and leading marketing initiatives to strengthen bilateral trade relations.

Before joining the LBBC, Awatef worked for the German International Cooperation Agency, GIZ, as an Administration and Finance Manager in the Libya Office.  Prior to joining GIZ, she worked at the British Council as the Programme Director, Managing several projects across Libya and the MENA region. Awatef is also a Co-Founder of a Non-Governmental Organisation called Peace, Equality, and Prosperity (PEP), focused on youth and women capacity development.

Awatef Shawish brings a wealth of expertise, leadership acumen, and a passion for societal advancement to her role at LBBC, embodying a dedication to fostering collaboration, growth, and sustainable development within the Libyan business landscape.`
    }
  ];

  const board = [
    { 
      name: 'Ghassan Atiga', 
      role: 'Head of Libya Business, Bank ABC', 
      image: 'https://lh3.googleusercontent.com/d/1lZnTxLNqqFSCkP4c0E3hAUBaVFw1pSAq',
      bio: `Ghassan as Head of Libyan Business for Bank ABC, has a robust foundation in corporate and trade finance.  The Libyan Business Coverage leverages a deep collective expertise in MENA, Europe and North America markets within Bank ABC global coverage in 16 countries. The group’s commitment to excellence and strategic insight has empowered them to nurture pivotal cross-border partnerships, reinforcing Bank ABC’s presence as a stalwart in international wholesale banking.  Ghassan joined the LBBC Board in April 2025.`
    },
    { 
      name: 'Ahmed Ben Halim', 
      role: 'Founder and Chairman, Libya Holdings Group', 
      image: 'https://lh3.googleusercontent.com/d/1nBpPgZVRGPPNqoP0vDAXCeJTCJJY3B9z',
      bio: `Ahmed is the Founder and Chairman of Libya Holdings Group Ltd. (LHG).  Ahmed has over 35 years’ experience in Principal Investments, Corporate Finance and Asset Management.  Ahmed serves as Ahmed is the Founder and Chairman of Libya Holdings Group Ltd. (LHG).  Ahmed has over 35 years’ experience in Principal Investments, Corporate Finance and Asset Management.  Ahmed serves as operating businesses in Libya.  LHG provides its partners with local knowledge, a network of contacts, operational support and seed capital.`
    },
    { 
      name: 'Husni Bey', 
      role: 'Owner and Chairman, HB Group', 
      image: 'https://lh3.googleusercontent.com/d/1T-vsHm0pW3DVeFsW7wzt-rXxY8oTRajU',
      bio: `Husni Bey holds credentials as a Master Mariner and an MSc in Economics. Since assuming leadership of the family business in 1993, he has been instrumental in transforming HB Group from a logistics company into a diversified conglomerate spanning technology, finance and banking, manufacturing, trading, real estate development, and fast-moving consumer goods distribution. Under his guidance, HB Group has become one of Libya’s leading FMCG distributors.

Beyond his business achievements, Husni Bey is recognized as a prominent advocate for private enterprise in Libya. He has consistently championed the need for government investment in critical sectors including education, healthcare, capacity building, and infrastructure development. His leadership philosophy centers on the belief that sustainable economic growth requires both private sector innovation and strategic public investment in foundational systems.

Through his stewardship of HB Group and his advocacy for progressive economic policies, Husni Bey has established himself as a key figure in Libya’s business landscape and a voice for balanced economic development. Husni Bey joined the LBBC Board in July 2025.`
    },
    { 
      name: 'Melanie Butler', 
      role: 'Partner, Integrity Global Advisors', 
      image: 'https://lh3.googleusercontent.com/d/1rMM_bWvDUDOYaY4ni01u6eN01dqkZCpQ',
      bio: `Melanie Butler as Partner at PwC led their Global Crisis Centre “GCC”, which acts as a trusted guide to clients as they prepare for, respond to and recover from the crises they face. Prior to her GCC role, she led our Deals Advisory practice based in Tripoli, Libya, post-revolution. Her clients included the National Transitional Council’s Temporary Financing Mechanism, Ministries of Health, Housing and Education, World Bank [WB] and General Electric Company of Libya [GECOL]. She has been a partner at PwC in the UK since 2003.

A forensic accountant by background, Melanie’s experience is focused on crisis response, financial management, investigations and contract examinations, in particular the areas of transparency, accountability and governance. She joined the Board of the LBBC in 2014.`
    },
    { 
      name: 'Tarek Eltumi', 
      role: 'Founder and Partner, Eltumi Partners', 
      image: 'https://lh3.googleusercontent.com/d/1KjCsgV1zJO6HkxdXWVIsltBVnoiQRY9H',
      bio: `Tarek is a dual Libyan/New York qualified lawyer with a broad practice that covers general corporate and commercial matters (foreign direct investment, joint ventures, restructurings), project development, finance and dispute resolution. He works principally in the sovereign wealth, energy, infrastructure and telecommunications sectors, with a geographic focus mainly on Libya, but also on Europe and Sub-Saharan Africa more generally.

Tarek practised in Tripoli, Libya for just under 10 years where he advised on a range of innovative international finance deals and major infrastructure, oil and gas and tourism projects. Tarek went on to work as General Counsel of AECOM Libya Housing and Infrastructure Inc., where he directed all legal issues arising from the US$55bn Libyan Housing and Infrastructure Program.

During the 2011 Libyan uprising, he served as special advisor and member of staff of the Prime Minister of Libya appointed by the National Transitional Council.

Tarek then went on to join the international law firm Hogan Lovells 2012 where he ran that firm’s Libya Practice and was a member of the Infrastructure, Energy, Resources and Projects practice.  Tarek became Partner at that firm and retired in June 2018 to pursue establishing Eltumi & Co as a leading Libyan law practice.

Tarek is fluent in both English and Arabic and is widely published on matters of Libyan law.`
    },
    { 
      name: 'Pauline Graham', 
      role: 'Co-Founder, Libyan British Business Council', 
      image: 'https://lh3.googleusercontent.com/d/1LpH1-ewdmGn4n4zuYSCJAkSMI1h9IAr2',
      bio: `Pauline Graham has spent her working career in the exhibitions and conference industry. With her late husband, Dermot Graham, she set up an events management company which organised trade and investment delegations to overseas markets specifically viewed as ‘difficult’.

She was a co-founder of the Libyan British Business Council and was, until April 2018, responsible for the business side of the organisation.  Pauline’s previous role was General Secretary of BILNAS`
    },
    { 
      name: 'Alan Rides', 
      role: 'Chief Executive Officer, West London Chambers', 
      image: 'https://lh3.googleusercontent.com/d/1z7-hAF6WOxvisuDA3KOGgbQVu2kkhHMe',
      bio: `Alan, with 40 years of commercial business experience runs West London Chambers of Commerce with a focus on International and local business, so is happy to help deliver advice and connections to help your business get better visibility, grow and improve your finances.

Alan back started his export career in Metal Box PLC export shipping department in West Acton, progressing to Diageo export customer services department dealing with global exports. Since graduating from the Institute of Export at West Thames College he has been a front line businessman across Africa, Asia and the Middle East for 25 years working for UK Export trading companies with manufacturing arms who set up local successful offices and dealerships for UK companies. Alan first visited Libya in 1992, to Tripoli and set up an office in Benghazi in 1998 and has done business across the whole country from Aziza to Zliten in multiple sectors including Automotive, HVAC, Plant, Agri, Construction, Manufacturing and O&G and was part of the team that was awarded the Queens Award. This propelled Alan’s career to Director level as sales grew and local offices were set up in 4 overseas markets. then on to set up his own Consultancy (ARC) and be a British Government (UKTI / DIT) Trade Officer.

Alan is also a guest lecturer at King’s College London, Brunel University and University of West London plus local colleges and a local college governor.

Alan joined the LBBC Board in July 2025.`
    },
    { 
      name: 'Bob Phillips', 
      role: 'Division Director, Mott Macdonald', 
      image: 'https://lh3.googleusercontent.com/d/1P57XX0ZF3fPpDKyYJqQKLrlVwTpDs6ko',
      bio: `Bob Phillips is a Director of Mott MacDonald and is primarily responsible for business development across North Africa and Country Manager for Libya. He has been responsible for managing a wide range of management, commercial and technical advisory services on pan-sector infrastructure redevelopment with a particular focus on the more challenging post conflict global environments and fragile states.

Bob has over 25 years of management experience, in both private and public sectors, encompassing extensive international stakeholder engagement at government and ministerial level. He was appointed to the Board of the LBBC in 2016.`
    }
  ];

  const partners = [
    { name: 'British Embassy', logo: 'https://lh3.googleusercontent.com/d/15wu-9uxhuoq3tQF9RdMj5JKCm4UQlOXl' },
    { name: 'UK FCDO', logo: 'https://lh3.googleusercontent.com/d/14Vz7QDoZA0mY0wfWOYtv4oNXC-fWsfIA' },
    { name: 'UK DIT', logo: 'https://lh3.googleusercontent.com/d/1WITAc3xTAWHEMWnfMZXvr8HR3beKE-S2' },
    { name: 'NOC', logo: 'https://lh3.googleusercontent.com/d/1298kn4VMFdwtdchqygp_Edk5XbaBty8B' },
    { name: 'REAOL', logo: 'https://lh3.googleusercontent.com/d/1WjTH2bcM6soZgKQuXBbmGgwQobDMiFNg' },
    { name: 'ARAB BANKERS ASSOCIATION', logo: 'https://lh3.googleusercontent.com/d/1SG9DMnjp0UJAz6Akdl2ie5yHiNyjEcW5' },
    { name: 'EIC', logo: 'https://lh3.googleusercontent.com/d/16lXOVQpw5HTD8EU2ZwP2dT3Iwl44teja' },
    { name: 'LEGACY', logo: 'https://lh3.googleusercontent.com/d/1wOfJy8X8F_NxWU16vEquTjxDMaTws2Fs' }
  ];

  return (
    <div className="pt-32">
      <SEO 
        title={t.nav.about} 
        description="Learn about the Libyan British Business Council, our leadership, board of directors, and our mission to foster UK-Libya trade."
        canonical="about"
      />
      {/* Header Banner */}
      <section className="relative h-[250px] md:h-[300px] flex items-center overflow-hidden bg-slate-900">
        <img 
          src="https://lh3.googleusercontent.com/d/1Gvq_EVuoyOiiBD4ZQvVIOwMOVlMQAC0h" 
          alt="About Header" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-lbbc-green/80 to-transparent"></div>
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
              <div key={partner.name} className="flex flex-col items-center gap-4 group w-full sm:w-[calc(50%-20px)] lg:w-[calc(25%-30px)] max-w-[320px]">
                <div className="h-32 md:h-48 w-full flex items-center justify-center transition-all bg-slate-50 rounded-2xl p-6 md:p-10 border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-xl">
                  {partner.logo.includes('Building2') || partner.logo.includes('d/1PGomWa780IpyKLEScVCwx5SOUtqGimcM') ? (
                    <Building2 size={64} className="text-slate-300 group-hover:text-lbbc-red transition-colors" />
                  ) : (
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      className="max-h-[70%] max-w-[85%] object-contain transition-all duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center group-hover:text-lbbc-green transition-colors">{partner.name}</span>
              </div>
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

const HomePage = () => {
  return (
    <main>
      <SEO 
        title="Home" 
        description="The Libyan British Business Council (LBBC) promotes bilateral trade and investment between the United Kingdom and Libya."
        canonical=""
      />
      <Hero />
      <About />
      <MemberDirectory />
      <UpcomingEvents />
      <FeaturedStory />
      <LatestNews />
    </main>
  );
};

const MemberDirectory = () => {
  const { t } = useLanguage();
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const apiPath = window.location.origin + (window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/') + 'api/members';
        const response = await fetch(apiPath);
        
        let data;
        if (response.ok) {
          data = await response.json();
        } else {
          console.warn('Carousel API failed, trying static fallback...');
          const staticPath = window.location.origin + (window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/') + 'data/members.json';
          const staticRes = await fetch(staticPath);
          if (!staticRes.ok) throw new Error('Both API and static fallback failed');
          data = await staticRes.json();
        }

        const all = [...(data.council || []), ...(data.corporate || [])];
        // Prioritize those with logos
        const withLogos = all.filter(m => m.logo);
        const withoutLogos = all.filter(m => !m.logo);
        setMembers([...withLogos, ...withoutLogos].slice(0, 20)); // Limit to 20 for the carousel
      } catch (err) {
        console.error('Error fetching members for carousel:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // Duplicate for infinite scroll
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

      <div className="relative flex overflow-hidden">
        {isLoading ? (
          <div className="flex gap-12 px-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-24 md:w-32 aspect-square rounded-full bg-slate-50 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div 
            className="flex gap-6 md:gap-12 whitespace-nowrap px-4"
            animate={{ x: [0, -2000] }}
            transition={{ 
              duration: 40, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {allMembers.map((member, i) => (
              <div key={`${member.id || member.name}-${i}`} className="flex-shrink-0 w-24 md:w-32 text-center group">
                <div className="aspect-square rounded-full overflow-hidden bg-white mb-3 border border-slate-100 shadow-sm group-hover:shadow-lg transition-all duration-500 group-hover:-translate-y-1 flex items-center justify-center p-4">
                  {member.logo ? (
                    <img 
                      src={member.logo} 
                      alt={member.name} 
                      className="max-w-full max-h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Building2 size={24} className="text-slate-200 group-hover:text-lbbc-red transition-colors duration-500" />
                  )}
                </div>
                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity truncate px-2">{member.name}</p>
              </div>
            ))}
          </motion.div>
        )}
        
        {/* Gradient overlays for smooth edges */}
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

const ensureAbsoluteUrl = (url: string | null | undefined) => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return `https://lbbc.glueup.com${url}`;
  return `https://lbbc.glueup.com/${url}`;
};

const UpcomingEvents = () => {
  const { t } = useLanguage();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiPath = window.location.origin + (window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/') + 'api/events';
        const response = await fetch(apiPath);
        
        if (!response.ok) {
          console.warn('Home API failed, trying static fallback...');
          const staticPath = window.location.origin + (window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/') + 'data/events.json';
          const staticRes = await fetch(staticPath);
          if (!staticRes.ok) throw new Error('Both API and static fallback failed');
          const data = await staticRes.json();
          setEvents(data.upcoming || []);
          return;
        }
        
        const data = await response.json();
        setEvents(data.upcoming || []);
      } catch (err) {
        console.error('Error fetching events for home:', err);
        // Final fallback to hardcoded data if everything fails
        setEvents([
          {
            id: 'f1',
            title: "Realising Libya's Energy Ambitions",
            location: 'London, UK',
            date: 'MAY 13, 2026',
            description: 'The Conference will hear from the Chairman of the National Oil Corporation of Libya and a senior delegation from the NOC and NOC Operating Companies.',
            image: 'https://picsum.photos/seed/energy1/800/500',
            link: 'https://lbbc.glueup.com/event/realising-libyas-energy-ambitions-173494/'
          },
          {
            id: 'f2',
            title: 'Libya Energy Transition Summit',
            location: 'London, UK',
            date: 'JUNE 16, 2026',
            description: 'Exploring the strategic shift towards renewable energy and sustainable infrastructure in Libya\'s evolving energy landscape.',
            image: 'https://picsum.photos/seed/energy2/800/500',
            link: 'https://lbbc.glueup.com/event/libya-energy-transition-summit-168108/'
          },
          {
            id: 'f3',
            title: 'LBBC Summer Reception',
            location: 'London, UK',
            date: 'JUNE 18, 2026',
            description: 'An evening of high-level networking for LBBC members and guests to celebrate bilateral trade and partnership.',
            image: 'https://picsum.photos/seed/reception/800/500',
            link: 'https://lbbc.glueup.com/event/lbbc-summer-reception-160914/'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <section id="events" className="py-8 md:py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 w-1/4 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 rounded-xl"></div>)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) return null;

  return (
    <section id="events" className="py-8 md:py-16 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] mb-4 block">{t.events.tag}</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">{t.events.title}</h2>
          </div>
          <button className="text-lbbc-green font-bold text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-2 group">
            {t.events.cta}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {events.map((event) => (
            <div key={event.id} className="flex flex-col gap-6 group">
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg relative bg-slate-200 flex items-center justify-center">
                {event.image ? (
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-lbbc-green/20 to-lbbc-accent/10"></div>
                    <Calendar size={48} className="text-lbbc-green/20 relative z-10" />
                  </>
                )}
                <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-md shadow-md">
                  <span className="text-lbbc-green font-black text-[10px] tracking-tighter">{event.date}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-lbbc-green font-bold text-[9px] uppercase tracking-[0.2em]">
                    <MapPin size={12} />
                    {event.location}
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-lbbc-red transition-colors line-clamp-2">{event.title}</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm line-clamp-3">
                  {event.description}
                </p>
                <div className="flex items-center gap-6">
                  {event.link ? (
                    <a 
                      href={ensureAbsoluteUrl(event.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-900 font-bold text-[10px] uppercase tracking-widest border-b-2 border-lbbc-red/20 hover:border-lbbc-red pb-1 transition-all w-fit"
                    >
                      {t.events.register}
                      <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    <button className="flex items-center gap-2 text-slate-900 font-bold text-[10px] uppercase tracking-widest border-b-2 border-lbbc-red/20 hover:border-lbbc-red pb-1 transition-all w-fit">
                      {t.events.register}
                      <ArrowUpRight size={14} />
                    </button>
                  )}
                  {event.link && (
                    <a 
                      href={ensureAbsoluteUrl(event.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-400 hover:text-lbbc-green font-bold text-[10px] uppercase tracking-widest transition-all w-fit"
                    >
                      {t.events.viewDetails}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedStory = () => {
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
                to="/spotlight/capterio"
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
              <img 
                src="https://lh3.googleusercontent.com/d/1-Z-120GLfzNq146Ri6nfEDakfstYNxUy" 
                alt="Capterio Spotlight" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -top-6 -right-6 md:-top-12 md:-right-12 w-48 h-48 md:w-64 md:h-64 bg-lbbc-green/5 rounded-full blur-3xl -z-0"></div>
            <div className="absolute -bottom-6 -left-6 md:-bottom-12 md:-left-12 w-48 h-48 md:w-64 md:h-64 bg-lbbc-green/10 rounded-full blur-3xl -z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const LatestNews = () => {
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

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-lbbc-green text-white pt-16 md:pt-24 pb-8 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-24">
          <div>
            <h4 className="font-bold text-white mb-6 md:mb-8 uppercase tracking-widest text-xs md:text-sm border-b border-white/10 pb-4">{t.footer.navigate}</h4>
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
            <h4 className="font-bold text-white mb-6 md:mb-8 uppercase tracking-widest text-xs md:text-sm border-b border-white/10 pb-4">{t.footer.partners}</h4>
            <div className="grid grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="group">
                <div className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl w-full flex items-center justify-center h-20 md:h-24 transition-all group-hover:scale-[1.02] shadow-lg">
                  <img 
                    src="https://lh3.googleusercontent.com/d/15wu-9uxhuoq3tQF9RdMj5JKCm4UQlOXl" 
                    alt="British Embassy" 
                    className="max-h-full max-w-full object-contain" 
                    referrerPolicy="no-referrer" 
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="group">
                <div className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl w-full flex items-center justify-center h-20 md:h-24 transition-all group-hover:scale-[1.02] shadow-lg">
                  <img 
                    src="https://lh3.googleusercontent.com/d/14Vz7QDoZA0mY0wfWOYtv4oNXC-fWsfIA" 
                    alt="UK FCDO" 
                    className="max-h-full max-w-full object-contain" 
                    referrerPolicy="no-referrer" 
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="group">
                <div className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl w-full flex items-center justify-center h-20 md:h-24 transition-all group-hover:scale-[1.02] shadow-lg">
                  <img 
                    src="https://lh3.googleusercontent.com/d/1298kn4VMFdwtdchqygp_Edk5XbaBty8B" 
                    alt="NOC" 
                    className="max-h-full max-w-full object-contain" 
                    referrerPolicy="no-referrer" 
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="group">
                <div className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl w-full flex items-center justify-center h-20 md:h-24 transition-all group-hover:scale-[1.02] shadow-lg">
                  <img 
                    src="https://lh3.googleusercontent.com/d/1WjTH2bcM6soZgKQuXBbmGgwQobDMiFNg" 
                    alt="REAOL" 
                    className="max-h-full max-w-full object-contain" 
                    referrerPolicy="no-referrer" 
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Sponsors */}
          <div>
            <h4 className="font-bold text-white mb-6 md:mb-8 uppercase tracking-widest text-xs md:text-sm border-b border-white/10 pb-4">{t.footer.sponsors}</h4>
            <div className="grid grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="group">
                <div className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl w-full flex items-center justify-center h-20 md:h-24 transition-all group-hover:scale-[1.02] shadow-lg">
                  <img 
                    src="https://lh3.googleusercontent.com/d/19aNWVHPT2e7qVKzaGZ1FKDt7i7Ffygu-" 
                    alt="Sponsor 1" 
                    className="max-h-full max-w-full object-contain" 
                    referrerPolicy="no-referrer" 
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="group">
                <div className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl w-full flex items-center justify-center h-20 md:h-24 transition-all group-hover:scale-[1.02] shadow-lg">
                  <img 
                    src="https://lh3.googleusercontent.com/d/1LGlEbIlkn_Dxfh9ZidHXLUpFopfhBTfW" 
                    alt="Sponsor 2" 
                    className="max-h-full max-w-full object-contain" 
                    referrerPolicy="no-referrer" 
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="group">
                <div className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl w-full flex items-center justify-center h-20 md:h-24 transition-all group-hover:scale-[1.02] shadow-lg">
                  <img 
                    src="https://lh3.googleusercontent.com/d/1BVL2nJgbXbjecGcFNW9WbU74MbOAnD0P" 
                    alt="Sponsor 3" 
                    className="max-h-full max-w-full object-contain" 
                    referrerPolicy="no-referrer" 
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-bold text-white mb-6 md:mb-8 uppercase tracking-widest text-xs md:text-sm border-b border-white/10 pb-4">{t.footer.contact}</h4>
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-3 md:space-y-4">
                <a href="mailto:secretariat@lbbc.org.uk" className="flex items-center gap-3 md:gap-4 text-[11px] md:text-xs text-white hover:text-white transition-colors group font-bold">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Mail size={14} className="text-white" />
                  </div>
                  {t.footer.email}: secretariat@lbbc.org.uk
                </a>
                <a href="tel:+442077887935" className="flex items-center gap-3 md:gap-4 text-[11px] md:text-xs text-white hover:text-white transition-colors group font-bold">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Phone size={14} className="text-white" />
                  </div>
                  {t.footer.tel}: +44 (0) 20 7788 7935
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
              <a href="https://www.linkedin.com/company/libyan-british-business-council/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-all hover:scale-110"><Linkedin size={24} /></a>
              <a href="https://x.com/LBBCnews" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-all hover:scale-110">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="md:w-6 md:h-6">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z" />
                </svg>
              </a>
              <a href="https://www.facebook.com/LibyanBritishBusinessCouncil/#" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-all hover:scale-110"><Facebook size={24} /></a>
            </div>
            <p className="text-[9px] md:text-[11px] text-white uppercase tracking-[0.3em] font-bold">
              {t.footer.rights}
            </p>
          </div>
          <Link to="/" className="flex flex-col items-center md:items-end gap-3 md:gap-4 group">
            <img 
              src="https://lh3.googleusercontent.com/d/1PGomWa780IpyKLEScVCwx5SOUtqGimcM" 
              alt="LBBC Logo" 
              className="h-12 md:h-16 brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
              referrerPolicy="no-referrer" 
              loading="lazy"
            />
            <span className="text-[8px] md:text-[9px] uppercase tracking-[0.5em] text-white font-black group-hover:text-white transition-colors">Libyan British Business Council</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

const EventsPage = () => {
  const { t } = useLanguage();
  const { hash } = useLocation();
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiPath = window.location.origin + (window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/') + 'api/events';
        const response = await fetch(apiPath);
        
        if (!response.ok) {
          console.warn('Events Page API failed, trying static fallback...');
          const staticPath = window.location.origin + (window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/') + 'data/events.json';
          const staticRes = await fetch(staticPath);
          if (!staticRes.ok) throw new Error(`Server returned ${response.status} and static fallback failed`);
          const data = await staticRes.json();
          setUpcomingEvents(data.upcoming || []);
          setPastEvents(data.past || []);
          return;
        }
        
        const data = await response.json();
        setUpcomingEvents(data.upcoming || []);
        setPastEvents(data.past || []);
      } catch (err) {
        console.error('Error fetching events page:', err);
        // Final fallback to hardcoded data if everything fails
        const fallback = {
          upcoming: [
            {
              id: 'f-e-1',
              title: "Realising Libya's Energy Ambitions",
              location: 'London, UK',
              date: 'MAY 13, 2026',
              description: 'The Conference will hear from the Chairman of the National Oil Corporation of Libya and a senior delegation from the NOC and NOC Operating Companies.',
              type: 'Conference',
              image: 'https://picsum.photos/seed/energy1/800/500',
              link: 'https://lbbc.glueup.com/event/realising-libyas-energy-ambitions-173494/'
            },
            {
              id: 'f-e-2',
              title: 'Libya Energy Transition Summit',
              location: 'London, UK',
              date: 'JUNE 16, 2026',
              description: 'Exploring the strategic shift towards renewable energy and sustainable infrastructure in Libya\'s evolving energy landscape.',
              type: 'Summit',
              image: 'https://picsum.photos/seed/energy2/800/500',
              link: 'https://lbbc.glueup.com/organization/5915/events/'
            }
          ],
          past: [
            {
              id: 'f-p-1',
              title: 'LBBC Webinar: Understanding Libya\'s Banking Landscape',
              location: 'Online Webinar',
              date: 'MARCH 25, 2026',
              description: 'A deep dive into LCs, payment systems, and best practices for financial transactions in the Libyan market.',
              type: 'Webinar',
              image: 'https://picsum.photos/seed/banking/800/500',
              link: 'https://lbbc.glueup.com/organization/5915/events/'
            }
          ]
        };
        setUpcomingEvents(fallback.upcoming);
        setPastEvents(fallback.past);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (hash && !isLoading) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (!isLoading) {
      window.scrollTo(0, 0);
    }
  }, [hash, isLoading]);

  const [visibleArchiveCount, setVisibleArchiveCount] = useState(3);

  return (
    <div className="pt-32">
      <SEO 
        title={t.nav.events} 
        description="Stay updated on upcoming LBBC events, trade missions, and conferences focused on UK-Libya business opportunities."
        canonical="events"
      />
      {/* Header Banner */}
      <section className="relative h-[250px] md:h-[300px] flex items-center overflow-hidden bg-slate-900">
        <img 
          src="https://lh3.googleusercontent.com/d/1BwuIsuhH6LWOAfM-5WB965n8lGqlBKYF" 
          alt="Events Header" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-lbbc-green/80 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white font-black text-[8px] md:text-[9px] uppercase tracking-[0.4em] mb-4 md:mb-6 border border-white/20">
              {t.events.pageTag}
            </span>
            <h1 className="text-2xl md:text-5xl font-black text-white leading-tight max-w-3xl tracking-tight">
              {t.events.pageTitle}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="upcoming" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-lbbc-green/10 rounded-lg flex items-center justify-center text-lbbc-green">
                <Calendar size={20} />
              </div>
              <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em]">{t.events.tag}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">{t.events.calendarTitle}</h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              {t.events.calendarDesc}
            </p>
          </div>

          <div className="space-y-8 md:space-y-12">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-64 bg-slate-50 animate-pulse rounded-2xl"></div>
              ))
            ) : error ? (
              <div className="bg-red-50 p-8 rounded-xl text-center border border-red-100">
                <p className="text-red-600 font-bold mb-4">{error}</p>
                <div className="text-[10px] text-slate-400 mb-6 font-mono bg-white/50 p-2 rounded max-w-md mx-auto text-left overflow-hidden">
                  URL: {window.location.href}<br/>
                  API: {window.location.origin + (window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/') + 'api/events'}<br/>
                  Time: {new Date().toLocaleTimeString()}
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-red-600 text-white rounded-sm text-xs font-black uppercase tracking-widest"
                >
                  Retry
                </button>
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">No upcoming events scheduled at this time.</p>
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event.id} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col lg:flex-row">
                  <div className="lg:w-2/5 relative overflow-hidden aspect-[16/9] lg:aspect-auto min-h-[240px] bg-slate-50 flex items-center justify-center">
                    {event.image ? (
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-lbbc-green/5 to-transparent"></div>
                        <Calendar size={48} className="text-slate-200 relative z-10" />
                      </>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md shadow-md z-20">
                      <span className="text-lbbc-green font-black text-[10px] tracking-tighter uppercase">{event.type}</span>
                    </div>
                  </div>
                  <div className="lg:w-3/5 p-6 md:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-4 text-lbbc-green font-bold text-[10px] uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          {event.location}
                        </div>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-lbbc-red transition-colors leading-tight">
                        {event.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                        {event.description}
                      </p>
                    </div>
                      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                        {event.link ? (
                          <a 
                            href={ensureAbsoluteUrl(event.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto bg-lbbc-green text-white px-8 py-3.5 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-lbbc-red transition-all shadow-lg active:scale-95 text-center"
                          >
                            {t.events.register}
                          </a>
                        ) : (
                          <button className="w-full sm:w-auto bg-lbbc-green text-white px-8 py-3.5 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-lbbc-red transition-all shadow-lg active:scale-95">
                            {t.events.register}
                          </button>
                        )}
                        {event.link ? (
                          <a 
                            href={ensureAbsoluteUrl(event.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto border border-slate-200 text-slate-900 px-8 py-3.5 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2 text-center"
                          >
                            {t.events.viewDetails} <ArrowUpRight size={14} />
                          </a>
                        ) : (
                          <button className="w-full sm:w-auto border border-slate-200 text-slate-900 px-8 py-3.5 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2">
                            {t.events.viewDetails} <ArrowUpRight size={14} />
                          </button>
                        )}
                      </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
        </div>
      </section>

      {/* Events Archive Section */}
      <section id="archive" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12 md:mb-16">
            <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block mb-4">{t.events.archiveTag}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">{t.events.archiveTitle}</h2>
            <p className="text-lbbc-green font-bold text-[12px] md:text-[14px] uppercase tracking-widest mb-4">{t.events.archiveSubtitle}</p>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              {t.events.archiveDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-xl"></div>
              ))
            ) : pastEvents.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white/50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">No archived events found.</p>
              </div>
            ) : (
              pastEvents.slice(0, visibleArchiveCount).map((event) => (
                <div key={event.id} className="flex flex-col gap-6 group">
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg relative bg-white flex items-center justify-center border border-slate-100">
                    {event.image ? (
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-lbbc-green/5 to-transparent"></div>
                        <Calendar size={48} className="text-slate-100 relative z-10" />
                      </>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md shadow-md z-20">
                      <span className="text-lbbc-green font-black text-[10px] tracking-tighter uppercase">{event.type}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-lbbc-red font-bold text-[9px] uppercase tracking-[0.2em]">
                        <Calendar size={12} />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-lbbc-red font-bold text-[9px] uppercase tracking-[0.2em]">
                        <MapPin size={12} />
                        {event.location}
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-lbbc-red transition-colors line-clamp-2">{event.title}</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm line-clamp-3">
                      {event.description}
                    </p>
                    {event.link ? (
                      <a 
                        href={ensureAbsoluteUrl(event.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-slate-900 font-bold text-[10px] uppercase tracking-widest border-b-2 border-lbbc-red/20 hover:border-lbbc-red pb-1 transition-all w-fit"
                      >
                        {t.events.viewSummary}
                        <ArrowUpRight size={14} />
                      </a>
                    ) : (
                      <button className="flex items-center gap-2 text-slate-900 font-bold text-[10px] uppercase tracking-widest border-b-2 border-lbbc-red/20 hover:border-lbbc-red pb-1 transition-all w-fit">
                        {t.events.viewSummary}
                        <ArrowUpRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-12 flex flex-col items-center gap-8">
            {visibleArchiveCount < pastEvents.length ? (
              <button 
                onClick={() => setVisibleArchiveCount(pastEvents.length)}
                className="flex items-center gap-2 text-lbbc-green font-bold text-[11px] uppercase tracking-[0.2em] hover:text-lbbc-red transition-colors group"
              >
                {t.events.seeMore}
                <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
              </button>
            ) : (
              <button 
                onClick={() => setVisibleArchiveCount(3)}
                className="flex items-center gap-2 text-lbbc-green font-bold text-[11px] uppercase tracking-[0.2em] hover:text-lbbc-red transition-colors group"
              >
                {t.events.showLess}
                <ChevronUp size={18} className="group-hover:-translate-y-1 transition-transform" />
              </button>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center pt-8 border-t border-slate-200">
              <a 
                href="https://lbbc.glueup.com/home/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-lbbc-green text-white px-10 py-4 rounded-sm text-[11px] font-black uppercase tracking-widest hover:bg-lbbc-red transition-all shadow-xl active:scale-95 text-center"
              >
                {t.events.memberSignIn}
              </a>
              <Link 
                to="/membership"
                className="w-full sm:w-auto border-2 border-lbbc-green text-lbbc-green px-10 py-4 rounded-sm text-[11px] font-black uppercase tracking-widest hover:bg-lbbc-green hover:text-white transition-all shadow-lg active:scale-95 text-center"
              >
                {t.events.joinLBBC}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-20 bg-white border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-lbbc-red font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block mb-4">{t.events.sponsorsTag}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{t.events.sponsorsTitle}</h2>
          </div>

          {/* Scrolling Logos */}
          <div className="relative w-full overflow-hidden py-10">
            <motion.div 
              className="flex items-center gap-16 md:gap-24 whitespace-nowrap"
              animate={{ x: [0, -1500] }}
              transition={{ 
                duration: 40, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              {[
                { name: 'Metlen', id: '1qZgdrszXG_q9DaIw9Pi15tK-FibGgnZa' },
                { name: 'Promergon', id: '1tT9Mi34vXyls13GG54cIzrmBsPls301F' },
                { name: 'Bank ABC', id: '15cpsQqPmBPGxIFDMENHLFMWWSMlX5RWS' },
                { name: 'BACB', id: '1AncCRiOHV69RThwwxusFjd44kk5Kfm3X' },
                { name: 'Medship Group', id: '1x4pHfOpvq7iOxhS_o9FwIZTDIYoxNbaw' },
                { name: 'Crowd Digital', id: '1anu1ZRZmC7BDJWW4CTWwB_ZpWtCddibV' },
                { name: 'Libya Holdings', id: '1Xs5dfuvlmR6CnN60XJJaMq6_OSOuRUhZ' },
                { name: 'EC', id: '1UGsP0Xced_x7v250W8Avorqf1IHhrc_-' },
                // Duplicate for seamless loop
                { name: 'Metlen', id: '1qZgdrszXG_q9DaIw9Pi15tK-FibGgnZa' },
                { name: 'Promergon', id: '1tT9Mi34vXyls13GG54cIzrmBsPls301F' },
                { name: 'Bank ABC', id: '15cpsQqPmBPGxIFDMENHLFMWWSMlX5RWS' },
                { name: 'BACB', id: '1AncCRiOHV69RThwwxusFjd44kk5Kfm3X' },
                { name: 'Medship Group', id: '1x4pHfOpvq7iOxhS_o9FwIZTDIYoxNbaw' },
                { name: 'Crowd Digital', id: '1anu1ZRZmC7BDJWW4CTWwB_ZpWtCddibV' },
                { name: 'Libya Holdings', id: '1Xs5dfuvlmR6CnN60XJJaMq6_OSOuRUhZ' },
                { name: 'EC', id: '1UGsP0Xced_x7v250W8Avorqf1IHhrc_-' }
              ].map((sponsor, idx) => (
                <div key={`${sponsor.name}-${idx}`} className="flex-shrink-0 transition-all duration-500 hover:scale-110">
                  <img 
                    src={`https://lh3.googleusercontent.com/d/${sponsor.id}`} 
                    alt={sponsor.name} 
                    className="h-12 md:h-16 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          <div className="max-w-3xl mx-auto text-center mt-16 space-y-8">
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              {t.events.sponsorsDesc}
            </p>
            <a 
              href="mailto:events@lbbc.org.uk"
              className="inline-flex items-center justify-center gap-3 bg-lbbc-green text-white px-10 py-4 rounded-sm text-[11px] font-black uppercase tracking-[0.2em] hover:bg-lbbc-red transition-all shadow-xl active:scale-95"
            >
              {t.events.contactUs} <Mail size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

const DirectoryPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState(t.directory.allSectors);
  const [councilMembers, setCouncilMembers] = useState<any[]>([]);
  const [corporateMembers, setCorporateMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'council' | 'corporate'>('council');
  const [selectedMember, setSelectedMember] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sectors = [
    t.directory.allSectors, 
    ...Array.from(new Set([...(councilMembers || []), ...(corporateMembers || [])]
      .map(m => m?.sector)
      .filter(Boolean)
    ))
  ].sort();

  const fetchMembers = async () => {
    try {
      const apiPath = window.location.origin + (window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/') + 'api/members';
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching members from:', apiPath);
        const response = await fetch(apiPath);
        
        if (!response.ok) {
          console.warn('API failed, trying static fallback...');
          const staticPath = window.location.origin + (window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/') + 'data/members.json';
          const staticRes = await fetch(staticPath);
          if (!staticRes.ok) throw new Error(`Server returned ${response.status} and static fallback failed`);
          const data = await staticRes.json();
          setCouncilMembers(data.council || []);
          setCorporateMembers(data.corporate || []);
          return;
        }
        
        const data = await response.json();
        setCouncilMembers(data.council || []);
        setCorporateMembers(data.corporate || []);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError(err instanceof Error ? err.message : t.directory.errorText);
      } finally {
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Outer fetch error:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredCouncil = councilMembers.filter(member => 
    (member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     member.sector.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedSector === t.directory.allSectors || member.sector === selectedSector)
  );

  const filteredCorporate = corporateMembers.filter(member => 
    (member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     member.sector.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedSector === t.directory.allSectors || member.sector === selectedSector)
  );

  return (
    <div className="pt-32">
      <SEO 
        title={t.nav.directory} 
        description="Explore the LBBC Member Directory to find leading British and Libyan companies across various sectors."
        canonical="directory"
      />
      {/* Hero Banner */}
      <section className="relative h-[250px] md:h-[300px] flex items-center overflow-hidden bg-slate-900">
        <img 
          src="https://lh3.googleusercontent.com/d/1m0pcFsUJoAa0h4oTj57jnTosPbhuOTjS" 
          alt="Directory Header" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-lbbc-green/80 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white font-black text-[8px] md:text-[9px] uppercase tracking-[0.4em] mb-4 md:mb-6 border border-white/20">
              {t.directory.pageTag}
            </span>
            <h1 className="text-2xl md:text-5xl font-black text-white leading-tight max-w-3xl tracking-tight">
              {t.directory.pageTitle}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Intro & Filters Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start mb-12">
            {/* Left: Intro Text */}
            <div className="lg:w-1/2">
              <p className="text-slate-600 leading-relaxed text-base">
                {t.directory.intro}
              </p>
            </div>

            {/* Right: Search & Filter */}
            <div className="lg:w-1/2 w-full flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder={t.directory.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-xs focus:outline-none focus:border-lbbc-green transition-all"
                />
              </div>
              <div className="relative min-w-[200px]">
                <select 
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm text-xs focus:outline-none focus:border-lbbc-green transition-all appearance-none cursor-pointer"
                >
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Tabs Switcher */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-100 pb-6">
            <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
              <button 
                onClick={() => setActiveTab('council')}
                className={`flex-1 md:flex-none px-8 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'council' ? 'bg-white text-lbbc-green shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {t.directory.councilTab} ({filteredCouncil.length})
              </button>
              <button 
                onClick={() => setActiveTab('corporate')}
                className={`flex-1 md:flex-none px-8 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'corporate' ? 'bg-white text-lbbc-green shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {t.directory.corporateTab} ({filteredCorporate.length})
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Members Grid Section */}
      <section className="py-12 md:py-20 bg-slate-50/50 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {error ? (
            <div className="bg-white p-12 rounded-xl border border-red-100 text-center shadow-sm max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="text-red-500" size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{t.directory.error}</h3>
              <p className="text-slate-500 mb-4">{error}</p>
              <div className="text-[10px] text-slate-400 mb-8 font-mono bg-slate-50 p-2 rounded text-left overflow-hidden">
                URL: {window.location.href}<br/>
                API: {window.location.origin + (window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/') + 'api/members'}<br/>
                Time: {new Date().toLocaleTimeString()}
              </div>
              <button 
                onClick={() => fetchMembers()}
                className="px-8 py-3 bg-lbbc-green text-white font-black uppercase tracking-widest rounded-sm hover:bg-lbbc-red transition-all"
              >
                {t.nav.home === 'Home' ? 'Retry Connection' : 'إعادة محاولة الاتصال'}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {isLoading ? (
                  Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm animate-pulse aspect-square flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full mb-4"></div>
                      <div className="h-3 bg-slate-100 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                    </div>
                  ))
                ) : (
                  (activeTab === 'council' ? filteredCouncil : filteredCorporate).map((member, idx) => (
                    <motion.div 
                      key={`${member.name}-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (idx % 20) * 0.03 }}
                      onClick={() => setSelectedMember(member)}
                      className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-lbbc-green/20 transition-all group flex flex-col items-center justify-center text-center aspect-square relative overflow-hidden cursor-pointer"
                    >
                      <div className="w-full h-16 md:h-20 flex items-center justify-center mb-4">
                        {member.logo ? (
                          <img 
                            src={member.logo} 
                            alt={member.name} 
                            className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-full">
                            <Building2 size={24} className="text-slate-200" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-[10px] md:text-[11px] font-black text-slate-900 leading-tight px-2 line-clamp-2 uppercase tracking-tight">{member.name}</h3>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2 group-hover:text-lbbc-green transition-colors">{member.sector}</span>
                      
                      {/* Accent line */}
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-lbbc-green transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </motion.div>
                  ))
                )}
              </div>

              {!isLoading && (activeTab === 'council' ? filteredCouncil : filteredCorporate).length === 0 && (
                <div className="text-center py-32 space-y-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <Search size={24} className="text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">{t.directory.noResults.replace('{tab}', activeTab)}</p>
                  <button 
                    onClick={() => {setSearchTerm(''); setSelectedSector(t.directory.allSectors);}}
                    className="text-lbbc-green font-black text-[9px] uppercase tracking-widest border-b border-lbbc-green/20 pb-1"
                  >
                    {t.directory.clearFilters}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Member Details Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors z-10"
              >
                <X size={16} />
              </button>
              
              <div className="p-8 md:p-10 overflow-y-auto">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-slate-100 text-center sm:text-left">
                  <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 flex items-center justify-center bg-slate-50 rounded-xl p-4 border border-slate-100">
                    {selectedMember.logo ? (
                      <img src={selectedMember.logo} alt={selectedMember.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <Building2 size={40} className="text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-3">{selectedMember.name}</h2>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                      <span className="inline-block px-3 py-1 bg-lbbc-green/10 text-lbbc-green font-bold text-[10px] uppercase tracking-widest rounded-sm">
                        {selectedMember.industry_txt || selectedMember.sector}
                      </span>
                    </div>
                  </div>
                </div>
                
                {selectedMember.description && (
                  <div className="mb-8">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t.directory.about}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                      {selectedMember.description}
                    </p>
                  </div>
                )}
                
                {selectedMember.website && (
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t.directory.website}</h3>
                    <a 
                      href={selectedMember.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-lbbc-green hover:text-lbbc-red font-bold text-sm transition-colors break-all"
                    >
                      {selectedMember.website}
                      <ExternalLink size={14} className="flex-shrink-0" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ResourcesPage = () => {
  const { t } = useLanguage();
  const { hash } = useLocation();
  const [visiblePdfs, setVisiblePdfs] = useState(6);

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
    
    // Load Flickr script
    const script = document.createElement('script');
    script.src = "https://embedr.flickr.com/assets/client-code.js";
    script.async = true;
    script.charset = "utf-8";
    script.onerror = () => {
      console.warn('Flickr script failed to load or threw an error. This is expected if CORS is not enabled on the CDN.');
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const pdfs = [
    { id: 1, title: 'UK-Libya Trade Guide 2026', category: 'REGULATORY' },
    { id: 2, title: 'Investment Opportunities in Energy', category: 'MARKET INSIGHT' },
    { id: 3, title: 'Legal Framework for Foreign Entities', category: 'LEGAL' },
    { id: 4, title: 'Customs and Logistics Handbook', category: 'LOGISTICS' },
    { id: 5, title: 'Banking and Finance Sector Overview', category: 'FINANCE' },
    { id: 6, title: 'Infrastructure Development Roadmap', category: 'INFRASTRUCTURE' },
  ];

  const news = newsData;

  return (
    <div className="pt-32">
      <SEO 
        title={t.nav.resources} 
        description="Access exclusive market insights, trade guides, news updates, and media galleries for the UK-Libya business community."
        canonical="resources"
      />
      {/* Hero Banner */}
      <section className="relative h-[250px] md:h-[300px] flex items-center overflow-hidden bg-slate-900">
        <img 
          src="https://lh3.googleusercontent.com/d/1BV2ibrdYUyOZxrelp0xPGek2TsVWISM5" 
          alt="Resources Header" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-lbbc-green/80 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white font-black text-[8px] md:text-[9px] uppercase tracking-[0.4em] mb-4 md:mb-6 border border-white/20">
              {t.resources.tag}
            </span>
            <h1 className="text-2xl md:text-5xl font-black text-white leading-tight max-w-3xl tracking-tight">
              {t.resources.title}
            </h1>
          </motion.div>
        </div>
      </section>

      <section id="toolkit" className="py-12 md:py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12 md:mb-16 max-w-4xl">
            <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] mb-4 block">{t.resources.toolkitTag}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">{t.resources.toolkitTitle}</h2>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
              {t.resources.toolkitDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {pdfs.slice(0, visiblePdfs).map((pdf) => (
              <motion.div 
                key={pdf.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col h-full group"
              >
                <div 
                  className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg relative bg-white border border-slate-200 flex flex-col items-center justify-center cursor-pointer group-hover:shadow-2xl transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-lbbc-green/5 to-lbbc-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <FileText size={80} className="text-slate-200 group-hover:text-lbbc-green/20 transition-colors mb-4" />
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest group-hover:text-lbbc-green transition-colors">{t.resources.clickToOpen}</span>
                  
                  <div className="absolute top-4 right-4 bg-lbbc-red text-white p-2 rounded-lg shadow-md transform translate-x-2 -translate-y-2 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <ExternalLink size={16} />
                  </div>
                </div>
                
                <div className="flex flex-col flex-grow pt-6">
                  <div className="space-y-2 mb-6">
                    <span className="text-lbbc-green font-black text-[9px] tracking-widest uppercase">{pdf.category}</span>
                    <h3 className="text-sm md:text-base font-extrabold text-slate-900 group-hover:text-lbbc-red transition-colors leading-tight min-h-[3rem] line-clamp-2">{pdf.title}</h3>
                  </div>
                  <button className="mt-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-sm text-[9px] font-bold uppercase tracking-widest hover:bg-lbbc-red transition-all shadow-lg group/btn">
                    <Download size={14} className="group-hover/btn:translate-y-0.5 transition-transform" />
                    {t.resources.download}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {visiblePdfs < pdfs.length && (
            <div className="mt-16 md:mt-24 flex justify-center">
              <button 
                onClick={() => setVisiblePdfs(prev => prev + 3)}
                className="bg-white border-2 border-lbbc-green text-lbbc-green px-10 py-4 rounded-sm text-xs font-bold hover:bg-lbbc-green hover:text-white transition-all uppercase tracking-widest shadow-lg"
              >
                {t.resources.loadMore}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Supporting British Business Section */}
      <section className="py-20 md:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
            <div className="lg:w-1/2 space-y-8">
              <div>
                <span className="text-lbbc-red font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block mb-4">
                  {t.resources.supporting.tag}
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight mb-8">
                  {t.resources.supporting.title}
                </h2>
                <div className="space-y-6 text-slate-600 text-lg md:text-xl leading-relaxed">
                  <p>{t.resources.supporting.p1}</p>
                  <p>{t.resources.supporting.p2}</p>
                </div>
              </div>
              <div className="pt-4">
                <Link 
                  to="/membership" 
                  className="inline-flex items-center gap-3 bg-lbbc-green text-white px-10 py-5 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-lbbc-red transition-all shadow-2xl shadow-lbbc-green/20 group"
                >
                  {t.resources.supporting.cta}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-lbbc-green/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-lbbc-red/5 rounded-full blur-3xl"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                <img 
                  src="https://lh3.googleusercontent.com/d/1_o6UrgupeE--e0CUK6DP9FjWipNVGHG5" 
                  alt="UK-Libya Partnership" 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Partners Row */}
          <div className="mt-24 md:mt-32 pt-16 border-t border-slate-100">
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 transition-all duration-700">
              {[
                { name: 'British Embassy', id: '15wu-9uxhuoq3tQF9RdMj5JKCm4UQlOXl' },
                { name: 'UK FCDO', id: '14Vz7QDoZA0mY0wfWOYtv4oNXC-fWsfIA' },
                { name: 'UK DIT', id: '1WITAc3xTAWHEMWnfMZXvr8HR3beKE-S2' },
                { name: 'NOC', id: '1298kn4VMFdwtdchqygp_Edk5XbaBty8B' },
                { name: 'REAOL', id: '1WjTH2bcM6soZgKQuXBbmGgwQobDMiFNg' },
                { name: 'ARAB BANKERS ASSOCIATION', id: '1SG9DMnjp0UJAz6Akdl2ie5yHiNyjEcW5' },
                { name: 'EIC', id: '16lXOVQpw5HTD8EU2ZwP2dT3Iwl44teja' },
                { name: 'LEGACY', id: '1wOfJy8X8F_NxWU16vEquTjxDMaTws2Fs' }
              ].map((p, i) => (
                <img key={i} src={`https://lh3.googleusercontent.com/d/${p.id}`} alt={p.name} className="h-8 md:h-12 w-auto transition-all" referrerPolicy="no-referrer" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-12 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] mb-4 block">{t.news.tag}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">{t.news.title}</h2>
            </div>
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
        </div>
      </section>

      {/* Media Gallery Section */}
      <section id="gallery" className="py-20 md:py-32 bg-slate-950 relative overflow-hidden text-white">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-lbbc-green/5 to-transparent pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-lbbc-green/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-12 left-12 opacity-10 pointer-events-none">
          <Camera size={120} strokeWidth={1} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 md:mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <span className="inline-flex items-center gap-2 text-white/80 font-bold text-[10px] md:text-[11px] uppercase tracking-[0.4em] mb-4">
                <ImageIcon size={14} className="text-lbbc-red" />
                {t.gallery.tag}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {t.gallery.title} <span className="text-white/70">{t.gallery.subtitle}</span>
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <a 
                href="https://www.flickr.com/photos/legacy_libya/albums" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-lbbc-green px-8 py-4 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-lbbc-red hover:text-white transition-all shadow-2xl group"
              >
                {t.gallery.cta}
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
          >
            {/* Album 1 */}
            <div className="group">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-black/40 backdrop-blur-sm p-1 border border-white/10 hover:border-lbbc-red/50 transition-all duration-500">
                <div className="w-full aspect-[4/3] flex items-center justify-center overflow-hidden rounded-xl bg-slate-950 relative">
                  <a 
                    data-flickr-embed="true" 
                    href="https://www.flickr.com/photos/legacy_libya/54447167750/in/album-72177720325034652/" 
                    title="NOC LBR Roadshow in London"
                    className="w-full h-full"
                  >
                    <img 
                      src="https://live.staticflickr.com/65535/54447167750_dde7fdc886_w.jpg" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt="NOC LBR Roadshow in London"
                      referrerPolicy="no-referrer"
                    />
                  </a>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <h3 className="text-sm md:text-base font-bold text-white group-hover:text-lbbc-red transition-colors leading-tight">
                  NOC Libya Bid Round London Roadshow
                </h3>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">Album 01</p>
              </div>
            </div>

            {/* Album 2 */}
            <div className="group">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-black/40 backdrop-blur-sm p-1 border border-white/10 hover:border-lbbc-red/50 transition-all duration-500">
                <div className="w-full aspect-[4/3] flex items-center justify-center overflow-hidden rounded-xl bg-slate-950 relative">
                  <a 
                    data-flickr-embed="true" 
                    data-context="true"
                    href="https://www.flickr.com/photos/legacy_libya/54125991549/in/photostream/" 
                    title="LBBC Delegation: LibyaBuild Benghazi"
                    className="w-full h-full"
                  >
                    <img 
                      src="https://live.staticflickr.com/65535/54125991549_65f81a748b_w.jpg" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt="LBBC Delegation: LibyaBuild Benghazi"
                      referrerPolicy="no-referrer"
                    />
                  </a>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <h3 className="text-sm md:text-base font-bold text-white group-hover:text-lbbc-red transition-colors leading-tight">
                  LBBC Delegation: LibyaBuild Benghazi
                </h3>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">Album 02</p>
              </div>
            </div>

            {/* Album 3 */}
            <div className="group">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-black/40 backdrop-blur-sm p-1 border border-white/10 hover:border-lbbc-red/50 transition-all duration-500">
                <div className="w-full aspect-[4/3] flex items-center justify-center overflow-hidden rounded-xl bg-slate-950 relative">
                  <a 
                    data-flickr-embed="true" 
                    href="https://www.flickr.com/photos/legacy_libya/54125538111/in/album-72177720321806753/" 
                    title="LBBC Delegation: AGOCO Meeting"
                    className="w-full h-full"
                  >
                    <img 
                      src="https://live.staticflickr.com/65535/54125538111_ddc0cf1cb5_w.jpg" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt="LBBC Delegation: AGOCO Meeting"
                      referrerPolicy="no-referrer"
                    />
                  </a>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <h3 className="text-sm md:text-base font-bold text-white group-hover:text-lbbc-red transition-colors leading-tight">
                  Benghazi Business Delegation AGOCO, Wahda Bank, LDRF Meetings
                </h3>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">Album 03</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const MembershipPage = () => {
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
      link: location === 'uk' 
        ? { label: t.membership.joinNow, url: 'https://lbbc.glueup.com/membership/21386/apply/' }
        : { label: t.membership.joinNow, url: 'https://lbbc.glueup.com/membership/21396/apply/' }
    },
    {
      ...t.membership.corporate,
      color: 'slate-900',
      link: location === 'uk'
        ? { label: t.membership.joinNow, url: 'https://lbbc.glueup.com/membership/21476/apply/' }
        : { label: t.membership.joinNow, url: 'https://lbbc.glueup.com/membership/21397/apply/' }
    },
    {
      ...t.membership.soleTrader,
      color: 'slate-900',
      link: { label: t.membership.joinNow, url: 'https://lbbc.glueup.com/membership/21477/apply/' }
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
      <section className="relative h-[250px] md:h-[300px] flex items-center overflow-hidden bg-slate-900">
        <img 
          src="https://lh3.googleusercontent.com/d/1AZ2sT2x2_l17cXYFOK3EwBg5Uocf-PVi" 
          alt="Membership Header" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-lbbc-green/80 to-transparent"></div>
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
                <img 
                  src="https://lh3.googleusercontent.com/d/1x6yFFfjnyRp7zKI70QDJrPyWt702-G7P" 
                  alt="LBBC Membership" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
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
                      className={`w-full py-4 rounded-sm font-black text-[10px] uppercase tracking-widest text-center transition-all shadow-md ${
                        tier.name === t.membership.council.name ? 'bg-lbbc-green text-white hover:bg-lbbc-accent' : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
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
                {/* Term Row */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-8 font-extrabold text-slate-900 border-r border-slate-100 bg-slate-50/50">{t.membership.term}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.council.term}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.corporate.term}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium">{t.membership.soleTrader.term}</td>
                </tr>

                {/* Members Row */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-8 font-extrabold text-slate-900 border-r border-slate-100 bg-slate-50/50">{t.membership.members}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.council.members}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.corporate.members}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium">{t.membership.soleTrader.members}</td>
                </tr>

                {/* Visibility Row */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-8 font-extrabold text-slate-900 border-r border-slate-100 bg-slate-50/50">{t.membership.visibility}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.council.visibility}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.corporate.visibility}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium">{t.membership.soleTrader.visibility}</td>
                </tr>

                {/* Events Row */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-8 font-extrabold text-slate-900 border-r border-slate-100 bg-slate-50/50">{t.membership.events}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.council.events}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.corporate.events}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium">{t.membership.soleTrader.events}</td>
                </tr>

                {/* Support Row */}
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

                {/* Directory Row */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-8 font-extrabold text-slate-900 border-r border-slate-100 bg-slate-50/50">{t.membership.directory}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.council.directory}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium border-r border-slate-100">{t.membership.corporate.directory}</td>
                  <td className="px-6 py-8 text-center text-slate-600 font-medium">{t.membership.soleTrader.directory}</td>
                </tr>

                {/* Join Now Row */}
                <tr className="bg-slate-50/30">
                  <td className="px-6 py-10 font-extrabold text-slate-900 border-r border-slate-100 bg-slate-50/50">{t.membership.cta}</td>
                  <td className="px-6 py-10 text-center border-r border-slate-100">
                    <div className="flex flex-col gap-3 items-center">
                      <a 
                        href={tiers[0].link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-lbbc-green text-white px-4 py-3 rounded-sm font-black text-[9px] uppercase tracking-widest hover:bg-lbbc-accent transition-all shadow-md w-full max-w-[200px] text-center"
                      >
                        {tiers[0].link.label}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-10 text-center border-r border-slate-100">
                    <div className="flex flex-col gap-3 items-center">
                      <a 
                        href={tiers[1].link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-slate-900 text-white px-4 py-3 rounded-sm font-black text-[9px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md w-full max-w-[200px] text-center"
                      >
                        {tiers[1].link.label}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center">
                      <a 
                        href={tiers[2].link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-slate-900 text-white px-4 py-3 rounded-sm font-black text-[9px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md w-full max-w-[200px] text-center"
                      >
                        {tiers[2].link.label}
                      </a>
                    </div>
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
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {t.membership.title}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                {t.membership.desc}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-16 md:mb-24">
            {[
              {
                title: t.membership.pillar1Title,
                description: t.membership.pillar1Desc
              },
              {
                title: t.membership.pillar2Title,
                description: t.membership.pillar2Desc
              },
              {
                title: t.membership.pillar3Title,
                description: t.membership.pillar3Desc
              },
              {
                title: t.membership.pillar4Title,
                description: t.membership.pillar4Desc
              }
            ].map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-[2px] bg-lbbc-green"></div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{pillar.title}</h3>
                </div>
                <p className="text-slate-600 leading-relaxed pl-12">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-slate-900 rounded-2xl p-8 md:p-16 text-center space-y-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-lbbc-green/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-lbbc-green/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                {t.membership.cta}
              </h3>
              <div className="pt-4">
                <Link 
                  to="/membership#tiers"
                  className="inline-flex items-center gap-3 bg-lbbc-green text-white px-10 py-4 rounded-sm font-black text-xs uppercase tracking-[0.2em] hover:bg-lbbc-accent transition-all shadow-xl group"
                >
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
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {t.membership.faqTitle}
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 md:mb-16">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveFaqCategory(category.id);
                    setActiveQuestion(null);
                  }}
                  className={`px-6 py-3 rounded-sm font-black text-[10px] md:text-[11px] uppercase tracking-widest transition-all ${
                    activeFaqCategory === category.id
                      ? 'bg-slate-900 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>

            {/* Questions Accordion */}
            <div className="space-y-4">
              {faqCategories.find(c => c.id === activeFaqCategory)?.questions.map((item, idx) => (
                <div 
                  key={idx}
                  className={`border border-slate-100 rounded-lg overflow-hidden transition-all ${
                    activeQuestion === idx ? 'ring-1 ring-lbbc-green/30 shadow-md' : 'hover:border-slate-200'
                  }`}
                >
                  <button
                    onClick={() => setActiveQuestion(activeQuestion === idx ? null : idx)}
                    className="w-full px-6 py-5 md:px-8 md:py-6 flex items-center justify-between text-left group"
                  >
                    <span className={`text-sm md:text-base font-bold transition-colors ${
                      activeQuestion === idx ? 'text-lbbc-green' : 'text-slate-900 group-hover:text-lbbc-green'
                    }`}>
                      {item.q}
                    </span>
                    <div className={`flex-shrink-0 ml-4 transition-transform duration-300 ${activeQuestion === idx ? 'rotate-180' : ''}`}>
                      <ChevronDown size={20} className={activeQuestion === idx ? 'text-lbbc-green' : 'text-slate-400'} />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {activeQuestion === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0">
                          <div className="h-[1px] w-full bg-slate-100 mb-6"></div>
                          <div className="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                            {item.a}
                          </div>
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
              <button
                key={policy.title}
                onClick={() => setSelectedPolicy(policy)}
                className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-lbbc-green transition-all text-left group flex flex-col justify-between h-full"
              >
                <h4 className="text-sm md:text-base font-black text-slate-900 leading-tight group-hover:text-lbbc-green transition-colors mb-4">
                  {policy.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-lbbc-red transition-colors">
                  {t.membership.viewPolicy} <ArrowRight size={12} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <GovernanceModal 
        policy={selectedPolicy}
        isOpen={!!selectedPolicy}
        onClose={() => setSelectedPolicy(null)}
      />
    </div>
  );
};

const ContactPage = () => {
  const { t } = useLanguage();
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load Elfsight script for LinkedIn widget
    const script = document.createElement('script');
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    script.onerror = () => {
      console.warn('Elfsight script failed to load or threw an error.');
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="pt-32">
      <SEO 
        title={t.nav.contact} 
        description="Get in touch with the Libyan British Business Council for inquiries about membership, events, or trade support."
        canonical="contact"
      />
      {/* Header Banner */}
      <section className="relative h-[250px] md:h-[300px] flex items-center overflow-hidden bg-slate-900">
        <img 
          src="https://lh3.googleusercontent.com/d/1VGQO92bvZODdTICHp8t8oKeGl4XcA5pd" 
          alt="Contact Header" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-lbbc-green/80 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 md:space-y-6"
          >
            <span className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white font-black text-[8px] md:text-[9px] uppercase tracking-[0.4em] border border-white/20">
              {t.contact.tag}
            </span>
            <h1 className="text-2xl md:text-5xl font-black text-white leading-tight max-w-3xl tracking-tight">
              {t.contact.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pt-12 md:pt-20 pb-6 md:pb-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Left Side: Contact Info & Headquarters */}
            <div className="lg:w-1/3 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block">{t.contact.tag}</span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {t.contact.subtitle}
                </h2>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {t.contact.desc}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6 pt-6 border-t border-slate-100"
              >
                <div className="space-y-2">
                  <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block">{t.contact.hq}</span>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Libyan British Business Council
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-50 p-3 rounded-sm border border-slate-100">
                      <MapPin size={18} className="text-lbbc-green" />
                    </div>
                    <div className="text-slate-600 text-sm leading-relaxed font-medium">
                      <p>PO LBBC 2004</p>
                      <p>PO Box 537</p>
                      <p>HORLEY, RH6 6GD</p>
                    </div>
                  </div>

                  {/* Emails */}
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-50 p-3 rounded-sm border border-slate-100">
                      <Mail size={18} className="text-lbbc-green" />
                    </div>
                    <div className="space-y-3">
                      <p className="text-slate-600 text-sm font-medium">
                        <span className="text-slate-400 text-[9px] uppercase tracking-widest block mb-0.5">{t.contact.general}</span>
                        <a href="mailto:info@lbbc.org.uk" className="hover:text-lbbc-green transition-colors">info@lbbc.org.uk</a>
                      </p>
                      <p className="text-slate-600 text-sm font-medium">
                        <span className="text-slate-400 text-[9px] uppercase tracking-widest block mb-0.5">{t.contact.membership}</span>
                        <a href="mailto:events@lbbc.org.uk" className="hover:text-lbbc-green transition-colors">events@lbbc.org.uk</a>
                      </p>
                    </div>
                  </div>

                  {/* Telephone */}
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-50 p-3 rounded-sm border border-slate-100">
                      <Phone size={18} className="text-lbbc-green" />
                    </div>
                    <div className="text-slate-600 text-sm font-medium">
                      <span className="text-slate-400 text-[9px] uppercase tracking-widest block mb-0.5">{t.contact.tel}</span>
                      <a href="tel:+442071291251" className="hover:text-lbbc-green transition-colors">+44 (0) 20 7129 1251</a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Side: Form */}
            <div className="lg:w-2/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-slate-50 p-8 md:p-12 rounded-2xl border border-slate-100 shadow-sm"
              >
                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.contact.form.name}</label>
                      <input 
                        type="text" 
                        id="fullName"
                        className="w-full bg-white border border-slate-200 rounded-sm px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-lbbc-green/20 focus:border-lbbc-green transition-all placeholder:text-slate-300"
                        placeholder={t.contact.form.name}
                      />
                    </div>
                    {/* Job Title */}
                    <div className="space-y-2">
                      <label htmlFor="jobTitle" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.contact.form.job}</label>
                      <input 
                        type="text" 
                        id="jobTitle"
                        className="w-full bg-white border border-slate-200 rounded-sm px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-lbbc-green/20 focus:border-lbbc-green transition-all placeholder:text-slate-300"
                        placeholder={t.contact.form.job}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Company Name */}
                    <div className="space-y-2">
                      <label htmlFor="companyName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.contact.form.company}</label>
                      <input 
                        type="text" 
                        id="companyName"
                        className="w-full bg-white border border-slate-200 rounded-sm px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-lbbc-green/20 focus:border-lbbc-green transition-all placeholder:text-slate-300"
                        placeholder={t.contact.form.company}
                      />
                    </div>
                    {/* Nature of Inquiry */}
                    <div className="space-y-2">
                      <label htmlFor="inquiryType" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.contact.form.inquiry}</label>
                      <div className="relative">
                        <select 
                          id="inquiryType"
                          defaultValue=""
                          className="w-full bg-white border border-slate-200 rounded-sm px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-lbbc-green/20 focus:border-lbbc-green transition-all appearance-none cursor-pointer"
                        >
                          <option value="" disabled>{t.contact.form.select}</option>
                          <option value="membership">{t.contact.form.opt1}</option>
                          <option value="events">{t.contact.form.opt2}</option>
                          <option value="press">{t.contact.form.opt3}</option>
                          <option value="trade">{t.contact.form.opt4}</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.contact.form.message}</label>
                    <textarea 
                      id="message"
                      rows={6}
                      className="w-full bg-white border border-slate-200 rounded-sm px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-lbbc-green/20 focus:border-lbbc-green transition-all resize-none placeholder:text-slate-300"
                      placeholder={t.contact.form.placeholder}
                    ></textarea>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="inline-flex items-center gap-3 bg-lbbc-green text-white px-10 py-4 rounded-sm font-black text-xs uppercase tracking-[0.2em] hover:bg-lbbc-accent transition-all shadow-xl group w-full md:w-auto justify-center"
                    >
                      {t.contact.form.submit}
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* LinkedIn Feed Section */}
      <section className="pt-6 md:pt-10 pb-12 md:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-20">
            <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block mb-3 md:mb-4">{t.contact.socialTag}</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {t.contact.socialTitle}
            </h2>
          </div>
          
          <div className="max-w-5xl mx-auto">
            {/* Elfsight LinkedIn Feed | LBBC LinkedIn Widget */}
            <div className="elfsight-app-a0003657-4b27-403a-aeda-0610cc0d2df4" data-elfsight-app-lazy></div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-12 md:py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium italic">
              {t.contact.disclaimer}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const SpotlightPage = () => {
  const { t } = useLanguage();
  const story = t.featured.fullStory;

  return (
    <div className="pt-32">
      <SEO 
        title={`${story.title} | Spotlight`} 
        description={story.p1.substring(0, 160)}
        canonical="spotlight/capterio"
      />
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center overflow-hidden bg-slate-900">
        <img 
          src="https://lh3.googleusercontent.com/d/1-Z-120GLfzNq146Ri6nfEDakfstYNxUy" 
          alt="Capterio Spotlight" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="inline-block bg-lbbc-green text-white px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-[0.4em] mb-6">
              {t.featured.tag}
            </span>
            <h1 className="text-3xl md:text-6xl font-black text-white leading-tight tracking-tight">
              {story.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-2/3">
              <div className="prose prose-slate prose-lg max-w-none space-y-8 text-slate-600 leading-relaxed">
                <p className="text-xl font-medium text-slate-900 leading-relaxed">
                  {story.p1}
                </p>
                <p>{story.p2}</p>
                <p>{story.p3}</p>
                
                <div className="bg-slate-50 p-8 rounded-2xl border-l-4 border-lbbc-green my-12">
                  <p className="text-slate-900 font-bold italic text-lg m-0">
                    {story.p4}
                  </p>
                </div>

                <p>{story.p5}</p>
                <p>{story.p6}</p>

                <div className="pt-12 border-t border-slate-100">
                  <Link 
                    to="/membership"
                    className="inline-flex items-center gap-3 bg-lbbc-green text-white px-8 py-4 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-lbbc-accent transition-all shadow-xl group"
                  >
                    {story.cta}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3 space-y-12">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 space-y-6">
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">{t.footer.about}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {t.footer.about}
                </p>
              </div>

              <div className="space-y-6">
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">{t.footer.contact}</h4>
                <div className="space-y-4">
                  <a href="mailto:secretariat@lbbc.org.uk" className="flex items-center gap-3 text-sm text-slate-600 hover:text-lbbc-green transition-colors font-bold">
                    <Mail size={18} className="text-lbbc-green" />
                    secretariat@lbbc.org.uk
                  </a>
                  <a href="tel:+442077887935" className="flex items-center gap-3 text-sm text-slate-600 hover:text-lbbc-green transition-colors font-bold">
                    <Phone size={18} className="text-lbbc-green" />
                    +44 (0) 20 7788 7935
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ComingSoonPage = () => {
  const { setLanguage } = useLanguage();
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
      <SEO 
        title="Arabic Page Coming Soon | قريباً الصفحة العربية" 
        description="The Arabic version of the LBBC website is currently in development. Our team is working to bring you the best experience in Arabic."
        canonical=""
      />
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-lbbc-green/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-lbbc-red/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-4xl w-full px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <img 
            src="https://lh3.googleusercontent.com/d/1PGomWa780IpyKLEScVCwx5SOUtqGimcM" 
            alt="LBBC Logo" 
            className="h-20 md:h-24 mx-auto" 
            referrerPolicy="no-referrer" 
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-4 tracking-tighter">
              Arabic Page Coming Soon
            </h1>
            <h2 className="text-3xl md:text-6xl font-black text-lbbc-green tracking-tight" dir="rtl">
              النسخة العربية ستتوفر قريباً
            </h2>
          </div>

          <div className="w-24 h-1 bg-lbbc-red mx-auto"></div>

          <div className="space-y-6">
            <p className="text-lg md:text-2xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
              Our Arabic website is currently under development to provide you with the best experience. Please check back later.
            </p>
            <p className="text-lg md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto" dir="rtl">
              نسختنا العربية قيد التطوير حالياً لتقديم أفضل تجربة لكم. يرجى العودة لاحقاً.
            </p>
          </div>

          <div className="pt-8">
            <button 
              onClick={() => setLanguage('en')}
              className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-lbbc-green transition-all shadow-2xl active:scale-95 group"
            >
              <ArrowUpRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
              Return to English Site / العودة إلى الموقع الإنجليزي
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-0 right-0 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Libyan British Business Council © 2026
        </p>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { language } = useLanguage();

  if (language === 'ar') {
    return <ComingSoonPage />;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/spotlight/capterio" element={<SpotlightPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default function App() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Ignore generic "Script error." which is usually a cross-origin issue from third-party scripts
      if (event.message === 'Script error.' || !event.message) {
        return;
      }
      
      // Ignore ResizeObserver loop errors
      if (event.message.includes('ResizeObserver loop')) {
        return;
      }

      console.error('Global Error caught:', event.error || event.message);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <HelmetProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </HelmetProvider>
  );
}



