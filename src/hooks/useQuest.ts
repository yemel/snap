import useAsyncMemo from "decentraland-gatsby/dist/hooks/useAsyncMemo"
import { Governance } from "../api/Governance"

export default function useProposal(questId?: string | null) {
  return useAsyncMemo(() => Governance.get().getQuest(questId!), [questId], { callWithTruthyDeps: true })
}