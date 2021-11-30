import { QuestAttributes } from './types'

export const MIN_QUEST_OFFSET = 0
export const MIN_QUEST_LIMIT = 0
export const MAX_QUEST_LIMIT = 100
export const SITEMAP_ITEMS_PER_PAGE = 100

export function questUrl(quest: Pick<QuestAttributes, 'id'>) {
  const params = new URLSearchParams({ id: quest.id })
  const target = new URL(process.env.GATSBY_GOVERNANCE_API || '')
  target.pathname = `/quest/`
  target.search = '?' + params.toString()
  return target.toString()
}

