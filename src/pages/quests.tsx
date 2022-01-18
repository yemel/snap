import React, { useMemo, useEffect } from "react"
import { useLocation } from "@reach/router"
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid/Grid"
import { Container } from "decentraland-ui/dist/components/Container/Container"
import { Header } from "decentraland-ui/dist/components/Header/Header"
import { Loader } from "decentraland-ui/dist/components/Loader/Loader"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Pagination } from "decentraland-ui/dist/components/Pagination/Pagination"
import { navigate } from "gatsby-plugin-intl"
import Title from "decentraland-gatsby/dist/components/Text/Title"
import { Card } from "decentraland-ui/dist/components/Card/Card"
import { Link } from "gatsby-plugin-intl"
import Paragraph from "decentraland-gatsby/dist/components/Text/Paragraph"

import locations, {
  ProposalListView,
  toProposalListPage,
  toProposalListView,
  WELCOME_STORE_KEY,
  WELCOME_STORE_VERSION,
} from "../modules/locations"
import ActionableLayout from "../components/Layout/ActionableLayout"
import {
  ProposalStatus,
  ProposalType,
  toProposalStatus,
  toProposalType,
} from "../entities/Proposal/types"
import {
  toQuestCategory,
} from "../entities/Quest/types"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import useSubscriptions from "../hooks/useSubscriptions"
import Empty from "../components/Proposal/Empty"
import Head from "decentraland-gatsby/dist/components/Head/Head"
import useQuests from "../hooks/useQuests"
import "./index.css"
import { QuestStatus } from "../entities/Quest/types"

const ITEMS_PER_PAGE = 25

enum Onboarding {
  Loading,
  Yes,
  No,
}

export default function IndexPage() {
  const l = useFormatMessage()
  const location = useLocation()
  const params = useMemo(() => new URLSearchParams(location.search), [
    location.search,
  ])
  const category = toQuestCategory(params.get("category")) ?? undefined
  const view = toProposalListView(params.get("view")) ?? undefined
  const status = QuestStatus.Active
  const page = toProposalListPage(params.get("page")) ?? undefined

  const [ quests, questsState ] = useQuests({ category, status, page, itemsPerPage: ITEMS_PER_PAGE })

  useEffect(() => {
    if (typeof quests?.total === "number") {
      const maxPage = Math.ceil(quests.total / ITEMS_PER_PAGE)
      if (page > maxPage) {
        handlePageFilter(maxPage)
      }
    }
  }, [page, quests])

  function handlePageFilter(page: number) {
    const newParams = new URLSearchParams(params)
    page !== 1 ? newParams.set("page", String(page)) : newParams.delete("page")
    return navigate(locations.proposals(newParams))
  }

  return (
    <>
      <Head
        title={
          (view === ProposalListView.Onboarding && l("page.welcome.title")) ||
          ""
        }
        description={
          (view === ProposalListView.Onboarding &&
            l("page.welcome.description")) ||
          ""
        }
        image="https://decentraland.org/images/decentraland.png"
      />
      <Container>
        <Grid stackable>
          <Grid.Row>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Title>Quests</Title>
              <Paragraph>
                Here you will see all your available objectives!
              </Paragraph>
            </div>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column tablet="16">
              <ActionableLayout
                leftAction={
                  <Header sub>
                    {!quests && ""}
                    {quests &&
                      l(`general.count_quests`, {
                        count: quests.total || 0,
                      })}
                  </Header>
                }
              >
                {/* <Loader active={!proposals || proposalsState.loading} /> */}
                {quests && quests.data.length === 0 && (
                  <Empty
                    description={l(`page.proposal_list.no_proposals_yet`)}
                  />
                )}
                {quests &&
                  quests.data.map((quest) => {
                    return (
                      <Card
                        as={Link}
                        to={`/quest/${quest.id}`}
                        style={{ width: "100%" }}
                      >
                        <Card.Content>
                          <Header>{quest.title}</Header>
                        </Card.Content>
                      </Card>
                    )
                  })}
                {quests && quests.total > ITEMS_PER_PAGE && (
                  <Pagination
                    onPageChange={(e, { activePage }) =>
                      handlePageFilter(activePage as number)
                    }
                    totalPages={Math.ceil(quests.total / ITEMS_PER_PAGE)}
                    activePage={page}
                    firstItem={null}
                    lastItem={null}
                  />
                )}
              </ActionableLayout>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </>
  )
}
