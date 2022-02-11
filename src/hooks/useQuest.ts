import useAsyncMemo from "decentraland-gatsby/dist/hooks/useAsyncMemo"
import { Governance } from "../api/Governance"

export default function useQuest(questId?: string | null, snapsSubmitted?: boolean) {
  return useAsyncMemo( () => Governance.get().getQuest(questId!, snapsSubmitted) , [questId, snapsSubmitted])
}