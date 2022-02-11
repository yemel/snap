import React, { useState, useMemo, useEffect } from "react"
import { useLocation } from "@reach/router"

// Decentraland Gatsby
import useAsyncTask from "decentraland-gatsby/dist/hooks/useAsyncTask"
import useAsyncMemo from "decentraland-gatsby/dist/hooks/useAsyncMemo"
import usePatchState from "decentraland-gatsby/dist/hooks/usePatchState"
import { Loader } from "decentraland-ui/dist/components/Loader/Loader"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import Paragraph from "decentraland-gatsby/dist/components/Text/Paragraph"
import Link2 from "decentraland-gatsby/dist/components/Text/Link"
import useAuthContext from "decentraland-gatsby/dist/context/Auth/useAuthContext"
import Land from "decentraland-gatsby/dist/utils/api/Land"
import Markdown from "decentraland-gatsby/dist/components/Text/Markdown"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import SubTitle from "decentraland-gatsby/dist/components/Text/SubTitle"
import NotFound from "decentraland-gatsby/dist/components/Layout/NotFound"
import ImgFixed from "decentraland-gatsby/dist/components/Image/ImgFixed"
import Head from "decentraland-gatsby/dist/components/Head/Head"
import { formatDescription } from "decentraland-gatsby/dist/components/Head/utils"
import Catalyst from "decentraland-gatsby/dist/utils/api/Catalyst"

// Decentraland UI
import { Header } from "decentraland-ui/dist/components/Header/Header"

// Gatsby
import { Link } from "gatsby"
import { navigate } from "gatsby-plugin-intl"

// Semantic UI
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid/Grid"

// Components
import ContentLayout, {
  ContentSection,
} from "../components/Layout/ContentLayout"
import CategoryLabel from "../components/Quest/QuestCategoryLabel"
import StatusLabel from "../components/Quest/QuestStatusLabel"

// Modules
import locations from "../modules/locations"

// Entities
import { QuestCategory, QuestStatus } from "../entities/Quest/types"

// CSS
import "./quests.css"
import "./quest.css"

import Pin from "../components/Icon/Pin"
import EventSection from "./EventSection"
import { Governance } from "../api/Governance"
import useQuest from "../hooks/useQuest"
import ProposalHeaderPoi from "../components/Proposal/ProposalHeaderPoi"
import { TimeToLeaveSharp } from "@mui/icons-material"

type ProposalPageOptions = {
  changing: boolean
  confirmDeletion: boolean
}

