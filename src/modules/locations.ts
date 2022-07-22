import { QuestCategory, QuestStatus } from "../entities/Quest/types";
import API from 'decentraland-gatsby/dist/utils/api/API'

const GATSBY_BASE_URL = process.env.GATSBY_BASE_URL || '/'
export const WELCOME_STORE_KEY: string = 'org.decentraland.governance.welcome'
export const WELCOME_STORE_VERSION: string = '1'

export function toQuestListPage(value: string | number | null | undefined): number {
  if (typeof value === 'number') {
    return Math.max(1, value)
  } else if (typeof value === 'string') {
    const page = Number(value)
    return Number.isFinite(page) ? Math.max(1, page) : 1
  } else {
    return 1
  }
}

export enum QuestListView {
  Active = 'active'
}

export function toQuestListView(list: string | null | undefined): QuestListView | null {
  switch(list) {
    case QuestListView.Active:
      return list
    default:
      return null
  }
}

export type QuestListPage = {
  page: string
}

export type QuestListViewFilter = {
  view: QuestListView
}

export type QuestsStatusFilter = {
  status: QuestStatus
}

export type QuestsCategoryFilter = {
  type: QuestCategory,
}

export enum QuestActivityList {
  MySnaps = 'snaps',
  Watchlist = 'watchlist',
}

export function toQuestActivityList(list: string | null | undefined): QuestActivityList | null {
  switch(list) {
    case QuestActivityList.MySnaps:
    case QuestActivityList.Watchlist:
      return list
    default:
      return null
  }
}

export type QuestActivityFilter = {
  list: QuestActivityList,
}

export type QuestsModal = {
  modal: 'new'
}

export function url(path: string = '/', query: Record<string, string> | URLSearchParams = {}) {
  return API.url(GATSBY_BASE_URL, path, query)
}

export default {
  quests: (options: Partial<QuestListPage & QuestListViewFilter & QuestsStatusFilter & QuestsCategoryFilter & QuestsModal> | URLSearchParams = {}) => url('/quests', options),
  quest: (quest: string) => url(`/quest/`, { id: quest }),
  activity: (options: Partial<QuestsStatusFilter & QuestActivityFilter> | URLSearchParams = {}) => url(`/activity/`, options),
  createQuest: (type?: QuestCategory) => url(type ? `/createQuest/${String(type).replace(/_/g,'-')}/` : '/createQuest/', {}),
  submitSnap: (quest_id: string) => url(`/submitSnap/`, { quest_id: quest_id }),
  balance: (options: Partial<{ address: string }> = {}) => url(`/balance/`, options),
  welcome: () => url(`/welcome/`, {}),
}