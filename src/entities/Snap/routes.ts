import { Request } from 'express'
import { v1 as uuid } from 'uuid'
import { AlchemyProvider, Block } from '@ethersproject/providers'
import routes from "decentraland-gatsby/dist/entities/Route/routes";
import { auth, WithAuth } from "decentraland-gatsby/dist/entities/Auth/middleware";
import handleAPI, { handleJSON } from 'decentraland-gatsby/dist/entities/Route/handle';
import validate from 'decentraland-gatsby/dist/entities/Route/validate';
import schema from 'decentraland-gatsby/dist/entities/Schema'
import { SNAPSHOT_SPACE, SNAPSHOT_ACCOUNT, SNAPSHOT_ADDRESS, SNAPSHOT_DURATION, signMessage } from '../Snapshot/utils';
import { Snapshot, SnapshotResult, SnapshotSpace, SnapshotStatus } from '../../api/Snapshot';
import { Discourse, DiscoursePost } from '../../api/Discourse';
import { DISCOURSE_AUTH, DISCOURSE_CATEGORY } from '../Discourse/utils';
import Time from 'decentraland-gatsby/dist/utils/date/Time';
import SnapModel from './model';
import {
  SnapAttributes,
  SnapStatus
} from './types';
import RequestError from 'decentraland-gatsby/dist/entities/Route/error';
import {
  snapshotSnapUrl,
  snapUrl
} from './utils';
import { IPFS, HashContent } from '../../api/IPFS';
import VotesModel from '../Votes/model'
import isCommitee from '../Committee/isCommittee';
import isUUID from 'validator/lib/isUUID';
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

function dropSnapshotSnap(snap_proposal_space: string, snap_proposal_id: string) {
  inBackground(async () => {
    console.log(`Dropping snapshot snap proposal: ${snap_proposal_space}/${snap_proposal_id}`)
    const address = SNAPSHOT_ADDRESS
    const msg = await Snapshot.get().removeSnapProposalMessage(snap_proposal_space, snap_proposal_id)
    const sig = await signMessage(SNAPSHOT_ACCOUNT, msg)
    const result = await Snapshot.get().send(address, msg, sig)
    return {
      msg: JSON.parse(msg),
      sig,
      address,
      result,
    }
  })
}

function dropSnapshotProposal(proposal_space: string, proposal_id: string) {
  inBackground(async () => {
    console.log(`Dropping snapshot proposal: ${proposal_space}/${proposal_id}`)
    const address = SNAPSHOT_ADDRESS
    const msg = await Snapshot.get().removeProposalMessage(proposal_space, proposal_id)
    const sig = await signMessage(SNAPSHOT_ACCOUNT, msg)
    const result = await Snapshot.get().send(address, msg, sig)
    return {
      msg: JSON.parse(msg),
      sig,
      address,
      result,
    }
  })
}

export async function createSnap(req: WithAuth) {
  const user = req.auth!
  const configuration = req.body
  const taken_at = new Date(configuration.taken_at)

  const id = uuid()
  const address = SNAPSHOT_ADDRESS
  const start = Time.utc().set('seconds', 0)
  const end = Time.utc(start).add(SNAPSHOT_DURATION, 'seconds')
  const snap_url = snapUrl({ id })

  let profile: Avatar | null
  try {
    profile = await Catalyst.get().getProfile(user)
  } catch (err) {
    throw new RequestError(`Error getting profile "${user}"`, RequestError.InternalServerError, err)
  }

  let msg: string
  let block: Block
  let snapshotStatus: SnapshotStatus
  let snapshotSpace: SnapshotSpace
  try {
    snapshotStatus = await Snapshot.get().getStatus()
    snapshotSpace = await Snapshot.get().getSpace(SNAPSHOT_SPACE)
  } catch (err) {
    throw new RequestError(`Error getting snapshot space "${SNAPSHOT_SPACE}"`, RequestError.InternalServerError, err)
  }

  try {
    const provider = new AlchemyProvider(Number(snapshotSpace.network), process.env.ALCHEMY_API_KEY)
    block = await provider.getBlock('latest')
  } catch (err) {
    throw new RequestError(`Couldn't get the latest block`, RequestError.InternalServerError, err)
  }

  try {
    msg = await Snapshot.get().createSnapMessage(SNAPSHOT_SPACE,
      snapshotStatus.version, snapshotSpace.network, snapshotSpace.strategies, {
      name: configuration.title,
      body: configuration.description,
      snapshot: block.number,
      choices: [ 'yes', 'no' ],
      end,
      start,
    })
  } catch (err) {
    throw new RequestError(`Error creating the snapshot message`, RequestError.InternalServerError, err)
  }

  //
  // Create Snap in Snapshot
  //
  let snapshotSnap: SnapshotResult
  try {
    const sig = await signMessage(SNAPSHOT_ACCOUNT, msg)
    console.log(sig, msg)
    snapshotSnap = await Snapshot.get().send(address, msg, sig)
  } catch (err) {
    throw new RequestError(`Couldn't create snap proposal in snapshot`, RequestError.InternalServerError, err)
  }

  const snapshot_url = snapshotSnapUrl({ snapshot_space: SNAPSHOT_SPACE, snapshot_id: snapshotSnap.ipfsHash })
  console.log(`Snapshot snap proposal created:`, snapshot_url, JSON.stringify(snapshotSnap))

  //
  // Get snapshot content
  //
  let snapshotContent: HashContent
  try {
    snapshotContent = await IPFS.get().getHash(snapshotSnap.ipfsHash)
  } catch (err) {
    dropSnapshotSnap(SNAPSHOT_SPACE, snapshotSnap.ipfsHash)
    throw new RequestError(`Couldn't retrieve snap proposal from the IPFS`, RequestError.InternalServerError, err)
  }

  //
  // Create snap in DB
  //
  const newSnap: SnapAttributes = {
    id,
    user,
    taken_at,
    snapshot_id: snapshotSnap.ipfsHash,
    snapshot_space: SNAPSHOT_SPACE,
    snapshot_snap_proposal: JSON.stringify(JSON.parse(snapshotContent.msg).payload),
    snapshot_signature: snapshotContent.sig,
    snapshot_network: snapshotSpace.network,
    category: configuration.category,
    status: SnapStatus.Active,
    title: configuration.title,
    description: configuration.description,
    configuration: JSON.stringify({}),
    start_at: start.toJSON() as any,
    finish_at: end.toJSON() as any,
    taken_location_x: configuration.x,
    taken_location_y: configuration.y
  }

  try {
    await SnapModel.create(newSnap)
    await VotesModel.createEmpty(id)
  } catch (err) {
    dropSnapshotSnap(SNAPSHOT_SPACE, snapshotSnap.ipfsHash)
    throw err
  }

  console.log("New Snap is: ", SnapModel.parse(newSnap))

  return SnapModel.parse(newSnap)

}
