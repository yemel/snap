import { Request } from 'express'
import routes from "decentraland-gatsby/dist/entities/Route/routes";
import { auth, WithAuth } from "decentraland-gatsby/dist/entities/Auth/middleware";
import handleAPI, { handleJSON } from 'decentraland-gatsby/dist/entities/Route/handle';
import { v1 as uuid } from 'uuid'
import {
  QuestAttributes,
  QuestStatus
} from './types';
import RequestError from 'decentraland-gatsby/dist/entities/Route/error';
import {
  questUrl,
  MIN_QUEST_OFFSET,
  MIN_QUEST_LIMIT,
  MAX_QUEST_LIMIT
} from './utils';
import isUUID from 'validator/lib/isUUID';
import QuestModel from './model';

export default routes((route) => {
  const withAuth = auth()
  const withOptionalAuth = auth({ optional: true })
  route.get("/quests", withOptionalAuth, handleJSON(getQuests))
  route.get("/quests/:quest", handleAPI(getQuest))
  route.post("/quests", withAuth, handleAPI(createQuest))
})

function formatError(err: Error) {
  return process.env.NODE_ENV !== 'production' ? err : {
    ...err,
    message: err.message,
    stack: err.stack,
  };
}

function inBackground(fun: () => Promise<any>) {
  Promise.resolve()
    .then(fun)
    .then((result) => console.log('Completed background task: ', JSON.stringify(result)))
    .catch((err) => console.log('Error running background task: ', formatError(err)))
}

export async function getQuests(req: WithAuth<Request>) {
  const category = req.query.category && String(req.query.category)
  const status = req.query.status && String(req.query.status)

  let offset =
    req.query.offset && Number.isFinite(Number(req.query.offset))
      ? Number(req.query.offset)
      : MIN_QUEST_OFFSET

  let limit =
    req.query.limit && Number.isFinite(Number(req.query.limit))
      ? Number(req.query.limit)
      : MAX_QUEST_LIMIT

  console.log("about to query quests...")
  const [total, data] = await Promise.all([
    QuestModel.getQuestsTotal({ category, status }),
    QuestModel.getQuestsList({
      category,
      status,
      offset, 
      limit,
    }),
  ])

  return { ok: true, total, data }
}


export async function getQuest(req: Request<{ quest: string }>) {

  const id = req.params.quest

  if (!isUUID(id || "")) {
    throw new RequestError(`Quest not found: "${id}"`, RequestError.NotFound)
  }

  const quest = await QuestModel.findOne<QuestAttributes>({
    id
  })
  if (!quest) {
    throw new RequestError(`Quest not found: "${id}"`, RequestError.NotFound)
  }

  return QuestModel.parse(quest)
}


export async function createQuest(req: WithAuth) {
  const user = req.auth!
  const configuration = req.body
  
  const id = uuid()
  const start_at = new Date(configuration.start_at)
  const finish_at = new Date(configuration.finish_at)

  const image_id = configuration.image_id
  if(!isUUID(image_id)) {
    throw new RequestError(`Invalid image id."`, RequestError.NotFound)
  }

  //
  // Create quest in DB
  //
  const newQuest: QuestAttributes = {
    id,
    category: configuration.category,
    status: QuestStatus.Pending,
    title: configuration.title,
    description: configuration.description,
    configuration: JSON.stringify({
      location: configuration.location
    }),
    start_at: start_at,
    updated_at: start_at,
    finish_at: finish_at,
    image_id: configuration.image_id
  }

  try {
    await QuestModel.create(newQuest)
  } catch (err) {
    throw err
  }

  console.log("New Quest is: ", QuestModel.parse(newQuest))

  return QuestModel.parse(newQuest)

}