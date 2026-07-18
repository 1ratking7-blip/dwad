// Each template is a function(ctx) -> { subject, body } so personalization logic (insight,
// company name, etc.) is plain JS, not a fragile string-replace mini-language.
export const TEMPLATES = {
  first_email: (ctx) => ({
    subject: `Пара идей по ${ctx.company.name}`,
    body: `Здравствуйте,

Смотрел ${ctx.company.website} — ${ctx.insight}.

Я делаю ${ctx.sender.service_name}. ${ctx.sender.case_study_blurb}

Если полезно — могу за 15 минут пройтись по паре конкретных находок по вашему сайту, без
обязательств. Удобно на этой неделе?

${ctx.sender.sender_name}
${ctx.sender.calendly_or_contact}`,
  }),

  follow_up_1: (ctx) => ({
    subject: `Re: Пара идей по ${ctx.company.name}`,
    body: `Здравствуйте,

На связи ещё раз — писал на прошлой неделе про ${ctx.company.website}. Понимаю, что писем
много, поэтому коротко: если тема аудита/роста сейчас не в приоритете, дайте знать — не буду
писать больше. Если интересно — просто ответьте, когда удобно созвониться.

${ctx.sender.sender_name}`,
  }),

  follow_up_2: (ctx) => ({
    subject: `Закрываю тему — ${ctx.company.name}`,
    body: `Здравствуйте,

Последнее письмо от меня по этой теме — не хочу занимать ваше внимание, если сейчас не время.
Если ситуация изменится и понадобится взгляд со стороны на SEO/производительность/рост сайта —
буду рад помочь, просто напишите.

${ctx.sender.sender_name}
${ctx.sender.calendly_or_contact}`,
  }),

  reply: (ctx) => ({
    subject: `Re: ${ctx.company.name}`,
    body: `Здравствуйте,

Спасибо за ответ! [ЗАПОЛНИТЬ ВРУЧНУЮ: отреагировать на конкретный вопрос/возражение из их
письма — это не шаблонизируется честно, дальше нужен ручной ответ по содержанию].

${ctx.sender.sender_name}`,
  }),

  proposal: (ctx) => ({
    subject: `Предложение по ${ctx.company.name}`,
    body: `Здравствуйте,

По итогам нашего разговора — предлагаю начать с полного аудита сайта ${ctx.company.website}:
SEO, производительность, безопасность, точки роста конверсии. По итогам — отчёт с конкретными
находками и приоритизированный план (что даёт наибольший эффект быстрее всего).

[ЗАПОЛНИТЬ ВРУЧНУЮ: объём работ, сроки, стоимость — зависит от разговора, не шаблонизируется].

${ctx.sender.sender_name}
${ctx.sender.calendly_or_contact}`,
  }),
};
