import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, ArrowRight, ChevronDown, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { settings, telHref } from '../config';
import { SEO } from '../components/SEO';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMPTY_FORM = { name: '', email: '', job: '', company: '', inquiry: '', message: '' };

export const ContactPage = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const script = document.createElement('script');
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    script.onerror = () => {};
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setServerError('');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: settings.web3formsKey,
          name: form.name,
          email: form.email,
          subject: `LBBC Website Enquiry — ${form.inquiry || 'General'}`,
          message: `Job Title: ${form.job}\nCompany: ${form.company}\nInquiry Type: ${form.inquiry}\n\n${form.message}`,
          from_name: 'LBBC Website',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
      } else {
        setServerError(data.message || t.contact.form.errorMsg);
        setStatus('error');
      }
    } catch {
      setServerError(t.contact.form.errorMsg);
      setStatus('error');
    }
  };

  const inputClass = "w-full bg-white border border-slate-200 rounded-sm px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-lbbc-green/20 focus:border-lbbc-green transition-all placeholder:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const isDisabled = status === 'submitting';

  return (
    <div className="pt-32">
      <SEO
        title={t.nav.contact}
        description="Get in touch with the Libyan British Business Council for inquiries about membership, events, or trade support."
        canonical="contact"
      />

      {/* Header Banner */}
      <section className="relative h-[250px] md:h-[300px] flex items-center overflow-hidden bg-gradient-to-br from-[#1a3323] via-lbbc-green to-[#0f2117]">
        <img src="/images/1VGQO92bvZODdTICHp8t8oKeGl4XcA5pd.png" alt="Contact Header" className="absolute inset-0 w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3323]/95 via-lbbc-green/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-4 md:space-y-6">
            <span className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white font-black text-[8px] md:text-[9px] uppercase tracking-[0.4em] border border-white/20">{t.contact.tag}</span>
            <h1 className="text-2xl md:text-5xl font-black text-white leading-tight max-w-3xl tracking-tight">{t.contact.title}</h1>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pt-12 md:pt-20 pb-6 md:pb-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

            {/* Contact info sidebar */}
            <div className="lg:w-1/3 space-y-8">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-4">
                <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block">{t.contact.tag}</span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">{t.contact.subtitle}</h2>
                <p className="text-slate-600 leading-relaxed font-medium">{t.contact.desc}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-6 pt-6 border-t border-slate-100">
                <div className="space-y-2">
                  <span className="text-lbbc-green font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] block">{t.contact.hq}</span>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Libyan British Business Council</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-50 p-3 rounded-sm border border-slate-100"><Mail size={18} className="text-lbbc-green" /></div>
                    <div className="space-y-3">
                      <p className="text-slate-600 text-sm font-medium"><span className="text-slate-400 text-[9px] uppercase tracking-widest block mb-0.5">{t.contact.general}</span><a href={`mailto:${settings.email}`} className="hover:text-lbbc-green transition-colors">{settings.email}</a></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-50 p-3 rounded-sm border border-slate-100"><Phone size={18} className="text-lbbc-green" /></div>
                    <div className="text-slate-600 text-sm font-medium"><span className="text-slate-400 text-[9px] uppercase tracking-widest block mb-0.5">{t.contact.tel}</span><a href={telHref(settings.phoneContact)} className="hover:text-lbbc-green transition-colors">{settings.phoneContact}</a></div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Form panel */}
            <div className="lg:w-2/3">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="bg-slate-50 p-8 md:p-12 rounded-2xl border border-slate-100 shadow-sm min-h-[480px] flex flex-col justify-center">

                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    /* ── Success state ── */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center justify-center py-12 text-center space-y-6"
                    >
                      <div className="w-20 h-20 bg-lbbc-green/10 rounded-full flex items-center justify-center">
                        <CheckCircle size={40} className="text-lbbc-green" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t.contact.form.successTitle}</h3>
                        <p className="text-slate-600 max-w-sm leading-relaxed">{t.contact.form.successMsg}</p>
                      </div>
                      <button
                        onClick={() => { setStatus('idle'); setForm(EMPTY_FORM); }}
                        className="inline-flex items-center gap-2 text-lbbc-green font-black text-xs uppercase tracking-widest hover:text-lbbc-red transition-colors"
                      >
                        <ArrowRight size={14} /> {t.contact.form.tryAgain}
                      </button>
                    </motion.div>
                  ) : (
                    /* ── Form state ── */
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-8"
                    >
                      {/* Honeypot — spam prevention */}
                      <input type="checkbox" name="botcheck" className="hidden" />

                      {/* Row 1: Name + Email */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.contact.form.name} *</label>
                          <input
                            type="text" id="name" name="name" required
                            value={form.name} onChange={handleChange} disabled={isDisabled}
                            className={inputClass} placeholder={t.contact.form.name}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.contact.form.email} *</label>
                          <input
                            type="email" id="email" name="email" required
                            value={form.email} onChange={handleChange} disabled={isDisabled}
                            className={inputClass} placeholder="you@company.com"
                          />
                        </div>
                      </div>

                      {/* Row 2: Job + Company */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label htmlFor="job" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.contact.form.job}</label>
                          <input
                            type="text" id="job" name="job"
                            value={form.job} onChange={handleChange} disabled={isDisabled}
                            className={inputClass} placeholder={t.contact.form.job}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="company" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.contact.form.company}</label>
                          <input
                            type="text" id="company" name="company"
                            value={form.company} onChange={handleChange} disabled={isDisabled}
                            className={inputClass} placeholder={t.contact.form.company}
                          />
                        </div>
                      </div>

                      {/* Row 3: Inquiry type */}
                      <div className="space-y-2">
                        <label htmlFor="inquiry" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.contact.form.inquiry}</label>
                        <div className="relative">
                          <select
                            id="inquiry" name="inquiry"
                            value={form.inquiry} onChange={handleChange} disabled={isDisabled}
                            className={`${inputClass} appearance-none cursor-pointer`}
                          >
                            <option value="">{t.contact.form.select}</option>
                            <option value="Membership">{t.contact.form.opt1}</option>
                            <option value="Event Registration/Sponsorship">{t.contact.form.opt2}</option>
                            <option value="Press & Media">{t.contact.form.opt3}</option>
                            <option value="General Trade Support">{t.contact.form.opt4}</option>
                          </select>
                          <ChevronDown size={16} className="absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Row 4: Message */}
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.contact.form.message} *</label>
                        <textarea
                          id="message" name="message" rows={6} required
                          value={form.message} onChange={handleChange} disabled={isDisabled}
                          className={`${inputClass} resize-none`}
                          placeholder={t.contact.form.placeholder}
                        />
                      </div>

                      {/* Error banner */}
                      {status === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-lg px-4 py-3"
                        >
                          <AlertCircle size={16} className="text-lbbc-red flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-lbbc-red font-medium">{serverError || t.contact.form.errorMsg}</p>
                        </motion.div>
                      )}

                      {/* Submit */}
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isDisabled}
                          className="inline-flex items-center gap-3 bg-lbbc-green text-white px-10 py-4 rounded-sm font-black text-xs uppercase tracking-[0.2em] hover:bg-lbbc-accent transition-all shadow-xl group w-full md:w-auto justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {status === 'submitting' ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              {t.contact.form.sending}
                            </>
                          ) : (
                            <>
                              {t.contact.form.submit}
                              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
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
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">{t.contact.socialTitle}</h2>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className={`elfsight-app-${settings.elfsightAppId}`} data-elfsight-app-lazy></div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-12 md:py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium italic">{t.contact.disclaimer}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
