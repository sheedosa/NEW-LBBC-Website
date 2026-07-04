// Central access point for CMS-editable structured content (content/*.json).
// Keeping these imports in one module limits churn if paths ever change.
import settings from '../content/settings.json';
import heroFile from '../content/hero.json';
import spotlight from '../content/spotlight.json';
import leadershipFile from '../content/team/leadership.json';
import boardFile from '../content/team/board.json';
import partnersFile from '../content/partners.json';
import sponsorsFile from '../content/sponsors.json';
import footerFile from '../content/footer.json';
import resourcesFile from '../content/resources.json';

export { settings, spotlight };
export const heroSlides = heroFile.slides as Array<{
  image: string;
  imageWebp: string;
  link1: string;
  link2: string;
  objectPosition?: string;
}>;
export const leadership = leadershipFile.people;
export const board = boardFile.people;
export const partners = partnersFile.items;
export const sponsorsEvents = sponsorsFile.events;
export const footerPartners = footerFile.partners;
export const footerSponsors = footerFile.sponsors;
export const resourceDocuments = resourcesFile.documents;
export const galleryAlbums = resourcesFile.albums;

// Build a `tel:` href from a display phone number, e.g. "+44 (0) 20 7788 7935" -> "tel:+442077887935".
export const telHref = (phone: string) => 'tel:' + phone.replace(/\(0\)/g, '').replace(/[^\d+]/g, '');
