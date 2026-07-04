import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { heroSlides } from '../config';

export const Hero = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slide imagery/links come from the CMS (content/hero.json); the text comes from the
  // bilingual translations (t.hero.slides), merged by index.
  const slides = heroSlides.map((s, i) => ({
    ...s,
    title: t.hero.slides[i]?.title,
    subtitle: t.hero.slides[i]?.subtitle,
    cta1: t.hero.slides[i]?.cta1,
    cta2: t.hero.slides[i]?.cta2,
  }));

  useEffect(() => {
    // Preload webp versions of all slides
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.imageWebp;
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
          <picture className="block w-full h-full">
            <source srcSet={slides[currentSlide].imageWebp} type="image/webp" />
            <img
              src={slides[currentSlide].image}
              alt="Hero Background"
              className="w-full h-full object-cover"
              style={{ objectPosition: slides[currentSlide].objectPosition || 'center' }}
              fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
            />
          </picture>
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
                  className="bg-slate-900 border border-slate-900 text-white px-8 md:px-10 py-3.5 md:py-4 rounded-sm text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 w-full sm:w-auto text-center"
                >
                  {slides[currentSlide].cta2}
                </a>
              ) : (
                <Link 
                  to={slides[currentSlide].link2 || '#'}
                  className="bg-slate-900 border border-slate-900 text-white px-8 md:px-10 py-3.5 md:py-4 rounded-sm text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 w-full sm:w-auto text-center"
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
            <ChevronLeft size={18} className="rotate-180 group-active:scale-90 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
