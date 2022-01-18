
export type SnapAttributes<C extends {} = any> = {
  id: string
  user: string
  category: SnapCategory
  status: SnapStatus
  title: string
  description: string
  configuration: C
  taken_at: Date
  taken_location_x: number
  taken_location_y: number
  quest_id: string
}

export enum SnapStatus {
  Pending = 'pending',
  Active = 'active',
  Finished = 'curated',
  Rejected = 'rejected',
}

export enum SnapCategory {
  IgPhoto = 'ig_photo',
  IgVideo = 'ig_video'
}

export type NewSnap = {
  category: SnapCategory
  title: string
  description: string
  taken_at: string
  x: number
  y: number
  quest_id: string
}