// Each template is a function(ctx) -> { subject, body } so personalization logic (insight,
// company name, etc.) is plain JS, not a fragile string-replace mini-language.
//
// Rewritten 2026-07-28 for the "система привлечения клиентов и партнёров под ключ" offer (see
// Plan 1 Month/plan.md, "Дни 8-14" section) — ru.first_email/after_interest/follow_up_1 follow
// the three scripts from that plan almost verbatim, adapted to plug in ctx.insight instead of a
// bracketed placeholder. The old SEO-audit wording (follow_up_2/proposal) is adapted, not
// dropped, so a lead already mid-sequence under the old offer doesn't need special-casing.
//
// Split into ru/vi 2026-07-28 (see locale.mjs) — the vi block is a faithful adaptation of the ru
// one, not a literal word-for-word translation, but every ru template has a vi counterpart with
// the same structure and the same [ЗАПОЛНИТЬ]-style manual placeholders so nothing gets
// fabricated in either language. The Vietnamese wording is LLM-translated business Vietnamese —
// have it reviewed by a native/fluent speaker before the first real send.
// Brackets exist to make an un-filled placeholder visually obvious so it never accidentally
// gets sent as-is. Once a real value is supplied (see bin/... or a manual generateDraft call),
// showing it wrapped in brackets looks like sloppy copy — so only wrap the placeholder text,
// not real content. Found 2026-07-28 while drafting a real reply to MPSTATS: their after_interest
// draft came out reading "Первая возможность — [у вас на сайте уже есть...]" with real content
// still bracketed.
function fillOrPlaceholder(value, placeholder) {
  return value ? value : `[${placeholder}]`;
}

