import { Model } from 'decentraland-gatsby/dist/entities/Database/model'
import { conditional, SQL, table, limit, offset, join } from 'decentraland-gatsby/dist/entities/Database/utils'
import { SnapAttributes, SnapStatus, SnapCategory } from './types'
import isEthereumAddress from 'validator/lib/isEthereumAddress'
import isUUID from 'validator/lib/isUUID'
import SubscriptionModel from '../Subscription/model'

export type FilterProposalList = {
  type: string,
  user: string,
  status: string,
  subscribed: string,
}

export type FilterPaginatation = {
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
  
}