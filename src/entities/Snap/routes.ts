import { Request } from 'express'
import { v1 as uuid } from 'uuid'
import { AlchemyProvider, Block } from '@ethersproject/providers'
import routes from "decentraland-gatsby/dist/entities/Route/routes";
import { auth, WithAuth } from "decentraland-gatsby/dist/entities/Auth/middleware";
import handleAPI, { handleJSON } from 'decentraland-gatsby/dist/entities/Route/handle';
import validate from 'decentraland-gatsby/dist/entities/Route/validate';
import schema from 'decentraland-gatsby/dist/entities/Schema'
import { Discourse, DiscoursePost } from '../../api/Discourse';
import isCommitee from "../Committee/isCommittee"
import { DISCOURSE_AUTH, DISCOURSE_CATEGORY } from '../Discourse/utils';
import Time from 'decentraland-gatsby/dist/utils/date/Time';
import SnapModel from './model';
import QuestModel from '../Quest/model';
import {
  QuestAttributes, QuestStatus
} from '../Quest/types';
import {
  isSnapStatus,
  SnapAttributes,
  SnapStatus
} from './types';
import RequestError from 'decentraland-gatsby/dist/entities/Route/error';
import {
  snapUrl
} from './utils';
import { IPFS, HashContent } from '../../api/IPFS';
import isUUID from 'validator/lib/isUUID';
import VotesModel from '../Votes/model'
import Catalyst, { Avatar } from 'decentraland-gatsby/dist/utils/api/Catalyst';

export default routes((route) => {
  const withAuth = auth()
  const withOptionalAuth = auth({ optional: true })
  route.post(`/snap`, withAuth, handleAPI(createSnap))
  route.get(`/snap`, withAuth, handleJSON(getSnaps))
  route.get(`/snap/curated`, withOptionalAuth, handleJSON(getCuratedSnaps))
  route.patch("/snap/:snap", withAuth, handleAPI(updateSnapStatus))
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


export async function createSnap(req: WithAuth) {
  const user = req.auth!
  const configuration = req.body
  const taken_at = new Date(configuration.taken_at)

  const id = uuid()
  const start = Time.utc().set('seconds', 0)
  const snap_url = snapUrl({ id })

  let profile: Avatar | null
  try {
    profile = await Catalyst.get().getProfile(user)
  } catch (err) {
    throw new RequestError(`Error getting profile "${user}"`, RequestError.InternalServerError, err)
  }
  
  const quest_id = configuration.quest_id
  const quest = await QuestModel.findOne<QuestAttributes>(quest_id)
  if (!quest || quest.status !== QuestStatus.Active ) {
    throw new RequestError(`Quest not found or not active: "${quest_id}"`, RequestError.NotFound)
  }

  const has_user_submitted = await SnapModel.hasUserSubmittedSnap({user, quest_id: quest_id})
  if (has_user_submitted ) {
    throw new RequestError(`User has already submitted a snap for this quest!`, RequestError.Forbidden)
  }

  const image_id = configuration.image_id
  if(!isUUID(image_id)) {
    throw new RequestError(`Invalid image id."`, RequestError.NotFound)
  }

  //
  // Create snap in DB
  //
  const newSnap: SnapAttributes = {
    id,
    user,
    taken_at,
    category: configuration.category,
    status: SnapStatus.Pending,
    title: configuration.title,
    description: configuration.description,
    configuration: JSON.stringify({}),
    taken_location_x: configuration.x,
    taken_location_y: configuration.y,
    image_id: configuration.image_id,
    quest_id
  }

  try {
    await SnapModel.create(newSnap)
    await VotesModel.createEmpty(id)
  } catch (err) {
    throw err
  }

  console.log("New Snap is: ", SnapModel.parse(newSnap))

  return SnapModel.parse(newSnap)

}

export async function getSnaps(req: WithAuth<Request>) {
  const user = req.auth!
  if (!isCommitee(user)) {
    throw new RequestError(
      `Only committe members can see snaps`,
      RequestError.Forbidden
    )
  }

  const quest_id = req.query.quest_id && String(req.query.quest_id)
  const status = req.query.status && String(req.query.status)

  let offset =
    req.query.offset && Number.isFinite(Number(req.query.offset))
      ? Number(req.query.offset)
      :0

  let limit =
    req.query.limit && Number.isFinite(Number(req.query.limit))
      ? Number(req.query.limit)
      : 25
      
  const [total, data] = await Promise.all([
    SnapModel.getSnapsTotal({ quest_id }),
    SnapModel.getSnapsList({
      quest_id,
      offset, 
      limit,
    }),
  ])
  

  return { ok: true, total, data }
}

export async function getCuratedSnaps(req: WithAuth<Request>) {
  const quest_id = req.query.quest_id && String(req.query.quest_id)

  let offset =
    req.query.offset && Number.isFinite(Number(req.query.offset))
      ? Number(req.query.offset)
      :0

  let limit =
    req.query.limit && Number.isFinite(Number(req.query.limit))
      ? Number(req.query.limit)
      : 25
      
  const [total, data] = await Promise.all([
    SnapModel.getSnapsTotal({ quest_id, status: SnapStatus.Curated }),
    SnapModel.getSnapsList({
      quest_id,
      offset, 
      limit,
    }),
  ])
  

  return { ok: true, total, data }
}

export async function getSnap(req: Request<{ snap: string }>) {
  const id = req.params.snap
  if (!isUUID(id || "")) {
    throw new RequestError(`Not found snap: "${id}"`, RequestError.NotFound)
  }

  const snap = await SnapModel.findOne<SnapAttributes>({
    id
  })
  if (!snap) {
    throw new RequestError(`Not found snap: "${id}"`, RequestError.NotFound)
  }

  return SnapModel.parse(snap)
}

export async function updateSnapStatus(
  req: WithAuth<Request<{ snap: string }>>
) {
  const user = req.auth!
  const id = req.params.snap
  if (!isCommitee(user)) {
    throw new RequestError(
      `Only committe members can change snap status`,
      RequestError.Forbidden
    )
  }

  const snap = await getSnap(req)
  const status = req.body.status

  if (!isSnapStatus(status)) {
    throw new RequestError(
      `snap status can't be updated to ${status}`,
      RequestError.BadRequest
    )
  }

  const update: Partial<SnapAttributes> = {
    status: status
  }

  await SnapModel.update<SnapAttributes>(update, { id })

  return {
    ...snap,
    ...update,
  }
}
