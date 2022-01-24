import { SnapAttributes } from './types'

export function snapUrl(snap: Pick<SnapAttributes, 'id'>) {
  const params = new URLSearchParams({ id: snap.id })
  const target = new URL(process.env.GATSBY_GOVERNANCE_API || '')
  target.pathname = `/snap/`
  target.search = '?' + params.toString()
  return target.toString()
}
