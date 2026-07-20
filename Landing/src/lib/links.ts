const BASE_REF_URL = 'https://bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo&p=/login/regist';

/** Единая реферальная ссылка на BC.Game, используется во всех CTA по сайту. */
export const REF_LINK = BASE_REF_URL;

/** Реферальная ссылка с меткой subId3 для атрибуции конкретного блока/механики в аналитике. */
export function refLinkWithSubId(subId: string): string {
  return `${BASE_REF_URL}&subId3=${subId}`;
}

/**
 * Ссылка с меткой subId2=lang-<locale> — размечено ДО публикации мультиязычных
 * страниц (2026-07-20), а не задним числом, по правилу Finance/SYSTEM.md: клик без
 * subId-метки безвозвратно теряет атрибуцию. Позволяет позже сравнить конверсию
 * по языковым версиям (ru/en/vi), когда появятся реальные данные.
 */
export function refLinkForLocale(locale: string): string {
  return `${BASE_REF_URL}&subId2=lang-${locale}`;
}
