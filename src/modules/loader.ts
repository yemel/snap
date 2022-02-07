import Loader from "decentraland-gatsby/dist/utils/loader/Loader"
import { Governance } from "../api/Governance"
import { QuestAttributes } from "../entities/Quest/types"

const quests = new Loader<QuestAttributes | null>((questId) => {
  return Governance.get().getQuest(String(questId))
})

export async function cacheQuests(loader: Promise<QuestAttributes[]>) {
  const list = await loader
  for (const quest of list) {
    quests.set(quest.id, quest)
  }

  return list
}

export default  { quests }