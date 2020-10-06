import { Organization, ConnectorTheGraphConfig } from '@aragon/connect'
import { Network } from 'modules/wallet/types'

export const ORGANIZATION_LOCATION = {
  [Network.MAINNET]: 'dcl.eth',
  [Network.RINKEBY]: 'dcl.aragonid.eth'
}

type Connector = ['thegraph', ConnectorTheGraphConfig | undefined]

export const ORGANIZATION_CONNECTOR = {
  [Network.MAINNET]: [ 'thegraph', { orgSubgraphUrl: 'https://api.thegraph.com/subgraphs/name/aragon/aragon-mainnet' } ] as Connector,
  [Network.RINKEBY]: [ 'thegraph', { orgSubgraphUrl: 'https://api.thegraph.com/subgraphs/name/aragon/aragon-rinkeby' } ] as Connector
}

export const ORGANIZATION_OPTIONS = {
  [Network.MAINNET]: { network: Network.MAINNET },
  [Network.RINKEBY]: { network: Network.RINKEBY }
}

export { Organization }
