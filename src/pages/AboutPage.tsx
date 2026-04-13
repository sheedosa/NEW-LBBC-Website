import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { X, Building2, Zap, Globe, ShieldCheck, Briefcase, ArrowRight, ChevronRight } from 'lucide-react';

interface Person {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const BioModal = ({ person, onClose }: { person: Person; onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-sm shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <X size={24} className="text-slate-500" />
        </button>
        
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
            <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 rounded-sm overflow-hidden shadow-lg">
              <img 
                src={person.image} 
                alt={person.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-slate-900 leading-tight">{person.name}</h3>
              <p className="text-lbbc-green font-bold uppercase tracking-widest text-sm">{person.role}</p>
            </div>
          </div>
          
          <div className="prose prose-slate max-w-none">
            {person.bio.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-slate-600 leading-relaxed mb-4 text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PersonCard = ({ person, onReadBio }: { person: Person; onReadBio: (p: Person) => void; key?: string }) => (
  <div className="group">
    <div className="aspect-square rounded-sm overflow-hidden bg-slate-100 mb-6 relative">
      <img 
        src={person.image} 
        alt={person.name} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-lbbc-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
    <div className="space-y-2">
      <h4 className="text-xl font-black text-slate-900 leading-tight">{person.name}</h4>
      <p className="text-lbbc-green font-bold uppercase tracking-widest text-[10px]">{person.role}</p>
      <button 
        onClick={() => onReadBio(person)}
        className="text-slate-400 hover:text-lbbc-green transition-colors text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 pt-2"
      >
        Read Bio <ChevronRight size={14} className="rotate-90" />
      </button>
    </div>
  </div>
);

const AboutPage = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const leadership: Person[] = [
    {
      name: 'Lord Trefgarne',
      role: 'Honorary President',
      image: 'https://lh3.googleusercontent.com/d/1GJzC8N2lF2CVOQJ32QxZpJi4CIgivksG',
      bio: `Lord Trefgarne served in the Conservative administration of Margaret Thatcher as a Government Whip from 1979 to 1981 and as Parliamentary Under-Secretary of State at the Department of Trade in 1981; at the Foreign and Commonwealth Office from 1981 to 1982; at the Department of Health and Social Security from 1982 to 1983; and at the Ministry of Defence from 1983 to 1985.

He was then promoted to Minister of State for Defence Support, a post he held until 1986, and then served as Minister of State for Defence Procurement from 1986 to 1989 and as a Minister of State at the Department of Trade and Industry from 1989 to 1990. In 1989 he was admitted to the Privy Council.

Lord Trefgarne was Chairman of the LBBC from its foundation until December 2013.`
    },
    {
      name: 'Sir Vincent Fean KCVO',
      role: 'Chairman Emeritus',
      image: 'https://lh3.googleusercontent.com/d/1FihplH92JJ4oBhol4RTHayhv9dWEMHky',
      bio: `Sir Vincent was Chairman of the LBBC from January 2016 to 2 March 2022. He joined the Foreign Office in 1975, learning Arabic in 1977-8. He has served in Iraq, Syria, Malta, Libya (Ambassador 2006 – 10) and Jerusalem (responsible for UK/Palestinian relations 2010 – 14).

He left the Foreign Office in February 2014. Deeply interested in Libya/UK business, education and health cooperation, he is also a member of the Palestine Britain Business Council and an Officer of the Most Venerable Order of the Hospital of St John of Jerusalem.`
    },
    {
      name: 'Peter Millett CMG',
      role: 'Chairman',
      image: 'https://lh3.googleusercontent.com/d/1GaKHyh3sGNZ4J22uMJ0RHM4wHTZ5FvXN',
      bio: `Peter Millett was appointed as Chairman of the LBBC on 2 March 2022.

He served as British Ambassador to Libya from June 2015 to January 2018.

During that time he played a role in supporting the UN’s efforts to negotiate and then implement the Libya Political Agreement. He met and built relationships with key political, security and economic players in Libya and in the international community. He also managed the return of the British Embassy from Tunis to Tripoli.

Before Libya, he was British Ambassador to Jordan from 2011 to 2015 and High Commissioner to Cyprus from 2015 to 2010. Earlier in his career he had diplomatic postings in Venezuela, Qatar, Brussels and Athens.`
    }
  ];

  const board: Person[] = [
    {
      name: 'Ghassan Atiga',
      role: 'Head of Libya Business, Bank ABC',
      image: 'https://lh3.googleusercontent.com/d/1lZnTxLNqqFSCkP4c0E3hAUBaVFw1pSAq',
      bio: `Ghassan as Head of Libyan Business for Bank ABC, has a robust foundation in corporate and trade finance. The Libyan Business Coverage leverages a deep collective expertise in MENA, Europe and North America markets within Bank ABC global coverage in 16 countries. The group’s commitment to excellence and strategic insight has empowered them to nurture pivotal cross-border partnerships, reinforcing Bank ABC’s presence as a stalwart in international wholesale banking. Ghassan joined the LBBC Board in April 2025.`
    },
    {
      name: 'Ahmed Ben Halim',
      role: 'Founder and Chairman, Libya Holdings Group',
      image: 'https://lh3.googleusercontent.com/d/1nBpPgZVRGPPNqoP0vDAXCeJTCJJY3B9z',
      bio: `Ahmed is the Founder and Chairman of Libya Holdings Group Ltd. (LHG). Ahmed has over 35 years’ experience in Principal Investments, Corporate Finance and Asset Management. Ahmed serves as chairman of Joint Libyan Cement Company (JLCC) which is the holding company for the largest cement business in Libya, with factories in Benghazi, Hawari and Al Fattiah. It is a portfolio company of LHG in partnership with the Libyan government Economic and Social Development Fund (ESDF). He is also Chairman of the Libya Oil Rigs and Services Company (LORASCO), which specialises in oil services and drilling. In the last two years LHG have set up a joint venture with Terminal Investments Limited (TIL) to run Port Operations in Misurata. LHG has also launched Ghibli limited a company delivering high quality Manpower services to companies in Libya.

LHG was established to pursue investment opportunities in Libya after the 2011 revolution. To date the firm has made strategic investments in several industry sectors including oil and gas, power generation and cement. In addition to its direct investment activities LHG has entered into several strategic partnerships with large international companies to create operating businesses in Libya. LHG provides its partners with local knowledge, a network of contacts, operational support and seed capital.`
    },
    {
      name: 'Tarek Eltumi',
      role: 'Founder and Partner, Eltumi Partners',
      image: 'https://lh3.googleusercontent.com/d/1KjCsgV1zJO6HkxdXWVIsltBVnoiQRY9H',
      bio: `Tarek is a dual Libyan/New York qualified lawyer with a broad practice that covers general corporate and commercial matters (foreign direct investment, joint ventures, restructurings), project development, finance and dispute resolution. He works principally in the sovereign wealth, energy, infrastructure and telecommunications sectors, with a geographic focus mainly on Libya, but also on Europe and Sub-Saharan Africa more generally.

Tarek practised in Tripoli, Libya for just under 10 years where he advised on a range of innovative international finance deals and major infrastructure, oil and gas and tourism projects. Tarek went on to work as General Counsel of AECOM Libya Housing and Infrastructure Inc., where he directed all legal issues arising from the US$55bn Libyan Housing and Infrastructure Program.

During the 2011 Libyan uprising, he served as special advisor and member of staff of the Prime Minister of Libya appointed by the National Transitional Council.

Tarek then went on to join the international law firm Hogan Lovells 2012 where he ran that firm’s Libya Practice and was a member of the Infrastructure, Energy, Resources and Projects practice. Tarek became Partner at that firm and retired in June 2018 to pursue establishing Eltumi & Co as a leading Libyan law practice.

Tarek is fluent in both English and Arabic and is widely published on matters of Libyan law.`
    },
    {
      name: 'Pauline Graham',
      role: 'Co-Founder, Libyan British Business Council',
      image: 'https://lh3.googleusercontent.com/d/1LpH1-ewdmGn4n4zuYSCJAkSMI1h9IAr2',
      bio: `Pauline Graham has spent her working career in the exhibitions and conference industry. With her late husband, Dermot Graham, she set up an events management company which organised trade and investment delegations to overseas markets specifically viewed as ‘difficult’.

She was a co-founder of the Libyan British Business Council and was, until April 2018, responsible for the business side of the organisation. Pauline’s previous role was General Secretary of BILNAS`
    }
  ];

  const team: Person[] = [
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

Before joining the LBBC, Awatef worked for the German International Cooperation Agency, GIZ, as an Administration and Finance Manager in the Libya Office. Prior to joining GIZ, she worked at the British Council as the Programme Director, Managing several projects across Libya and the MENA region. Awatef is also a Co-Founder of a Non-Governmental Organisation called Peace, Equality, and Prosperity (PEP), focused on youth and women capacity development.

Awatef Shawish brings a wealth of expertise, leadership acumen, and a passion for societal advancement to her role at LBBC, embodying a dedication to fostering collaboration, growth, and sustainable development within the Libyan business landscape.`
    }
  ];

  const partners = [
    { name: 'UK FCDO', logo: 'https://lh3.googleusercontent.com/d/1psnVwfbGNU2WSPuGdnl2djUYQl23ATpf' },
    { name: 'British Embassy', logo: 'https://lh3.googleusercontent.com/d/1jo0v_igiizeIZelan6FOd9NSrnLMCMxc' },
    { name: 'UK DIT', logo: 'https://lh3.googleusercontent.com/d/1WITAc3xTAWHEMWnfMZXvr8HR3beKE-S2' },
    { name: 'NOC', logo: 'https://lh3.googleusercontent.com/d/1298kn4VMFdwtdchqygp_Edk5XbaBty8B' },
    { name: 'REAOL', logo: 'https://lh3.googleusercontent.com/d/1WjTH2bcM6soZgKQuXBbmGgwQobDMiFNg' },
    { name: 'ARAB BANKERS ASSOCIATION', logo: 'https://lh3.googleusercontent.com/d/1QiJ_LHu_hWYY4U08i2-uQhJ_IKCfd1UM' },
    { name: 'EIC', logo: 'https://lh3.googleusercontent.com/d/1Ub0tAlDhewWlWegKMDOxPY8gHUk7vmwc' },
  ];

  return (
    <div className="pt-[100px]">
      {/* Header Section */}
      <section className="relative h-[300px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/d/1Gvq_EVuoyOiiBD4ZQvVIOwMOVlMQAC0h" 
            alt="About Header" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight max-w-3xl drop-shadow-2xl">
              Advancing UK-Libya Bilateral Trade Since 2004
            </h1>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4">
              <span className="text-lbbc-green font-bold text-[11px] uppercase tracking-[0.3em] mb-4 block">ABOUT THE LBBC</span>
              <h2 className="text-4xl font-black text-slate-900 leading-tight">Established for Strategic Partnership</h2>
            </div>
            <div className="lg:col-span-8 space-y-8">
              <p className="text-slate-600 leading-relaxed text-xl font-medium">
                Established in 2004, the Libyan British Business Council (LBBC) is a non-political association dedicated to promoting trade and investment between the United Kingdom and Libya. As a trade promotion body, we act as a practical resource for our members, helping companies across all major sectors navigate the complexities of bilateral commerce.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                Our membership comprises a wide range of leading UK and Libyan companies. This collective network provides a platform for shared expertise and reliable partnerships, ensuring our members have the support they need to work effectively in both markets.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                Operating with strict neutrality, the LBBC remains focused on fostering sustainable economic ties. We provide the networking opportunities, market insights, and advocacy required to help our members turn business potential into successful, long-term operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section id="mission" className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <span className="text-lbbc-green font-bold text-[11px] uppercase tracking-[0.3em] mb-4 block">OUR MISSION</span>
            <h2 className="text-4xl font-black text-slate-900 leading-tight max-w-3xl mb-8">
              To facilitate and promote business relations between the UK and Libya by providing a neutral, professional platform for connectivity, market insight, and commercial growth.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-12 shadow-sm border border-slate-100 space-y-6">
              <div className="w-12 h-12 bg-lbbc-green/10 flex items-center justify-center rounded-sm">
                <Globe className="text-lbbc-green" size={24} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Networking & Connectivity</h3>
              <p className="text-slate-600 leading-relaxed">
                We create opportunities for UK and Libyan businesses to build meaningful relationships. From trade delegations and face-to-face meetings to high-profile receptions in London and Libya, we provide the platforms where partnerships are formed.
              </p>
            </div>
            <div className="bg-white p-12 shadow-sm border border-slate-100 space-y-6">
              <div className="w-12 h-12 bg-lbbc-green/10 flex items-center justify-center rounded-sm">
                <ShieldCheck className="text-lbbc-green" size={24} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Information & Intelligence</h3>
              <p className="text-slate-600 leading-relaxed">
                Staying informed is critical to navigating any market. We provide our members with real-time economic updates, monthly webinars featuring key experts, and high-quality business reports that offer a clear view of current business developments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Leadership Section */}
      <section id="leadership" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center">
            <span className="text-lbbc-green font-bold text-[11px] uppercase tracking-[0.3em] mb-4 block">OUR LEADERSHIP</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Executive Leadership</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {leadership.map((person) => (
              <PersonCard key={person.name} person={person} onReadBio={setSelectedPerson} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Board Section */}
      <section id="board" className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <span className="text-lbbc-green font-bold text-[11px] uppercase tracking-[0.3em] mb-4 block">BOARD OF DIRECTORS</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Our Board of Directors</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {board.map((person) => (
              <PersonCard key={person.name} person={person} onReadBio={setSelectedPerson} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section id="team" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <span className="text-lbbc-green font-bold text-[11px] uppercase tracking-[0.3em] mb-4 block">OUR TEAM</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Executive Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
            {team.map((person) => (
              <PersonCard key={person.name} person={person} onReadBio={setSelectedPerson} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Partners Section */}
      <section id="partners" className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center">
            <span className="text-lbbc-green font-bold text-[11px] uppercase tracking-[0.3em] mb-4 block">OUR PARTNERS</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Strategic Partners</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {partners.map((partner) => (
              <div key={partner.name} className="group flex flex-col items-center gap-4 w-full sm:w-[calc(50%-20px)] lg:w-[calc(25%-30px)] max-w-[320px]">
                <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-100 flex items-center justify-center h-32 md:h-48 w-full group-hover:shadow-md transition-all grayscale group-hover:grayscale-0">
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="max-h-full max-w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center group-hover:text-lbbc-green transition-colors">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bio Modal */}
      <AnimatePresence>
        {selectedPerson && (
          <BioModal 
            person={selectedPerson} 
            onClose={() => setSelectedPerson(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutPage;