export const TEMPLATES = {
  ru: {
    first_email: (ctx) => ({
      subject: `Идеи по привлечению клиентов — ${ctx.company.name}`,
      body: `Здравствуйте,

Посмотрел, как ${ctx.company.name} привлекает клиентов (${ctx.company.website}) — ${ctx.insight}.

Заметил несколько точек, где можно выстроить более системный исходящий канал: база целевых
компаний, персонализация и повторные касания. Подготовил три конкретные идеи для вашего проекта.
Могу отправить короткий разбор?

${ctx.sender.sender_name}
${ctx.sender.calendly_or_contact}`,
    }),

    // Sent only after the lead replied "yes/давайте" to first_email — ctx needs three manually
    // filled observations (opportunity_1/2/3), same reasoning as insight.mjs: a fabricated
    // "opportunity" reads worse than an honest placeholder that forces you to actually look.
    after_interest: (ctx) => ({
      subject: `Re: Идеи по привлечению клиентов — ${ctx.company.name}`,
      body: `Здравствуйте,

Первая возможность — ${fillOrPlaceholder(ctx.opportunity_1, 'ЗАПОЛНИТЬ: конкретное наблюдение по их outreach/сайту')}.
Вторая — ${fillOrPlaceholder(ctx.opportunity_2, 'ЗАПОЛНИТЬ: конкретная группа потенциальных клиентов/партнёров для них')}.
Третья — ${fillOrPlaceholder(ctx.opportunity_3, 'ЗАПОЛНИТЬ: как улучшить их первое обращение или follow-up')}.

Я могу собрать и запустить такую систему под ключ: от базы до CRM и аналитики. Если
что-то из этого откликается — дайте знать, с чего было бы удобнее начать.

${ctx.sender.sender_name}
${ctx.sender.calendly_or_contact}`,
    }),

    follow_up_1: (ctx) => ({
      subject: `Re: Идеи по привлечению клиентов — ${ctx.company.name}`,
      body: `Здравствуйте,

Возвращаюсь к сообщению выше про ${ctx.company.website}. Дополнительно посмотрел
${fillOrPlaceholder(ctx.follow_up_detail, 'ЗАПОЛНИТЬ: конкретную деталь компании, замеченную с момента первого письма')}
и вижу возможность протестировать outreach на сегменте ${fillOrPlaceholder(ctx.target_segment, 'ЗАПОЛНИТЬ: аудитория')}.
Даже если сейчас не планируете запуск, могу отправить структуру теста.

${ctx.sender.sender_name}`,
    }),

    follow_up_2: (ctx) => ({
      subject: `Закрываю тему — ${ctx.company.name}`,
      body: `Здравствуйте,

Последнее письмо от меня по этой теме — не хочу занимать ваше внимание, если сейчас не время.
Если ситуация изменится и понадобится системный канал привлечения клиентов/партнёров —
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

По итогам нашего разговора — предлагаю за 30 дней собрать для вас управляемую систему
привлечения клиентов/партнёров: определить сегменты, подготовить базу (${ctx.company.website}
и похожие), персонализацию, цепочки касаний, CRM и еженедельную отчётность. Начнём с пилота,
после которого будет видно, какие сегменты и сообщения дают лучший ответ.

[ЗАПОЛНИТЬ ВРУЧНУЮ: объём работ, сроки, стоимость — зависит от разговора, не шаблонизируется].

${ctx.sender.sender_name}
${ctx.sender.calendly_or_contact}`,
    }),
  },

  vi: {
    first_email: (ctx) => ({
      subject: `Vài ý tưởng thu hút khách hàng cho ${ctx.company.name}`,
      body: `Kính gửi anh/chị,

Tôi đã xem cách ${ctx.company.name} thu hút khách hàng (${ctx.company.website}) — ${ctx.insight}.

Tôi nhận thấy một vài điểm có thể giúp xây dựng một kênh tiếp cận khách hàng bài bản hơn: danh
sách công ty mục tiêu, cá nhân hóa thông điệp và các lần theo dõi (follow-up) tiếp theo. Tôi đã
chuẩn bị ba ý tưởng cụ thể cho dự án của anh/chị. Tôi có thể gửi một bản phân tích ngắn được không?

${ctx.sender.sender_name}
${ctx.sender.calendly_or_contact}`,
    }),

    after_interest: (ctx) => ({
      subject: `Re: Vài ý tưởng thu hút khách hàng cho ${ctx.company.name}`,
      body: `Kính gửi anh/chị,

Cơ hội đầu tiên — ${fillOrPlaceholder(ctx.opportunity_1, 'ĐIỀN THỦ CÔNG: quan sát cụ thể về outreach/website của họ')}.
Cơ hội thứ hai — ${fillOrPlaceholder(ctx.opportunity_2, 'ĐIỀN THỦ CÔNG: nhóm khách hàng/đối tác tiềm năng cụ thể cho họ')}.
Cơ hội thứ ba — ${fillOrPlaceholder(ctx.opportunity_3, 'ĐIỀN THỦ CÔNG: cách cải thiện thư đầu tiên hoặc follow-up của họ')}.

Tôi có thể xây dựng và triển khai một hệ thống trọn gói: từ danh sách khách hàng đến CRM và báo
cáo phân tích. Nếu điều này phù hợp — cứ cho tôi biết nên bắt đầu từ đâu sẽ thuận tiện nhất.

${ctx.sender.sender_name}
${ctx.sender.calendly_or_contact}`,
    }),

    follow_up_1: (ctx) => ({
      subject: `Re: Vài ý tưởng thu hút khách hàng cho ${ctx.company.name}`,
      body: `Kính gửi anh/chị,

Tôi quay lại với tin nhắn trước về ${ctx.company.website}. Tôi vừa tìm hiểu thêm về
${fillOrPlaceholder(ctx.follow_up_detail, 'ĐIỀN THỦ CÔNG: chi tiết cụ thể về công ty, nhận thấy từ sau thư đầu tiên')}
và thấy có thể thử nghiệm tiếp cận trên nhóm ${fillOrPlaceholder(ctx.target_segment, 'ĐIỀN THỦ CÔNG: đối tượng mục tiêu')}.
Nếu hiện tại chưa phải thời điểm triển khai, tôi vẫn có thể gửi cấu trúc bài thử nghiệm.

${ctx.sender.sender_name}`,
    }),

    follow_up_2: (ctx) => ({
      subject: `Khép lại chủ đề này — ${ctx.company.name}`,
      body: `Kính gửi anh/chị,

Đây là thư cuối cùng của tôi về chủ đề này — không muốn làm phiền nếu hiện tại chưa phải lúc
phù hợp. Nếu sau này cần một kênh thu hút khách hàng/đối tác bài bản hơn, tôi rất vui được hỗ
trợ, anh/chị cứ nhắn cho tôi.

${ctx.sender.sender_name}
${ctx.sender.calendly_or_contact}`,
    }),

    reply: (ctx) => ({
      subject: `Re: ${ctx.company.name}`,
      body: `Kính gửi anh/chị,

Cảm ơn anh/chị đã phản hồi! [ĐIỀN THỦ CÔNG: trả lời câu hỏi/ý kiến cụ thể trong thư của họ — phần
này không thể soạn sẵn trung thực được, cần trả lời thủ công theo nội dung].

${ctx.sender.sender_name}`,
    }),

    proposal: (ctx) => ({
      subject: `Đề xuất cho ${ctx.company.name}`,
      body: `Kính gửi anh/chị,

Dựa trên cuộc trao đổi vừa rồi, tôi đề xuất trong 30 ngày xây dựng một hệ thống thu hút khách
hàng/đối tác có kiểm soát cho anh/chị: xác định phân khúc, chuẩn bị danh sách liên hệ
(${ctx.company.website} và các đối tượng tương tự), cá nhân hóa thông điệp, chuỗi tiếp cận, CRM
và báo cáo hàng tuần. Bắt đầu bằng giai đoạn thử nghiệm (pilot) để xem phân khúc và thông điệp
nào có phản hồi tốt nhất.

[ĐIỀN THỦ CÔNG: khối lượng công việc, thời hạn, chi phí — phụ thuộc vào cuộc trao đổi, không
soạn sẵn được].

${ctx.sender.sender_name}
${ctx.sender.calendly_or_contact}`,
    }),
  },
};
