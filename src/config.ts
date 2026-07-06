// Central access point for CMS-editable structured content. Content is organized by PAGE
// (content/pages/*.json — mirroring the website layout in the CMS); this barrel re-exports
// the structured parts so components import from one stable module.
import settings from '../content/settings.json';
import homePage from '../content/pages/home.json';
import aboutPage from '../content/pages/about.json';
import eventsPage from '../content/pages/events.json';
import resourcesPage from '../content/pages/resources.json';
import membershipPage from '../content/pages/membership.json';
import spotlightPage from '../content/pages/spotlight.json';
import globalPage from '../content/pages/global.json';

export { settings };
export const heroSlides = homePage.slides as Array<{
  image: string;
  imageWebp: string;
  link1: string;
  link2: string;
  objectPosition?: string;
}>;
export const leadership = aboutPage.leadership;
export const board = aboutPage.board;
export const partners = aboutPage.partners;
export const sponsorsEvents = eventsPage.sponsors;
export const footerPartners = globalPage.footerPartners;
export const footerSponsors = globalPage.footerSponsors;
export const resourceDocuments = resourcesPage.documents;
export const galleryAlbums = resourcesPage.albums;
export const membershipPricing = membershipPage.pricing;
export const spotlight = { heroImage: spotlightPage.heroImage };

// Build a `tel:` href from a display phone number, e.g. "+44 (0) 20 7788 7935" -> "tel:+442077887935".
export const telHref = (phone: string) => 'tel:' + phone.replace(/\(0\)/g, '').replace(/[^\d+]/g, '');
