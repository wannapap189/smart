export const escapePortfolioText = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

export function portfolioImage({src, caption, keywords, width = 640, height = 480}) {
  const e = escapePortfolioText;
  const terms = [...new Set(keywords.filter(Boolean))].join(', ');
  return `<span class="portfolio-image" itemscope itemtype="https://schema.org/ImageObject"><img itemprop="contentUrl" src="${e(src)}" alt="${e(caption)}" width="${width}" height="${height}" loading="lazy"><meta itemprop="caption" content="${e(caption)}"><meta itemprop="keywords" content="${e(terms)}"></span>`;
}
