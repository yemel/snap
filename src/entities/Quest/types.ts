import { AnyCnameRecord } from "dns"

export type QuestAttributes<C extends {} = any> = {
  id: string
  category: QuestCategory
  status: QuestStatus
  configuration: C
  start_at: Date
  updated_at: Date
  finish_at: Date
}

export enum QuestStatus {
  Pending = 'pending',
  Active = 'active',
  Finished = 'finished'
}

export enum QuestCategory {
  Event = 'event',
  PointOfInterest = 'point_of_interest',
  Other = 'other'
}

export type NewQuest = {
  category: QuestCategory
  configuration: any
  start_at: Date
  finish_at: Date
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

export function toQuestStatus(value: string | null | undefined): QuestStatus | null {
  return isQuestStatus(value)?
    value as QuestStatus :
    null
}


export function toQuestCategory(value: string | null | undefined): QuestCategory | null {
  return isQuestCategory(value)?
    value as QuestCategory :
    null
}