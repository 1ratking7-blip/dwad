// Generates ONE honest, specific observation from real analyzed data to open a cold email
// with — never a fabricated compliment ("love your site!") or a guessed pain point. If
// analysis found nothing specific worth mentioning, returns a generic (but still true)
// fallback rather than inventing something. This is the single most important function for
// message quality: a cold email that opens with something real, checkable, and specific reads
// as researched; one that doesn't reads as a template, regardless of how well-written the rest is.
export function generateInsight(company) {
  const observations = [];

  if (!company.description) {
    observations.push('на сайте не заполнен meta description — это первое, что видно в поиске рядом со ссылкой');
  }

  const techStack = company.tech_stack || [];
  if (techStack.length > 0 && !techStack.includes('Google Analytics')) {
    observations.push('не нашёл на сайте подключённой аналитики (GA4/аналог) — сложно измерить, что реально работает');
  }

  const socialCount = Object.keys(company.social_links || {}).length;
  if (socialCount === 0) {
    observations.push('на сайте не нашёл ссылок на соцсети — если они есть, стоит их добавить, это лёгкий SEO/доверие-сигнал');
  }

  if (techStack.includes('WordPress')) {
    observations.push('сайт на WordPress — там обычно есть быстрые SEO-выигрыши, которые не настроены по умолчанию (мета-теги, sitemap, скорость)');
  }

  if (observations.length === 0) {
    return `посмотрел ${company.website} — сайт в целом собран аккуратно, но у меня есть пара конкретных идей по росту трафика/конверсии, которые обычно не видны без внешнего аудита`;
  }

  return observations[0];
}
