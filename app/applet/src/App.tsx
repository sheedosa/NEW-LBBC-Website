import React, { useState, useEffect } from 'react';
import { Search, MapPin, ExternalLink, Users, Building2, ChevronRight, Globe, Import, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation, 
  useParams 
} from 'react-router-dom';
import { parseGlueupHTML } from './lib/parser';

// GA Tracker Component
function GAPageTracker() {
  const location = useLocation();
  const GA_ID = (import.meta as any).env.VITE_GA_ID || 'G-Y12N8L6DVJ';
  
  useEffect(() => {
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('config', GA_ID, {
        page_path: location.pathname + location.search
      });
    }
  }, [location, GA_ID]);
  
  return null;
}

const NEWS_DATA = [
  {
    id: 'news-1',
    title: 'LBBC Anniversary: A Decade of Fostering Strategic Partnerships',
    date: 'March 15, 2026',
    category: 'Corporate',
    content: 'The Lithuanian-British Business Council celebrated its 10th anniversary in London, highlighting the significant growth in trade between the two nations...',
    image: 'https://picsum.photos/seed/anniversary/800/400'
  },
  {
    id: 'news-2',
    title: 'New Trade Agreement Opens Doors for FinTech Collaboration',
    date: 'April 02, 2026',
    category: 'Trade',
    content: 'A new memorandum of understanding between Vilnius and the City of London promises to streamline regulatory hurdles for Lithuanian FinTech startups...',
    image: 'https://picsum.photos/seed/fintech/800/400'
  }
];

const INITIAL_MEMBERS = [
  {
    id: 'lbbc-001',
    name: 'Lithuanian-British Business Council',
    category: 'Non-Profit',
    location: 'London, UK / Vilnius, Lithuania',
    description: 'Promoting trade and investment between Lithuania and the United Kingdom through networking and advocacy.',
    website: 'https://lbbc.co.uk',
    image: 'https://picsum.photos/seed/lbbc/400/250'
  }
];

const CATEGORIES = ['All', 'Technology', 'Finance', 'Legal', 'Logistics', 'Manufacturing', 'Non-Profit', 'General'];

function NewsDetailPage() {
  const { id } = useParams();
  const article = NEWS_DATA.find(a => a.id === id);

  if (!article) return <div className="p-20 text-center font-bold text-slate-400">Article not found</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-12 pb-20 px-6 max-w-4xl mx-auto"
    >
      <Link to="/" className="inline-flex items-center gap-2 text-blue-600 font-bold mb-8 hover:-translate-x-1 transition-transform group">
        <ChevronRight size={18} className="rotate-180 group-hover:scale-110 transition-transform" /> Back to Directory
      </Link>
      <div className="relative h-[400px] rounded-[2rem] overflow-hidden mb-12 shadow-2xl shadow-blue-500/10">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
      </div>
      <div className="flex items-center gap-4 mb-6">
        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
          {article.category}
        </span>
        <span className="text-slate-400 text-xs font-medium">{article.date}</span>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-8 tracking-tight">
        {article.title}
      </h1>
      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg whitespace-pre-line">
        {article.content}
        {"\n\n"}
        Stay tuned for more updates from the Lithuanian-British business corridor.
      </div>
    </motion.div>
  );
}

