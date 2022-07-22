import React, { useState, useMemo } from "react"
import { Card } from "decentraland-ui/dist/components/Card/Card"
import ImgFixed from "decentraland-gatsby/dist/components/Image/ImgFixed"
import TokenList from "decentraland-gatsby/dist/utils/dom/TokenList"
import profiles from 'decentraland-gatsby/dist/utils/loader/profile'
import { Address } from 'decentraland-ui/dist/components/Address/Address'
import { Button } from "decentraland-ui/dist/components/Button/Button"
import useAsyncMemo from 'decentraland-gatsby/dist/hooks/useAsyncMemo'
import { Link } from 'gatsby-plugin-intl'
import Avatar from 'decentraland-gatsby/dist/components/User/Avatar'
import { Governance } from "../../api/Governance"
import { Blockie } from 'decentraland-ui/dist/components/Blockie/Blockie'

import "./snapCard.css"
import { navigate } from 'gatsby-plugin-intl'
import locations from "../../modules/locations"
import { SnapAttributes, SnapStatus } from "../../entities/Snap/types"
import { SNAPSHOT_ACCOUNT } from "../../entities/Snapshot/utils"
import SnapModel from "../../entities/Snap/model"


export type SnapCardProps = {
  snap?: SnapAttributes,
  committee: boolean,
  loading?: boolean
}

const icons = {
  'position': require('../../images/icons/pin.svg')
}

const getSnapImageSrc = ( image_id: string | undefined) => `https://dcl-snaps.s3.amazonaws.com/${image_id}.jpeg`


export default React.memo(function SnapCard(props: SnapCardProps) {
  const snap = props.snap
  const [statusChangeLoading, SetStatusChangeLoading] = useState<boolean>(false)
  const nextStartAt = useMemo(
    () =>
      new Date(snap ? Date.parse(snap.taken_at.toString()) : Date.now()),
    [snap?.taken_at]
  )
  const [ profile ] = useAsyncMemo(
    async () => snap?.user ? profiles.load(snap.user) : null,
    [ snap?.user ],
    { callWithTruthyDeps: true }
  )

  return (
    <Card
      className={TokenList.join([
        "SnapCard",
        props.loading && "loading",
      ])}
    >
      <div className="SnapCard__Cover">
        {snap && props.committee && <div className="SnapCard_CurrentStatus">
            {snap.status}
        </div>}
        <ImgFixed src={getSnapImageSrc(snap?.image_id) || ""} dimension="wide" />
      </div>
      <Card.Content>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {snap && <Link to={locations.balance({ address: snap?.user || '' })}>
              {profile && profile.name && <Avatar size="mini" address={profile.ethAddress} style={{ marginRight: '.5rem' }} />}
              {profile && profile.name}
              {(!profile || !profile.name) && !!snap?.user &&  <Blockie scale={3} seed={snap?.user || ''}>
                <Address value={snap?.user || ''} />
              </Blockie>}
            </Link>}
          <div>
            <span className="SnapCard_Position">
              <img src={icons.position} width="16" height="16" />
              <span>{`${snap?.taken_location_x},${snap?.taken_location_y}`}</span>
            </span>
          </div>
        </div>

        <Card.Header>{snap?.title || " "}</Card.Header>

        {
           props.committee && 
           <Card.Description>
            <Button
                  primary
                  size="small"
                  disabled={props.loading || snap?.status === SnapStatus.Curated}
                  loading={statusChangeLoading}
                  onClick={async () => {
                    SetStatusChangeLoading(true)
                    Governance.get().updateSnapStatus(snap?.id || '', SnapStatus.Curated).then(
                      res => SetStatusChangeLoading(false)
                    )
                  }}
                  className="fluid"
                  target="_blank"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span>{ snap?.status === SnapStatus.Curated ? 'SELECTED WINNER': 'SELECT WINNER'}</span>
                </Button>
        </Card.Description>
        }
        
      </Card.Content>
    </Card>
  )
})