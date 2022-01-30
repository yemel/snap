import { Request } from 'express'
import { v1 as uuid } from 'uuid'
import { AlchemyProvider, Block } from '@ethersproject/providers'
import routes from "decentraland-gatsby/dist/entities/Route/routes";
import { auth, WithAuth } from "decentraland-gatsby/dist/entities/Auth/middleware";
import handleAPI, { handleJSON } from 'decentraland-gatsby/dist/entities/Route/handle';
import validate from 'decentraland-gatsby/dist/entities/Route/validate';
import schema from 'decentraland-gatsby/dist/entities/Schema'
import { Discourse, DiscoursePost } from '../../api/Discourse';
import { DISCOURSE_AUTH, DISCOURSE_CATEGORY } from '../Discourse/utils';
import Time from 'decentraland-gatsby/dist/utils/date/Time';
import SnapModel from './model';
import QuestModel from '../Quest/model';
import {
  QuestAttributes
} from '../Quest/types';
import {
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
  if (!quest) {
    throw new RequestError(`Quest not found: "${quest_id}"`, RequestError.NotFound)
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
    status: SnapStatus.Active,
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
