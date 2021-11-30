
export type QuestAttributes<C extends {} = any> = {
  id: string
  category: QuestCategory
  status: QuestStatus
  title: string
  description: string
  configuration: C
  start_at: Date
  finish_at: Date
}

export enum QuestStatus {
  New = 'new',
  Active = 'active',
  Finished = 'finished'
}

export enum QuestCategory {
  Event = 'event',
  PointOfInterest = 'point_of_interest'
}

export type NewQuest = {
  category: QuestCategory
  title: string
  description: string
  taken_at: string
  x: number
  y: number
}

export function isQuestCategory(value:  string | null | undefined): boolean {
  switch (value) {
    case QuestCategory.PointOfInterest:
    case QuestCategory.Event:
      return true
    default:
      return false
  }
}

export function isQuestStatus(value:  string | null | undefined): boolean {
  switch (value) {
    case QuestStatus.New:
    case QuestStatus.Finished:
    case QuestStatus.Active:
      return true
    default:
      return false
  }
}