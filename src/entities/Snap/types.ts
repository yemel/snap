
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
  image_id: string
}

export enum SnapStatus {
  Pending = 'pending',
  Curated = 'curated',
  Rejected = 'rejected',
}

export enum SnapCategory {
  IgPhoto = 'ig_photo',
  IgVideo = 'ig_video'
}

export function isSnapStatus(value:  string | null | undefined): boolean {
  switch (value) {
    case SnapStatus.Pending:
    case SnapStatus.Curated:
    case SnapStatus.Rejected:
      return true
    default:
      return false
  }
}


export type NewSnap = {
  category: SnapCategory
  title: string
  description: string
  taken_at: string
  x: number
  y: number
  quest_id: string
  image_id: string
}