export default function App() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Unified data sync - Pulls from the Glueup-to-Design Bridge Automatically
  useEffect(() => {
    const syncDirectory = async () => {
      try {
        const response = await fetch('/api/members');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setMembers(data);
          }
        }
      } catch (e) {
        console.error("Directory sync delayed. Retrying...");
      }
    };

    syncDirectory();
    // Refresh every hour to keep data fresh
    const interval = setInterval(syncDirectory, 3600000);
    return () => clearInterval(interval);
  }, []);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || member.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Router>
      <GAPageTracker />
      <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100 p-1.5 hover:shadow-md transition-shadow">
                <img 
                  src="https://lh3.googleusercontent.com/d/11To-VLQw9FxQJVtaH7b0zuHliiry--_8" 
                  alt="LBBC Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight text-slate-900">LBBC</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-blue-600 -mt-1">Business Council</p>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Directory</Link>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Events</a>
              <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-all shadow-sm active:scale-95">
                Contact Us
              </button>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <>
              {/* Hero Section */}
              <section className="relative pt-20 pb-12 px-6 bg-white overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-60" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-3xl opacity-60" />
                
                <div className="max-w-7xl mx-auto relative">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-4xl mx-auto mb-16"
                  >
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-6">
                      Official Member Directory
                    </span>
                    <h2 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-8">
                      Connecting Lithuanian & British <span className="text-blue-600 italic">Excellence.</span>
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                      The premier business community fostering innovation and strategic growth between two powerhouses of Northern Europe and the United Kingdom.
                    </p>
                  </motion.div>

                  {/* Featured Carousel */}
                  <div className="relative mb-20">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Featured Partners</h3>
                      <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                          <ChevronRight size={16} className="rotate-180" />
                        </button>
                        <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
                      {members.slice(0, 5).map((member) => (
                        <div 
                          key={`carousel-${member.id}`}
                          className="min-w-[300px] md:min-w-[400px] snap-start group"
                        >
                          <div className="relative h-64 rounded-3xl overflow-hidden mb-4 shadow-lg">
                            <img 
                              src={member.image} 
                              alt={member.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                              <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">{member.category}</p>
                              <h4 className="text-xl font-bold">{member.name}</h4>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* News Section */}
              <section className="py-20 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-end justify-between mb-12">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4">Latest Insights</h2>
                      <p className="text-slate-500">News and updates from the Lithuanian-British business community.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {NEWS_DATA.map((article) => (
                      <Link 
                        to={`/news/${article.id}`} 
                        key={article.id}
                        className="group flex flex-col md:flex-row gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all"
                      >
                        <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0">
                          <img src={article.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{article.category}</span>
                            <span className="text-[10px] font-medium text-slate-400">{article.date}</span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                            {article.title}
                          </h4>
                          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                            {article.content}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>

              {/* Directory Section */}
              <section id="directory" className="py-20 px-6 bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto">
                  <div className="mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Full Directory</h2>
                    <p className="text-slate-500 max-w-xl">Browse our complete network of corporate members and strategic partners.</p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                    {/* Search Bar */}
                    <div className="relative flex-grow group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                      <input 
                        type="text"
                        placeholder="Search by company name or industry..."
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-12">
                    {CATEGORIES.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-5 py-2 rounded-full text-xs font-semibold transition-all shadow-sm ${
                          selectedCategory === category 
                            ? 'bg-blue-600 text-white scale-105' 
                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Directory Count */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-slate-200 pb-4 gap-4">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-slate-500">
                        Showing <span className="text-slate-900 font-bold">{filteredMembers.length}</span> members
                      </p>
                      {members.length <= 1 && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100">
                          <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" /> Live Data Sync Active
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                        Sort by Recent <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Member Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                      {filteredMembers.map((member, index) => (
                        <motion.div
                          key={member.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col"
                        >
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={member.image} 
                              alt={member.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            />
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-blue-600 shadow-sm border border-slate-100">
                                {member.category}
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-8 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {member.name}
                            </h3>
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-4">
                              <MapPin size={14} />
                              {member.location}
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-8 flex-grow">
                              {member.description}
                            </p>
                            
                            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                              <a 
                                href={member.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors"
                              >
                                <Globe size={16} />
                                Visit Website
                              </a>
                              <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                                <ExternalLink size={18} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {filteredMembers.length === 0 && (
                    <div className="py-20 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                        <Users size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">No members found</h3>
                      <p className="text-slate-500">Try adjusting your search or filter keywords.</p>
                    </div>
                  )}
                </div>
              </section>
            </>
          } />
          <Route path="/news/:id" element={<NewsDetailPage />} />
        </Routes>

        <footer className="bg-slate-900 text-slate-400 py-16 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-6 text-white group">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-white/10 p-1.5 transition-colors group-hover:bg-white/20">
                  <img 
                    src="https://lh3.googleusercontent.com/d/1eel7F5Xgk3Yyq-KabqrRjmAZAUIyEUwb" 
                    alt="LBBC Logo" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h1 className="font-bold text-xl tracking-tight">LBBC</h1>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                Supporting the business community between Lithuania and the United Kingdom through networking, advocacy, and strategic insights.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div>
                <h4 className="text-white font-bold text-sm mb-6">Organization</h4>
                <ul className="space-y-4 text-xs">
                  <li><Link to="/" className="hover:text-white transition-colors">Our Story</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Team & Board</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Reports</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-6">Membership</h4>
                <ul className="space-y-4 text-xs">
                  <li><a href="#" className="hover:text-white transition-colors">Join LBBC</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Benefits</a></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Directory</Link></li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h4 className="text-white font-bold text-sm mb-6">Legal</h4>
                <ul className="space-y-4 text-xs">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
            <p>© 2026 Lithuanian-British Business Council. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white">LinkedIn</a>
              <a href="#" className="hover:text-white">Twitter</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

