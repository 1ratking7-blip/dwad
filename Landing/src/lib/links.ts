const BASE_REF_URL = 'https://bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo&p=/login/regist';

/** Единая реферальная ссылка на BC.Game, используется во всех CTA по сайту. */
export const REF_LINK = BASE_REF_URL;

/** Реферальная ссылка с меткой subId3 для атрибуции конкретного блока/механики в аналитике. */
export function refLinkWithSubId(subId: string): string {
  return `${BASE_REF_URL}&subId3=${subId}`;
}

/**
 * Ссылка с меткой subId2=lang-<locale> + subId3=<location>, размечено ДО
 * публикации мультиязычных страниц (2026-07-20), а не задним числом, по
 * правилу Finance/SYSTEM.md: клик без subId-метки безвозвратно теряет
 * атрибуцию. subId2 позволяет сравнить конверсию по языковым версиям
 * (ru/en/vi); subId3 даёт каждому CTA на сайте свой тег на стороне BC.Game —
 * не только в наших GA/Yandex-событиях (trackEvent видит клики, но не то,
 * какой блок реально принёс регистрацию/депозит в партнёрской панели). До
 * этой функции все ссылки Footer (8 штук) и все карточки Games использовали
 * один и тот же refLinkForLocale(), то есть со стороны BC.Game были
 * неразличимы — реальная атрибуция дохода по блокам была невозможна.
 * `location` должен совпадать с соответствующим trackEvent `location`/`label`,
 * чтобы оба источника данных совпадали.
 */
export function refLinkForLocation(locale: string, location: string): string {
  return `${BASE_REF_URL}&subId2=lang-${locale}&subId3=${location}`;
}
