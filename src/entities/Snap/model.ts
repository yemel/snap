import { Model } from 'decentraland-gatsby/dist/entities/Database/model'
import { conditional, SQL, table, limit, offset, join } from 'decentraland-gatsby/dist/entities/Database/utils'
import { SnapAttributes, SnapStatus, SnapCategory, isSnapStatus } from './types'
import isEthereumAddress from 'validator/lib/isEthereumAddress'
import isUUID from 'validator/lib/isUUID'
import SubscriptionModel from '../Subscription/model'

export type FilterSnapList = {
  quest_id: string,
  user: string,
  status: SnapStatus
}

export type FilterPagination = {
  limit: number,
  offset: number
}

export default class SnapModel extends Model<SnapAttributes> {
  static tableName = 'snaps'
  static withTimestamps = false
  static primaryKey = 'id'

  static parse(snap: SnapAttributes): SnapAttributes {
    return {
      ...snap,
      configuration: JSON.parse(snap.configuration)
    }
  }

  static async getSnapsTotal(filter: Partial<FilterSnapList> = {}) {

    if (filter.status && !isSnapStatus(filter.status)) {
      return 0
    }

    const result = await this.query(SQL`
      SELECT COUNT(*) as "total"
      FROM ${table(SnapModel)} p
      WHERE 1=1
      ${conditional(!!filter.quest_id, SQL`AND p."quest_id" = ${filter.quest_id}`)}
      ${conditional(!!filter.status, SQL`AND p."status" = ${filter.status}`)}
    `)

    return result && result[0] && Number(result[0].total) || 0
  }

  static async getSnapsList(filter: Partial<FilterSnapList & FilterPagination> = {}) {

    if (filter.status && !isSnapStatus(filter.status)) {
      return 0
    }

    const snaps = await this.query(SQL`
      SELECT p.*
      FROM ${table(SnapModel)} p
      WHERE 1=1
      ${conditional(!!filter.quest_id, SQL`AND p."quest_id" = ${filter.quest_id}`)}
      ${conditional(!!filter.status, SQL`AND "status" = ${filter.status}`)}
      ORDER BY "taken_at" DESC
      ${limit(filter.limit, { min: 0, max: 100, defaultValue: 100 })}
      ${offset(filter.offset)}
    `)

    console.log(snaps.map(this.parse))
    return snaps.map(this.parse)
  }
  
}