// Generates ONE honest, specific observation from real analyzed data to open a cold email
// with — never a fabricated compliment ("love your site!") or a guessed pain point. If
// analysis found nothing specific worth mentioning, returns a generic (but still true)
// fallback rather than inventing something. This is the single most important function for
// message quality: a cold email that opens with something real, checkable, and specific reads
// as researched; one that doesn't reads as a template, regardless of how well-written the rest is.
//
// Split into ru/vi 2026-07-28 (see locale.mjs) so a Vietnamese draft doesn't open with a Russian
// sentence — same underlying signals (description/tech-stack/social links), just phrased in the
// locale the rest of the email is written in.
const OBSERVATIONS_BY_LOCALE = {
  ru: {
    noDescription:
      'на сайте не заполнен meta description — часто первый признак, что привлечение клиентов идёт без системной упаковки предложения',
    noAnalytics:
      'не нашёл на сайте подключённой аналитики (GA4/аналог) — сложно понять, какой канал реально приносит клиентов',
    noSocial:
      'на сайте не нашёл ссылок на соцсети или каналы — похоже, что исходящий канал привлечения клиентов пока не выстроен системно',
    wordpressNoOutbound:
      'сайт на WordPress, но заметных признаков активного исходящего привлечения (лендинги под кампании, формы захвата) не увидел',
    fallback:
      'сайт в целом собран аккуратно, но не увидел следов системного исходящего привлечения клиентов/партнёров — обычно это значит, что оно идёт от случая к случаю',
  },
  vi: {
    noDescription:
      'trang web chưa điền meta description — thường là dấu hiệu đầu tiên cho thấy việc thu hút khách hàng chưa được đóng gói bài bản',
    noAnalytics:
      'không thấy công cụ phân tích (GA4 hoặc tương tự) được gắn trên trang web — khó biết kênh nào thực sự mang lại khách hàng',
    noSocial:
      'không tìm thấy liên kết mạng xã hội/kênh nào trên trang web — có vẻ kênh thu hút khách hàng chủ động vẫn chưa được xây dựng bài bản',
    wordpressNoOutbound:
      'trang web dùng WordPress, nhưng không thấy dấu hiệu rõ ràng của việc chủ động thu hút khách hàng (landing page cho chiến dịch, form thu thập thông tin)',
    fallback:
      'trang web nhìn chung được làm gọn gàng, nhưng không thấy dấu hiệu của một hệ thống thu hút khách hàng/đối tác bài bản — thường có nghĩa là việc này vẫn diễn ra ngẫu nhiên',
  },
};

/**
 * @param {object} company
 * @param {'ru'|'vi'} [locale='ru']
 */
export function generateInsight(company, locale = 'ru') {
  const strings = OBSERVATIONS_BY_LOCALE[locale] || OBSERVATIONS_BY_LOCALE.ru;
  const observations = [];

  if (!company.description) {
    observations.push(strings.noDescription);
  }

  const techStack = company.tech_stack || [];
  if (techStack.length > 0 && !techStack.includes('Google Analytics')) {
    observations.push(strings.noAnalytics);
  }

  const socialCount = Object.keys(company.social_links || {}).length;
  if (socialCount === 0) {
    observations.push(strings.noSocial);
  }

  if (techStack.includes('WordPress')) {
    observations.push(strings.wordpressNoOutbound);
  }

  if (observations.length === 0) {
    // Fallback only — no template-level "смотрел {website}" prefix here, unlike the specific
    // observations above: templates.mjs already opens every draft with "Смотрел {website} —",
    // so repeating it here produced a real, shipped bug ("Смотрел X — посмотрел X — ...").
    return strings.fallback;
  }

  return observations[0];
}
