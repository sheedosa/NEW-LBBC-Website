import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, ExternalLink, ArrowRight, ArrowUpRight, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/SEO';
import { newsData } from '../data/news';
import { resourceDocuments, galleryAlbums } from '../config';

export const ResourcesPage = () => {
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
  }, [hash]);

  type Resource =
    | { id: number; type?: 'pdf'; title: string; category: string; file?: string; href?: string; btnLabel?: string; cover?: string }
    | { id: number; type: 'link'; title: string; category: string; href: string; btnLabel: string; logo: string };

  const pdfs = resourceDocuments as unknown as Resource[];

  // Where a document's button points: an uploaded PDF (`file`) takes priority, then a link (`href`).
  const docUrl = (d: Resource): string | undefined =>
    ('file' in d && d.file) ? d.file : ('href' in d && d.href) ? d.href : undefined;

  const news = newsData;

  return (
    <div className="pt-32">
      <SEO 
        title={t.nav.resources} 
        description="Access exclusive market insights, trade guides, news updates, and media galleries for the UK-Libya business community."
        canonical="resources"
      />
      {/* Hero Banner */}
      <section className="relative h-[250px] md:h-[300px] flex items-center overflow-hidden bg-gradient-to-br from-[#1a3323] via-lbbc-green to-[#0f2117]">
        <img 
          src="/images/1BV2ibrdYUyOZxrelp0xPGek2TsVWISM5.png" 
          alt="Resources Header" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3323]/95 via-lbbc-green/50 to-transparent"></div>
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
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-8">{t.resources.toolkitTitle}</h2>
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
                <div className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg relative bg-white border border-slate-200 flex flex-col items-center justify-center cursor-pointer group-hover:shadow-2xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-lbbc-green/5 to-lbbc-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {pdf.type === 'link' && 'logo' in pdf ? (
                    <img src={pdf.logo} alt={pdf.title} className="w-3/4 h-3/4 object-contain p-4" />
                  ) : 'cover' in pdf && pdf.cover ? (
                    <img src={pdf.cover} alt={pdf.title} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <FileText size={80} className="text-slate-200 group-hover:text-lbbc-green/20 transition-colors mb-4" />
                      <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest group-hover:text-lbbc-green transition-colors">{t.resources.clickToOpen}</span>
                    </>
                  )}
                  <div className="absolute top-4 right-4 bg-lbbc-red text-white p-2 rounded-lg shadow-md transform translate-x-2 -translate-y-2 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <ExternalLink size={16} />
                  </div>
                </div>

                <div className="flex flex-col flex-grow pt-6">
                  <div className="space-y-2 mb-6">
                    <span className="text-lbbc-green font-black text-[9px] tracking-widest uppercase">{pdf.category}</span>
                    <h3 className="text-sm md:text-base font-extrabold text-slate-900 group-hover:text-lbbc-red transition-colors leading-tight min-h-[3rem] line-clamp-2">{pdf.title}</h3>
                  </div>
                  {pdf.type === 'link' ? (
                    <a
                      href={docUrl(pdf)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto flex items-center justify-center gap-2 bg-lbbc-green text-white px-4 py-3 rounded-sm text-[9px] font-bold uppercase tracking-widest hover:bg-lbbc-red transition-all shadow-lg"
                    >
                      <ExternalLink size={14} />
                      {'btnLabel' in pdf ? pdf.btnLabel : ''}
                    </a>
                  ) : docUrl(pdf) ? (
                    <a
                      href={docUrl(pdf)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto flex items-center justify-center gap-2 bg-lbbc-green text-white px-4 py-3 rounded-sm text-[9px] font-bold uppercase tracking-widest hover:bg-lbbc-red transition-all shadow-lg group/btn"
                    >
                      <Download size={14} className="group-hover/btn:translate-y-0.5 transition-transform" />
                      {'btnLabel' in pdf && pdf.btnLabel ? pdf.btnLabel : t.resources.download}
                    </a>
                  ) : (
                    <button className="mt-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-sm text-[9px] font-bold uppercase tracking-widest hover:bg-lbbc-red transition-all shadow-lg group/btn">
                      <Download size={14} className="group-hover/btn:translate-y-0.5 transition-transform" />
                      {t.resources.download}
                    </button>
                  )}
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
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight mb-8">
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                <img 
                  src="/images/1_o6UrgupeE--e0CUK6DP9FjWipNVGHG5.png" 
                  alt="UK-Libya Partnership" 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
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
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <span className="text-lbbc-green font-black text-[8px] md:text-[9px] tracking-widest uppercase">{item.category}</span>
                  <h3 className="text-base md:text-lg font-extrabold text-slate-900 leading-snug group-hover:text-lbbc-red transition-colors line-clamp-2">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Media Gallery Section */}
      <section id="gallery" className="py-20 md:py-32 bg-gradient-to-br from-[#050d1f] via-[#0c2548] to-[#02060f] relative overflow-hidden text-white">
        {/* Polish: dot texture + ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px'}} />
        <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] bg-[#02060f]/70 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 md:mb-20">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-white/80 font-bold text-[10px] md:text-[11px] uppercase tracking-[0.4em] mb-4">
                <ImageIcon size={14} className="text-lbbc-red" />
                {t.gallery.tag}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {t.gallery.title} <span className="text-white/70">{t.gallery.subtitle}</span>
              </h2>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <a href="https://www.flickr.com/photos/legacy_libya/albums" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-white text-lbbc-green px-8 py-4 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-lbbc-red hover:text-white transition-all shadow-2xl group">
                {t.gallery.cta}
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {galleryAlbums.map((album, idx) => (
              <a
                key={idx}
                href={album.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="rounded-2xl overflow-hidden shadow-2xl bg-black/40 backdrop-blur-sm p-1 border border-white/10 group-hover:border-lbbc-red/50 group-hover:shadow-[0_30px_60px_-15px_rgba(239,68,68,0.4)] transition-all duration-500">
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-xl bg-slate-950 relative">
                    <img
                      src={album.img}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={album.title}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">{album.label}</p>
                  <h3 className="text-base md:text-lg font-bold text-white group-hover:text-lbbc-red transition-colors leading-tight">{album.title}</h3>
                  <span className="inline-flex items-center gap-2 text-lbbc-red font-black text-[10px] uppercase tracking-widest pt-1 group-hover:gap-3 transition-all">
                    View Album
                    <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourcesPage;
