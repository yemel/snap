
import React, { useState, useMemo, useEffect } from "react"
import { useLocation } from '@reach/router'
import { Personal } from 'web3x/personal'
import { Address } from 'web3x/address'
import useAsyncTask from 'decentraland-gatsby/dist/hooks/useAsyncTask'
import useAsyncMemo from 'decentraland-gatsby/dist/hooks/useAsyncMemo'
import usePatchState from 'decentraland-gatsby/dist/hooks/usePatchState'
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid/Grid"
import { Header } from "decentraland-ui/dist/components/Header/Header"
import { Loader } from "decentraland-ui/dist/components/Loader/Loader"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import Paragraph from "decentraland-gatsby/dist/components/Text/Paragraph"
import { navigate } from "gatsby-plugin-intl"
import { Governance } from "../api/Governance"
import useQuest from "../hooks/useQuest"
import { Link } from "gatsby"
import { Card } from "decentraland-ui/dist/components/Card/Card"

 import ContentLayout, { ContentSection } from "../components/Layout/ContentLayout"
 import CategoryLabel from "../components/Quest/QuestCategoryLabel"
 import StatusLabel from "../components/Quest/QuestStatusLabel"
 import ForumButton from "../components/Section/ForumButton"
 import SubscribeButton from "../components/Section/SubscribeButton"
 import ProposalResultSection from "../components/Section/ProposalResultSection"
 import ProposalDetailSection from "../components/Section/ProposalDetailSection"
import useAuthContext from "decentraland-gatsby/dist/context/Auth/useAuthContext"
 import { forumUrl } from "../entities/Proposal/utils"
 import { Snapshot } from "../api/Snapshot"
import Land from 'decentraland-gatsby/dist/utils/api/Land'
import Markdown from "decentraland-gatsby/dist/components/Text/Markdown"
 import { VoteRegisteredModal } from "../components/Modal/VoteRegisteredModal"
 import { DeleteProposalModal } from "../components/Modal/DeleteProposalModal"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import retry from "decentraland-gatsby/dist/utils/promise/retry"
import locations from "../modules/locations"
import loader from "../modules/loader"
 import { UpdateProposalStatusModal } from "../components/Modal/UpdateProposalStatusModal"
import { QuestCategory, QuestStatus } from "../entities/Quest/types"
 import ProposalHeaderPoi from "../components/Proposal/ProposalHeaderPoi"
import Head from "decentraland-gatsby/dist/components/Head/Head"
import { formatDescription } from "decentraland-gatsby/dist/components/Head/utils"

import './quests.css'
import './quest.css'
import NotFound from "decentraland-gatsby/dist/components/Layout/NotFound"
 import ProposalFooterPoi from "../components/Proposal/ProposalFooterPoi"
import { EscalatorWarningTwoTone } from "@mui/icons-material"
import { SnapStatus } from "../entities/Snap/types"
import SnapCard from "../components/Snap/snapCard"

type ProposalPageOptions = {
  changing: boolean
  confirmDeletion: boolean
}

export default function SnapsPage() {
  const l = useFormatMessage()
  const location = useLocation()
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const [options, patchOptions] = usePatchState<ProposalPageOptions>({ changing: false, confirmDeletion: false })
  const [quest, questState] = useQuest(params.get('quest_id'))
  const [questTitle, setQuestTitle] = useState<string>('')
  const [questDescription, setQuestDescription] = useState<string>('')
  const [eventQuestData, setEventQuestData] = useState<any>()
  const [POITile, setPOITile] = useState<any>()
  const [ account, accountState ] = useAuthContext()
  const [snaps] = useAsyncMemo(async () => {
    if(quest) { 
      if(isCommittee) {
        return Governance.get().getSnaps({ quest_id: quest.id }) 
      } else {
        return Governance.get().getCuratedSnaps({ quest_id: quest.id }) 
      }
        
    } 
    else return null
  }, [quest])
  const [committee] = useAsyncMemo(() => Governance.get().getCommittee(), [])
  const isCommittee = useMemo(
    () => !!(quest && account && committee && committee.includes(account)),
    [quest, account, committee]
  )

  useEffect(() => {
    async function fetchEvent(event_id: string) {
      let event = await fetch('https://events.decentraland.org/api/events/' + event_id).then(res => res.json())
      if( event.ok ) {
        setEventQuestData(event.data)
        setQuestTitle(event.data.name)
      }
    }

    async function fetchPOITile(x: number, y:number) {
      let tile = await Land.get().getTile([x, y])
      if( tile ){
        setPOITile(tile)
        setQuestTitle(tile.name || '')
      }
    }

    if( quest ) {
      if( quest.category == QuestCategory.Event ) {
        fetchEvent(quest.configuration.event_id)
      } else if ( quest.category == QuestCategory.PointOfInterest ) {
        fetchPOITile(Number(quest.configuration.poi_location_x), Number(quest.configuration.poi_location_y))
      } else {
        setQuestTitle(quest.configuration.title)
      }
    }
    
  }, [quest])

  if (questState.error) {
    return <>
      <ContentLayout className="QuestDetailPage">
        <NotFound />
      </ContentLayout>
    </>
  }

  return <>
    <Head
      title={ questTitle || l('page.proposal_detail.title') || ''}
      description={(questDescription && formatDescription(questDescription)) || l('page.proposal_detail.description') || ''}
      image="https://decentraland.org/images/decentraland.png"
    />
    <ContentLayout className="QuestDetailPage">
      <ContentSection>
        <Header size="huge">{ isCommittee ? 'Select the winner Snaps' : 'Winning Snaps'}  &nbsp;</Header>
        <Loader active={!quest} />
        <div style={{ minHeight: '24px' }}>
          {quest && <StatusLabel status={quest.status} />}
          {quest && <CategoryLabel type={quest.category} />}
        </div>
      </ContentSection>
      <ContentSection>
        {snaps && snaps.ok && snaps.total > 0 &&
            <Card.Group>
                {snaps.data.map((snap) => (
                    <SnapCard
                        snap={snap}
                        committee={isCommittee}
                    />
                ))}
            </Card.Group>
        }
        { snaps && snaps.ok && snaps.total == 0 &&
          <Paragraph> No snaps to show yet! </Paragraph>
        }
      </ContentSection>
      
    </ContentLayout>
  </>
}
