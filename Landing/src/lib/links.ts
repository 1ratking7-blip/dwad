const BASE_REF_URL = 'https://bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo&p=/login/regist';

/** Единая реферальная ссылка на BC.Game, используется во всех CTA по сайту. */
export const REF_LINK = BASE_REF_URL;

/** Реферальная ссылка с меткой subId3 для атрибуции конкретного блока/механики в аналитике. */
export function refLinkWithSubId(subId: string): string {
  return `${BASE_REF_URL}&subId3=${subId}`;
}