export default function QuestPage() {
  const l = useFormatMessage()
  const location = useLocation()
  const params = useMemo(() => new URLSearchParams(location.search), [
    location.search,
  ])
  const [options, patchOptions] = usePatchState<ProposalPageOptions>({
    changing: false,
    confirmDeletion: false,
  })
  const [account, { provider }] = useAuthContext()
  const [quest, questState] = useQuest(params.get("id"), account != null)
  const [questTitle, setQuestTitle] = useState<string>("")
  const [questDescription, setQuestDescription] = useState<string>("")
  const [eventQuestData, setEventQuestData] = useState<any>()
  const [POITile, setPOITile] = useState<any>()
  const [committee] = useAsyncMemo(() => Governance.get().getCommittee(), [])
  const [POIimage, setPOIimage] = useState<string>("")

  const [deleting, deleteQuest] = useAsyncTask(async () => {
    if (quest && account && committee && committee.includes(account)) {
      // await Governance.get().deleteQuest(quest.id)
      navigate(locations.quests())
    }
  })

  useEffect(() => {
    async function fetchEvent(event_id: string) {
      let event = await fetch(
        "https://events.decentraland.org/api/events/" + event_id
      ).then((res) => res.json())
      if (event.ok) {
        setEventQuestData(event.data)
        setQuestTitle(event.data.name)
      }
    }

    async function fetchPOIImage(x: number, y: number) {
      const scenes = await Catalyst.get().getEntityScenes([[x, y]])
      const scene = scenes[0]
      if (!scene) {
        return null
      }

      let image = scene?.metadata?.display?.navmapThumbnail || ""
      if (image && !image.startsWith("https://")) {
        const list = scene.content || []
        const content = list.find((content) => content.file === image)
        if (content) {
          image = Catalyst.get().getContentUrl(content.hash)
        }
      }

      if (!image || !image.startsWith("https://")) {
        return null
      }

      return setPOIimage(image)
    }

    async function fetchPOITile(x: number, y: number) {
      let tile = await Land.get().getTile([x, y])
      if (tile) {
        setPOITile(tile)
        setQuestTitle(tile.name || `Parcel ${tile.x},${tile.y}`)
      }
    }

    if (quest) {
      if (quest.category == QuestCategory.Event) {
        fetchEvent(quest.configuration.event_id)
      } else if (quest.category == QuestCategory.PointOfInterest) {
        fetchPOITile(
          Number(quest.configuration.poi_location_x),
          Number(quest.configuration.poi_location_y)
        )
        fetchPOIImage(
          Number(quest.configuration.poi_location_x),
          Number(quest.configuration.poi_location_y)
        )
      } else {
        setQuestTitle(quest.configuration.title)
      }
      setQuestDescription(quest.configuration.description)
    }
  }, [quest])

  const isCommittee = useMemo(
    () => !!(quest && account && committee && committee.includes(account)),
    [quest, account, committee]
  )

  const getFormattedDate = (date: Date) => {
    var year = date.getFullYear();
  
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    
    return month + '/' + day + '/' + year;
  }

  if (questState.error) {
    return (
      <>
        <ContentLayout className="QuestDetailPage">
          <NotFound />
        </ContentLayout>
      </>
    )
  }

  var start_at = new Date(quest?.start_at)
  var finish_at = new Date(quest?.finish_at)

  return (
    <>
      <Head
        title={questTitle || l("page.proposal_detail.title") || ""}
        description={
          (questDescription && formatDescription(questDescription)) ||
          l("page.proposal_detail.description") ||
          ""
        }
        image="https://decentraland.org/images/decentraland.png"
      />
      <ContentLayout className="QuestDetailPage">
        <ContentSection>
          {/* <Header size="huge">{questTitle || ""} &nbsp;</Header> */}
          <Loader active={!quest} />
        </ContentSection>
        <Grid>
          {/* IMAGE */}
          <Grid.Row>
            {quest?.category === "event" && (
              <Grid.Column width={10}>
                <ImgFixed
                  src={quest?.configuration.image_url}
                  dimension="wide"
                />
                <div style={{ minHeight: "24px", marginTop: "1rem" }}>
                  {quest && <StatusLabel status={quest.status} />}
                  {quest && <CategoryLabel type={quest.category} />}
                </div>
              </Grid.Column>
            )}
            {quest?.category === "point_of_interest" && (
              // Hit DCL
              <>
                <Grid.Column width={5}>
                  <ImgFixed dimension="wide" src={POIimage} />
                  <div style={{ minHeight: "24px", marginTop: "1rem" }}>
                    {quest && <StatusLabel status={quest.status} />}
                    {quest && <CategoryLabel type={quest.category} />}
                  </div>
                </Grid.Column>
                <Grid.Column width={5}>
                  <ImgFixed
                    dimension="wide"
                    src={Land.get().getParcelImage([
                      quest?.configuration.poi_location_x,
                      quest?.configuration.poi_location_y,
                    ])}
                  />
                  <Paragraph>
                    {`Parcel ${quest?.configuration.poi_location_x},${quest?.configuration.poi_location_y}`}
                    &nbsp;
                  </Paragraph>
                </Grid.Column>
              </>
            )}
            {quest?.category === "other" && (
              // S3
              <Grid.Column width={10}>
                <ImgFixed
                  dimension="wide"
                  src={`https://dcl-snaps.s3.amazonaws.com/${quest.configuration.image_id}.jpeg`}
                />
                <div style={{ minHeight: "24px", marginTop: "1rem" }}>
                  {quest && <StatusLabel status={quest.status} />}
                  {quest && <CategoryLabel type={quest.category} />}
                </div>
              </Grid.Column>
            )}
          </Grid.Row>

          {/* DATE AND TITLE */}
          <Grid.Row>
            <Grid.Column width={10}>
              <SubTitle>{questTitle}</SubTitle>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={2}>
              <Paragraph small secondary>
                Start Date:
              </Paragraph>
            </Grid.Column>
            <Grid.Column width={3}>
              <Paragraph small>{getFormattedDate(start_at)}</Paragraph>
            </Grid.Column>
            <Grid.Column width={2}>
              <Paragraph small secondary>
                End Date:
              </Paragraph>
            </Grid.Column>
            <Grid.Column width={3}>
              <Paragraph small>{getFormattedDate(finish_at)}</Paragraph>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={10}>
              <EventSection.Divider />
            </Grid.Column>
          </Grid.Row>

          {/* QUEST DESCRIPTION */}
          <Grid.Row>
            <Grid.Column width={10}>
              <SubTitle>Quest Details</SubTitle>
              <Loader active={questState.loading} />
              <Markdown source={questDescription || ""} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={10}>
              <EventSection.Divider />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4}>
              {quest && !Boolean(quest?.has_user_submitted) && (
                <Button 
                    size="large"
                    onClick={() => navigate(locations.submitSnap(quest.id))}
                    disabled={ Boolean(quest.status !== QuestStatus.Active ) }
                    primary
                    >
                    Submit Snap
                </Button>
              )}
              {quest && Boolean(quest?.has_user_submitted) && (
                <Button 
                  size="large"
                  disabled={ Boolean(quest?.has_user_submitted) }
                  primary
                  >
                  Snap submitted!
                </Button>
              )}
            </Grid.Column>
            <Grid.Column width={4}>
              {quest && (
                <Link to={`/snaps?quest_id=${quest.id}`}>
                  <Button size="huge" secondary>
                    See Snaps
                  </Button>
                </Link>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </ContentLayout>
    </>
  )
}
