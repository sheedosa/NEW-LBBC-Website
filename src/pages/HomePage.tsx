import { SEO } from '../components/SEO';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { MemberDirectory, UpcomingEvents, PartnersTicker, LatestNews } from '../components/HomeComponents';
import { LinkedInFeed } from '../components/LinkedInFeed';

export const HomePage = () => {
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
      <PartnersTicker />
      <LatestNews />
      <LinkedInFeed className="py-12 md:py-20 bg-white" />
    </main>
  );
};

export default HomePage;
