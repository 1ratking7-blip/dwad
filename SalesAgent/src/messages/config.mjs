// Fill these in before generating real drafts — templates reference them directly.
// Kept separate from templates.mjs so updating your pitch/case-study doesn't mean touching
// template logic.
//
// Switched 2026-07-28 from the "SEO/growth audit" offer to "система привлечения клиентов и
// партнёров под ключ" (см. Plan 1 Month/plan.md) — outreach/lead-gen as a service, not a site
// audit.
//
// Split 2026-07-28 into per-locale entries (ru/vi) so a Russian lead gets a Russian pitch and a
// Vietnamese lead gets a Vietnamese one — see src/messages/locale.mjs for how the locale is
// picked, and templates.mjs for the matching per-locale templates. The `vi` copy below is
// LLM-translated business Vietnamese, not written by a native speaker — have a native speaker
// (or at least a fluent reader) sanity-check tone/formality before the first real send, same
// caution as any machine-translated outbound copy.
export const SENDER_CONFIG = {
  ru: {
    sender_name: 'Danil',
    service_name:
      'систему привлечения клиентов и партнёров под ключ: определяю целевую аудиторию, собираю базу контактов, готовлю персонализированные обращения и цепочку follow-up, настраиваю CRM и еженедельную аналитику',
    // One honest, checkable proof point. No invented numbers — leave the parenthetical off until
    // a real pilot produces one.
    case_study_blurb:
      'Например, на одном из проектов (ZHELEZO) я сам выстроил такую систему с нуля: сегментация аудитории, персонализированные обращения, CRM и отслеживание ответов — от идеи до первых результатов.',
    calendly_or_contact: '1ratking7@gmail.com',
  },
  vi: {
    sender_name: 'Danil',
    service_name:
      'hệ thống thu hút khách hàng và đối tác trọn gói: xác định đối tượng mục tiêu, xây dựng danh sách liên hệ, chuẩn bị thông điệp cá nhân hóa và chuỗi theo dõi (follow-up), thiết lập CRM và báo cáo phân tích hàng tuần',
    case_study_blurb:
      'Ví dụ, với một dự án của tôi (ZHELEZO), tôi đã tự xây dựng hệ thống này từ đầu: phân khúc đối tượng, thông điệp cá nhân hóa, CRM và theo dõi phản hồi — từ ý tưởng đến kết quả đầu tiên.',
    calendly_or_contact: '1ratking7@gmail.com',
  },
};
