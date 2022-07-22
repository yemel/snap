import useAsyncMemo from "decentraland-gatsby/dist/hooks/useAsyncMemo"
import { GetQuestsFilter, Governance } from "../api/Governance"
import { MAX_QUEST_LIMIT } from "../entities/Quest/utils"

export type UseQuestsFilter = Omit<GetQuestsFilter, 'limit' | 'offset'> & {
  page: number
  itemsPerPage: number
  load: boolean
  userSubmitted: string | null
}

export default function useQuests(filter: Partial<UseQuestsFilter> = {}) {
  return useAsyncMemo(
    async () => {
      if (filter.load === false) {
        return {
          ok: true,
          total: 0,
          data: []
        }
      }
      const limit = filter.itemsPerPage ?? MAX_QUEST_LIMIT
      const offset = ((filter.page ?? 1) - 1) * limit
      const params: Partial<GetQuestsFilter> = { limit, offset }
      if(filter.status) { params.status = filter.status }
      if(filter.category) { params.category = filter.category }
      if(filter.userSubmitted) { params.snapsSubmitted = filter.userSubmitted }

      console.log("Filters: ", params)
      return Governance.get().getQuests({ ...params, limit, offset })
    },
    [
      filter.userSubmitted,
      filter.status,
      filter.category,
      filter.page,
      filter.itemsPerPage,
      filter.load,
    ]
  )
}