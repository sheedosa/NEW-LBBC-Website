/**
 * Heavy-duty parser for Glueup Membership Directory HTML
 * Extracts names, categories, locations, and descriptions.
 */
export function parseGlueupHTML(html: string) {
  const members: any[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Usually they use card or list item classes
  // We search for cards, if not found, we look for any container with a name-like element
  let cards = Array.from(doc.querySelectorAll('.directory_list-item, .card, [class*="member"], [class*="item"]'));
  
  if (cards.length === 0) {
      // Very aggressive: look for any div that has a heading or strong text
      cards = Array.from(doc.querySelectorAll('div, li')).filter(el => {
          const text = el.textContent?.trim() || '';
          return text.length > 5 && (el.querySelector('h3, h4, strong, .name, .title') !== null);
      });
  }

  cards.forEach((card, index) => {
    const name = card.querySelector('.name, .title, h3, h4, h5, strong, [class*="name"]')?.textContent?.trim();
    if (!name || name.length < 2) return;
    
    // Avoid duplicates
    if (members.some(m => m.name === name)) return;

    const category = card.querySelector('.category, .industry, .type, [class*="type"], [class*="industry"]')?.textContent?.trim();
    const location = card.querySelector('.location, .city, .state, [class*="location"]')?.textContent?.trim();
    const description = card.querySelector('.description, .bio, .summary, [class*="desc"], p')?.textContent?.trim();
    const image = card.querySelector('img')?.getAttribute('src');
    const website = card.querySelector('a[href^="http"]')?.getAttribute('href');

    if (name) {
      members.push({
        id: index,
        name,
        category: category || 'General',
        location: location || 'N/A',
        description: description || 'No description provided.',
        website: website || '#',
        image: image || `https://picsum.photos/seed/${name}/400/250`
      });
    }
  });

  return members;
}
