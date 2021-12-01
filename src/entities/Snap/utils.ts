import { SnapAttributes } from './types'

export function snapUrl(snap: Pick<SnapAttributes, 'id'>) {
  const params = new URLSearchParams({ id: snap.id })
  const target = new URL(process.env.GATSBY_GOVERNANCE_API || '')
  target.pathname = `/snap/`
  target.search = '?' + params.toString()
  return target.toString()
}

export function snapshotUrl(hash: string) {
  const target = new URL(process.env.GATSBY_SNAPSHOT_URL || '')
  target.pathname = ''
  target.hash = hash
  return target.toString()
}

export function snapshotSnapUrl(snap: Pick<SnapAttributes, 'snapshot_id' | 'snapshot_space'>) {
  return snapshotUrl(`#/${snap.snapshot_space}/snap/${snap.snapshot_id}`)
}
