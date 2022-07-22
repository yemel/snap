import JobContext from "decentraland-gatsby/dist/entities/Job/context";
import QuestModel from "./model";
import { QuestAttributes, QuestStatus } from "./types";

export async function activateQuests(context: JobContext) {
  const activatedQuests = await QuestModel.activateQuests()
  context.log(activatedQuests === 0 ? `No activated Quests` : `Activated ${activatedQuests} quests...`)
}

export async function finishQuests(context: JobContext) {
    const finishedQuests = await QuestModel.finishQuests()
    context.log(finishedQuests === 0 ? `No finished Quests` : `finished ${finishedQuests} quests...`)
}
