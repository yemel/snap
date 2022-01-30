import { AnyCnameRecord } from "dns"

export type QuestAttributes<C extends {} = any> = {
  id: string
  category: QuestCategory
  status: QuestStatus
  title: string
  description: string
  configuration: C
  start_at: Date
  updated_at: Date
  finish_at: Date
  image_id: string
}

export enum QuestStatus {
  Pending = 'pending',
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
  configuration: any
  start_at: Date
  finish_at: Date
  image_id: string
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
    case QuestStatus.Pending:
    case QuestStatus.Finished:
    case QuestStatus.Active:
      return true
    default:
      return false
  }
}

export function toQuestCategory(value: string | null | undefined): QuestCategory | null {
  return isQuestCategory(value)?
    value as QuestCategory :
    null
}