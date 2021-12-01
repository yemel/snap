import { Model } from 'decentraland-gatsby/dist/entities/Database/model'
import { conditional, SQL, table, limit, offset, join } from 'decentraland-gatsby/dist/entities/Database/utils'
import { QuestAttributes, QuestStatus, QuestCategory, isQuestCategory, isQuestStatus } from './types'
import isEthereumAddress from 'validator/lib/isEthereumAddress'
import isUUID from 'validator/lib/isUUID'
import SubscriptionModel from '../Subscription/model'

export type FilterQuestList = {
  category: string,
  status: string
}

export type FilterPagination = {
  limit: number,
  offset: number
}


export default class QuestModel extends Model<QuestAttributes> {
  static tableName = 'quests'
  static withTimestamps = false
  static primaryKey = 'id'

  static parse(quest: QuestAttributes): QuestAttributes {
    return {
      ...quest,
      configuration: JSON.parse(quest.configuration)
    }
  }
  
  static async getQuestsTotal(filter: Partial<FilterQuestList> = {}) {
    if (filter.category && !isQuestCategory(filter.category)) {
      return 0
    }

    if (filter.status && !isQuestStatus(filter.status)) {
      return 0
    }

    const result = await this.query(SQL`
      SELECT COUNT(*) as "total"
      FROM ${table(QuestModel)} p
      ${conditional(!!filter.category, SQL`AND p."category" = ${filter.category}`)}
      ${conditional(!!filter.status, SQL`AND p."status" = ${filter.status}`)}
    `)

    return result && result[0] && Number(result[0].total) || 0
  }

  static async getQuestsList(filter: Partial<FilterQuestList & FilterPagination> = {}) {

    if (filter.category && !isQuestCategory(filter.category)) {
      return []
    }

    if (filter.status && !isQuestStatus(filter.status)) {
      return []
    }

    const quests = await this.query(SQL`
      SELECT p.*
      FROM ${table(QuestModel)} p
      ${conditional(!!filter.category, SQL`AND "category" = ${filter.category}`)}
      ${conditional(!!filter.status, SQL`AND "status" = ${filter.status}`)}
      ORDER BY "created_at" DESC
      ${limit(filter.limit, { min: 0, max: 100, defaultValue: 100 })}
      ${offset(filter.offset)}
    `)

    return quests.map(this.parse)
  }
}
