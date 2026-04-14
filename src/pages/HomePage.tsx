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
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
      label: "Strategic Partnership",
      title: "Advancing UK-Libya Bilateral Trade",
      subtitle: "The LBBC is a non-political association dedicated to promoting trade and investment between the United Kingdom and Libya.",
      cta: "Become a Member",
      secondaryCta: "Our Mission"
    },
    {
      image: "https://images.unsplash.com/photo-1449156001935-d2863fb22690?auto=format&fit=crop&q=80",
      label: "Global Connectivity",
      title: "Bridging Markets, Building Growth",
      subtitle: "Connecting leading UK and Libyan companies across all major sectors through high-level networking and trade delegations.",
      cta: "View Directory",
      secondaryCta: "Upcoming Events"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={slides[currentSlide].image} 
            alt="Hero background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/40"></div>
        </motion.div>
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full pt-32 md:pt-20">
        <div className="max-w-4xl">
          <motion.div
            key={`label-${currentSlide}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="h-px w-12 bg-lbbc-accent"></span>
            <span className="text-lbbc-accent font-black text-[11px] uppercase tracking-[0.4em] drop-shadow-sm">
              {slides[currentSlide].label}
            </span>
          </motion.div>

          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] mb-8 tracking-tight drop-shadow-2xl"
          >
            {slides[currentSlide].title}
          </motion.h1>

          <motion.p
            key={`sub-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-base md:text-xl text-slate-200 leading-relaxed max-w-2xl mb-12 font-medium drop-shadow-lg"
          >
            {slides[currentSlide].subtitle}
          </motion.p>

          <motion.div
            key={`btns-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6"
          >
            <button className="group px-8 md:px-10 py-4 md:py-5 bg-lbbc-green text-white font-black text-[11px] md:text-[12px] uppercase tracking-[0.25em] rounded-sm hover:bg-lbbc-accent hover:text-lbbc-green transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3">
              {slides[currentSlide].cta}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 md:px-10 py-4 md:py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 font-black text-[11px] md:text-[12px] uppercase tracking-[0.25em] rounded-sm hover:bg-white hover:text-lbbc-green transition-all active:scale-95 flex items-center justify-center">
              {slides[currentSlide].secondaryCta}
            </button>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 md:bottom-12 left-6 right-6 md:left-auto md:right-12 z-20 flex flex-col md:flex-row items-center justify-between md:justify-end gap-8">
        <div className="flex items-center gap-3 md:gap-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1 md:h-1.5 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-10 md:w-12 bg-lbbc-accent' : 'w-3 md:w-4 bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="p-3 md:p-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-lbbc-green transition-all active:scale-90 backdrop-blur-sm"
          >
            <ChevronLeft size={18} md:size={20} />
          </button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="p-3 md:p-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-lbbc-green transition-all active:scale-90 backdrop-blur-sm"
          >
            <ChevronRight size={18} md:size={20} />
          </button>
        </div>
      </div>

    </section>
  );
};

const About = () => {
  const stats = [
    { label: 'Founded', value: '2004', icon: <Building2 className="text-lbbc-green" /> },
    { label: 'Member Companies', value: '150+', icon: <Users className="text-lbbc-green" /> },
    { label: 'Annual Events', value: '25+', icon: <Calendar className="text-lbbc-green" /> },
    { label: 'Trade Delegations', value: '12+', icon: <Globe className="text-lbbc-green" /> },
  ];

  return (
    <section id="about" className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <span className="text-lbbc-green font-black text-[11px] uppercase tracking-[0.4em] mb-6 block">About the Council</span>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-10 tracking-tight">
                Facilitating Strategic <span className="text-lbbc-green">Bilateral Trade</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-12 font-medium">
                The Libyan British Business Council (LBBC) is a non-political association dedicated to promoting trade and investment between the UK and Libya.
              </p>
              
              <div className="grid grid-cols-2 gap-8 mb-12">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 bg-slate-50 rounded-sm border-l-4 border-lbbc-green"
                  >
                    <div className="mb-3">{stat.icon}</div>
                    <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <button className="group flex items-center gap-4 text-[12px] font-black uppercase tracking-[0.3em] text-lbbc-green hover:text-lbbc-accent transition-all">
                Learn More About Our Mission
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 rounded-sm overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1577416416829-d4368c3b924a?auto=format&fit=crop&q=80" 
                alt="Business meeting" 
                className="w-full h-[600px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-lbbc-green/10 mix-blend-multiply"></div>
            </motion.div>
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-lbbc-accent/10 rounded-full blur-3xl -z-0"></div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-lbbc-green/10 rounded-full blur-3xl -z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MemberDirectory = () => {
  const logos = [
    { name: 'NOC', url: 'https://lh3.googleusercontent.com/d/1298kn4VMFdwtdchqygp_Edk5XbaBty8B' },
    { name: 'Bank ABC', url: 'https://lh3.googleusercontent.com/d/1PGomWa780IpyKLEScVCwx5SOUtqGimcM' },
    { name: 'UK FCDO', url: 'https://lh3.googleusercontent.com/d/1psnVwfbGNU2WSPuGdnl2djUYQl23ATpf' },
    { name: 'British Embassy', url: 'https://lh3.googleusercontent.com/d/1jo0v_igiizeIZelan6FOd9NSrnLMCMxc' },
    { name: 'GE', url: 'https://lh3.googleusercontent.com/d/1WjTH2bcM6soZgKQuXBbmGgwQobDMiFNg' },
    { name: 'ARAB BANKERS ASSOCIATION', url: 'https://lh3.googleusercontent.com/d/1QiJ_LHu_hWYY4U08i2-uQhJ_IKCfd1UM' },
    { name: 'EIC', url: 'https://lh3.googleusercontent.com/d/1WITAc3xTAWHEMWnfMZXvr8HR3beKE-S2' },
    { name: 'Petrofac', url: 'https://lh3.googleusercontent.com/d/11BUh5G-wftMv200yhAlZwPrKsYkC0eBE' },
  ];

  const doubledLogos = [...logos, ...logos, ...logos];

  return (
    <section id="directory" className="py-16 bg-slate-50 border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <span className="text-lbbc-green font-black text-[10px] uppercase tracking-[0.4em] mb-3 block">Our Members</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Leading Global Partners</h2>
        </div>
        <button className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-lbbc-green transition-all">
          View Full Directory
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10"></div>
        
        <motion.div 
          animate={{ x: [0, -1920] }}
          transition={{ 
            duration: 40, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex items-center gap-16 whitespace-nowrap"
        >
          {doubledLogos.map((logo, i) => (
            <div key={i} className="flex-shrink-0 group">
              <div className="h-16 w-40 bg-white rounded-sm shadow-sm border border-slate-100 flex items-center justify-center p-6 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:shadow-md transition-all duration-500">
                <img 
                  src={logo.url} 
                  alt={logo.name} 
                  className="max-h-full max-w-full object-contain" 
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const UpcomingEvents = () => {
  const events = [
    {
      date: '15',
      month: 'APR',
      title: 'UK-Libya Energy Forum 2026',
      location: 'London, UK',
      type: 'Conference',
      image: 'https://images.unsplash.com/photo-1540575861501-7ad05823c95b?auto=format&fit=crop&q=80'
    },
    {
      date: '22',
      month: 'MAY',
      title: 'Infrastructure Delegation to Tripoli',
      location: 'Tripoli, Libya',
      type: 'Trade Mission',
      image: 'https://images.unsplash.com/photo-1449156001935-d2863fb22690?auto=format&fit=crop&q=80'
    },
    {
      date: '08',
      month: 'JUN',
      title: 'Digital Economy Roundtable',
      location: 'Virtual Event',
      type: 'Webinar',
      image: 'https://images.unsplash.com/photo-1591115765373-520b7a217157?auto=format&fit=crop&q=80'
    }
  ];

  return (
    <section id="events" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-2xl">
            <span className="text-lbbc-green font-black text-[11px] uppercase tracking-[0.4em] mb-6 block">Engagement</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">Upcoming <span className="text-lbbc-green">Events</span></h2>
          </div>
          <button className="group px-8 py-4 bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-sm hover:bg-lbbc-green transition-all shadow-xl active:scale-95 flex items-center gap-3">
            View Calendar
            <Calendar size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative h-80 mb-8 overflow-hidden rounded-sm shadow-xl">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                <div className="absolute top-6 left-6 bg-white p-4 rounded-sm shadow-2xl text-center min-w-[70px] group-hover:bg-lbbc-accent transition-colors duration-500">
                  <div className="text-2xl font-black text-slate-900 leading-none mb-1">{event.date}</div>
                  <div className="text-[10px] font-black text-lbbc-green uppercase tracking-widest">{event.month}</div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 text-lbbc-accent text-[10px] font-black uppercase tracking-widest mb-2">
                    <Zap size={12} fill="currentColor" />
                    {event.type}
                  </div>
                  <h3 className="text-xl font-black text-white leading-tight group-hover:text-lbbc-accent transition-colors">{event.title}</h3>
                </div>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
                  <MapPin size={14} className="text-lbbc-green" />
                  {event.location}
                </div>
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-lbbc-green" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedStory = () => {
  return (
    <section className="py-24 md:py-32 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80" 
          alt="Abstract tech" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm p-8 md:p-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-lbbc-accent/20 text-lbbc-accent rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                <ShieldCheck size={14} />
                Featured Insight
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8 tracking-tight">
                The Future of <span className="text-lbbc-accent">Renewable Energy</span> in Libya
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed mb-12 font-medium">
                Libya's strategic position and vast solar potential present unique opportunities for UK-Libya collaboration in the green energy transition.
              </p>
              <div className="flex flex-wrap gap-10 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-lbbc-green flex items-center justify-center">
                    <Zap size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-black text-lg">Solar Focus</div>
                    <div className="text-slate-400 text-xs uppercase tracking-widest font-bold">Primary Resource</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-lbbc-accent flex items-center justify-center">
                    <ExternalLink size={20} className="text-lbbc-green" />
                  </div>
                  <div>
                    <div className="text-white font-black text-lg">UK Expertise</div>
                    <div className="text-slate-400 text-xs uppercase tracking-widest font-bold">Strategic Partner</div>
                  </div>
                </div>
              </div>
              <button className="group px-10 py-5 bg-lbbc-green text-white font-black text-[12px] uppercase tracking-[0.3em] rounded-sm hover:bg-lbbc-accent hover:text-lbbc-green transition-all shadow-2xl flex items-center gap-3">
                Read Full Report
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-sm overflow-hidden shadow-2xl border-4 border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80" 
                  alt="Solar panels" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-lbbc-accent p-8 rounded-sm shadow-2xl hidden md:block">
                <div className="text-4xl font-black text-lbbc-green mb-1">2030</div>
                <div className="text-[10px] font-black text-lbbc-green/70 uppercase tracking-widest">Target Year</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const LatestNews = () => {
  const news = [
    {
      category: 'Trade Update',
      title: 'LBBC Delegation Meets with Libyan National Oil Corporation',
      excerpt: 'High-level discussions focused on expanding technical cooperation and infrastructure development...',
      date: 'March 12, 2026',
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80'
    },
    {
      category: 'Member News',
      title: 'New Strategic Partnership Announced in Healthcare Sector',
      excerpt: 'Leading UK medical providers sign MOU with Libyan health authorities for digital transformation...',
      date: 'March 08, 2026',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80'
    },
    {
      category: 'Market Insight',
      title: 'Libyan Banking Sector: Opportunities for Digital Innovation',
      excerpt: 'A comprehensive look at the evolving financial landscape and the role of UK fintech expertise...',
      date: 'March 05, 2026',
      image: 'https://images.unsplash.com/photo-1551288049-bbbda5366392?auto=format&fit=crop&q=80'
    }
  ];

  return (
    <section id="news" className="py-24 md:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-2xl">
            <span className="text-lbbc-green font-black text-[11px] uppercase tracking-[0.4em] mb-6 block">Intelligence</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">Latest from <span className="text-lbbc-green">the LBBC</span></h2>
          </div>
          <button className="group flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-lbbc-green transition-all">
            View All News
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {news.map((item, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-slate-100"
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute top-6 left-6 px-4 py-2 bg-lbbc-green text-white text-[9px] font-black uppercase tracking-widest rounded-sm">
                  {item.category}
                </div>
              </div>
              <div className="p-10">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                  <Calendar size={14} className="text-lbbc-green" />
                  {item.date}
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight mb-6 group-hover:text-lbbc-green transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 leading-relaxed mb-8 font-medium">
                  {item.excerpt}
                </p>
                <button className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-lbbc-green group-hover:text-lbbc-accent transition-colors">
                  Read More
                  <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  return (
    <>
      <Hero />
      <About />
      <MemberDirectory />
      <UpcomingEvents />
      <FeaturedStory />
      <LatestNews />
    </>
  );
};

export default HomePage;
