import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Building2, X, ExternalLink, Globe, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/SEO';

import { getApiUrl, getStaticDataUrl } from '../utils/api';

interface MemberDetail {
  description: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export const DirectoryPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState(t.directory.allSectors);
  const [councilMembers, setCouncilMembers] = useState<any[]>([]);
  const [corporateMembers, setCorporateMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'council' | 'corporate'>('council');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [memberDetail, setMemberDetail] = useState<MemberDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

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

  const fetchMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let data = null;

      // Try API endpoint first (served by Express with auto-refresh)
      try {
        const response = await fetch(getApiUrl('members'));
        if (response.ok) {
          data = await response.json();
        }
      } catch {}

      // Fallback to static JSON
      if (!data) {
        try {
          const staticRes = await fetch(getStaticDataUrl('members.json'));
          if (staticRes.ok) {
            data = await staticRes.json();
          }
        } catch {}
      }

      if (data) {
        setCouncilMembers(data.council || []);
        setCorporateMembers(data.corporate || []);
        // If council is empty, default to corporate tab
        if ((!data.council || data.council.length === 0) && data.corporate?.length > 0) {
          setActiveTab('corporate');
        }
      } else {
        setError('Unable to load directory data. Please try again later.');
      }
    } catch (err) {
      console.error('Error fetching members:', err);
      setError(err instanceof Error ? err.message : t.directory.errorText);
    } finally {
      setIsLoading(false);
    }
  }, [getApiUrl, t.directory]);

  // Fetch member detail from the server proxy
  const fetchMemberDetail = useCallback(async (member: any) => {
    const detailId = member?.glueupId || member?.id;
    if (!detailId) return;

    setIsLoadingDetail(true);
    setMemberDetail(null);

    try {
      const type = member.membershipType || activeTab;
      const response = await fetch(getApiUrl(`members/detail/${detailId}?type=${type}`));
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setMemberDetail(result.data);
        }
      }
    } catch (err) {
      console.warn('Could not fetch member details:', err);
    } finally {
      setIsLoadingDetail(false);
    }
  }, [getApiUrl, activeTab]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // When a member is selected, fetch their details
  useEffect(() => {
    if (selectedMember) {
      fetchMemberDetail(selectedMember);
    } else {
      setMemberDetail(null);
    }
  }, [selectedMember, fetchMemberDetail]);

  const filteredCouncil = councilMembers.filter(member => 
    (member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     (member.sector || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedSector === t.directory.allSectors || member.sector === selectedSector)
  );

  const filteredCorporate = corporateMembers.filter(member => 
    (member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     (member.sector || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedSector === t.directory.allSectors || member.sector === selectedSector)
  );

  // Get the description to display (from detail fetch or member data)
  const getDescription = () => {
    if (memberDetail?.description) return memberDetail.description;
    if (selectedMember?.description) return selectedMember.description;
    return "The Libyan British Business Council is pleased to represent this organization within our membership directory.";
  };

  const getWebsite = () => {
    if (memberDetail?.website) return memberDetail.website;
    if (selectedMember?.website) return selectedMember.website;
    return null;
  };

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
          src="/images/1m0pcFsUJoAa0h4oTj57jnTosPbhuOTjS.png" 
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
                <Building2 className="text-red-500" size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{t.directory.error}</h3>
              <p className="text-slate-500 mb-4">{error}</p>
              <button 
                onClick={() => fetchMembers()}
                className="px-8 py-3 bg-lbbc-green text-white font-black uppercase tracking-widest rounded-sm hover:bg-lbbc-red transition-all"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {isLoading ? (
                Array.from({ length: 18 }).map((_, i) => (
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
                    transition={{ delay: (idx % 20) * 0.02 }}
                    onClick={() => setSelectedMember(member)}
                    className={`bg-white p-3 sm:p-4 md:p-5 rounded-xl border transition-all group flex flex-col items-center justify-center text-center aspect-square relative overflow-hidden cursor-pointer ${selectedMember?.id === member.id ? 'border-lbbc-green ring-2 ring-lbbc-green/10 shadow-md scale-95' : 'border-slate-100 shadow-sm hover:shadow-md hover:border-lbbc-green/20'}`}
                  >
                    <div className="w-full flex-1 flex items-center justify-center mb-2 min-h-0">
                      {member.logo ? (
                        <img
                          src={member.logo}
                          alt={member.name}
                          className={`w-full h-full object-contain transition-all duration-500 ${selectedMember?.id === member.id ? 'scale-105' : 'group-hover:scale-105'}`}
                          style={{ maxHeight: '100%', maxWidth: '100%' }}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-slate-50 rounded-full">
                          <Building2 size={22} className="text-slate-200" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-slate-900 leading-tight line-clamp-2 uppercase tracking-tight w-full">{member.name}</h3>
                    <span className="text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 group-hover:text-lbbc-green transition-colors line-clamp-1">{member.sector}</span>
                    <div className="mt-1 text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-lbbc-green opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                      {t.directory.about || 'More Info'} →
                    </div>
                    <div className={`absolute bottom-0 left-0 w-full h-1 bg-lbbc-green transform transition-transform duration-300 ${selectedMember?.id === member.id ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`}></div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {!isLoading && !error && (activeTab === 'council' ? filteredCouncil : filteredCorporate).length === 0 && (
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
        </div>
      </section>

      {/* Member Details Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex-shrink-0 bg-lbbc-green px-8 py-4 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">More Information</h3>
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="w-8 h-8 flex items-center justify-center bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-8 md:p-10 overflow-y-auto">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8 pb-8 border-b border-slate-100 text-center sm:text-left">
                  <div className="w-28 h-28 md:w-36 md:h-36 flex-shrink-0 flex items-center justify-center bg-slate-50 rounded-xl p-2 border border-slate-100 shadow-inner overflow-hidden">
                    {selectedMember.logo ? (
                      <img src={selectedMember.logo} alt={selectedMember.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <Building2 size={40} className="text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-3 uppercase tracking-tight">{selectedMember.name}</h2>
                    <span className="inline-block px-3 py-1 bg-lbbc-green/10 text-lbbc-green font-bold text-[10px] uppercase tracking-widest rounded-sm mb-2">
                      {selectedMember.sector}
                    </span>
                    {selectedMember.membershipType && (
                      <span className="inline-block ml-2 px-3 py-1 bg-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-widest rounded-sm">
                        {selectedMember.membershipType === 'council' ? 'Council Member' : 'Corporate Member'}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-8">
                  {/* About Section */}
                  <div>
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-4 h-[2px] bg-lbbc-green" />
                      About
                    </h4>
                    {isLoadingDetail ? (
                      <div className="flex items-center gap-3 text-slate-400 py-4">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-sm font-medium">Loading...</span>
                      </div>
                    ) : (
                      <p className="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-line text-justify">
                        {getDescription()}
                      </p>
                    )}
                  </div>

                  {/* Contact Details */}
                  {(getWebsite() || memberDetail?.email || memberDetail?.phone || memberDetail?.address) && (
                    <div>
                      <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-4 h-[2px] bg-lbbc-green" />
                        Contact Details
                      </h4>
                      <div className="space-y-3">
                        {getWebsite() && (
                          <a 
                            href={getWebsite()!.startsWith('http') ? getWebsite()! : `https://${getWebsite()}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-lbbc-green hover:text-lbbc-red font-bold text-sm transition-colors group"
                          >
                            <Globe size={16} className="flex-shrink-0" />
                            <span className="break-all">{getWebsite()!.replace(/^https?:\/\/(www\.)?/, '')}</span>
                            <ExternalLink size={14} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
                          </a>
                        )}
                        {memberDetail?.email && (
                          <a 
                            href={`mailto:${memberDetail.email}`}
                            className="flex items-center gap-3 text-slate-600 hover:text-lbbc-green font-medium text-sm transition-colors"
                          >
                            <Mail size={16} className="flex-shrink-0 text-lbbc-green" />
                            {memberDetail.email}
                          </a>
                        )}
                        {memberDetail?.phone && (
                          <a 
                            href={`tel:${memberDetail.phone}`}
                            className="flex items-center gap-3 text-slate-600 hover:text-lbbc-green font-medium text-sm transition-colors"
                          >
                            <Phone size={16} className="flex-shrink-0 text-lbbc-green" />
                            {memberDetail.phone}
                          </a>
                        )}
                        {memberDetail?.address && (
                          <div className="flex items-start gap-3 text-slate-600 text-sm">
                            <MapPin size={16} className="flex-shrink-0 text-lbbc-green mt-0.5" />
                            <span>{memberDetail.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-8 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => setSelectedMember(null)}
                      className="inline-flex items-center justify-center px-8 py-4 border border-slate-200 text-slate-500 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DirectoryPage;
