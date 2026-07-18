// Canned answers for !faq <topic> — same factual content as Landing/blog articles, kept
// short for chat. Update both places if the underlying facts change (bonus terms, thresholds).
const REF_LINK = 'https://bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo&p=/login/regist&subId1=discord&subId2=own_server_faq';

const TOPICS = {
  fair: {
    aliases: ['fair', 'provablyfair', 'provably-fair'],
    answer:
      'Provably Fair: до раунда платформа показывает хэш серверного сида (нельзя подделать после ставки). ' +
      'После раунда сид раскрывается, и любой может пересчитать хэш и проверить совпадение — значит, результат ' +
      'не подменили постфактум. Это НЕ доказывает "хороший house edge" — только то, что раунд не подделан. ' +
      'Подробнее: https://www.zhelezo.space/blog/provably-fair-explained/',
  },
  kyc: {
    aliases: ['kyc', 'verification', 'верификация'],
    answer:
      '"Без KYC" значит: идентификация не нужна ниже определённого порога вывода, не то что её нет вообще. ' +
      'Выше порога верификация потребуется — это стандартная AML-практика, не особенность конкретной платформы. ' +
      'Подробнее: https://www.zhelezo.space/blog/no-kyc-crypto-casino/',
  },
  withdraw: {
    aliases: ['withdraw', 'вывод', 'вывод-средств'],
    answer:
      'Вывод на BC.Game — в той же крипте, что депонировали, обычно быстро ниже порога KYC. Выше порога — ' +
      'проверка личности, как у любой лицензированной платформы. Актуальные лимиты уточняйте в правилах ' +
      'платформы — они периодически меняются.',
  },
  bonus: {
    aliases: ['bonus', 'бонус', 'promo', 'промокод'],
    answer:
      `Отдельного текстового промокода нет — бонус до 360% (на первые 4 депозита) активируется через ` +
      `реферальную ссылку: ${REF_LINK}`,
  },
};

const TOPIC_LOOKUP = new Map();
for (const [key, topic] of Object.entries(TOPICS)) {
  for (const alias of topic.aliases) TOPIC_LOOKUP.set(alias, key);
}

function findAnswer(query) {
  if (!query) return null;
  const key = TOPIC_LOOKUP.get(query.trim().toLowerCase());
  return key ? TOPICS[key].answer : null;
}

function listTopics() {
  return Object.keys(TOPICS).join(', ');
}

module.exports = { findAnswer, listTopics };
