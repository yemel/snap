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
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import useSubscriptions from "../hooks/useSubscriptions"
import Empty from "../components/Proposal/Empty"
import Head from "decentraland-gatsby/dist/components/Head/Head"
import useProposals from "../hooks/useProposals"
import "./index.css"

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
  const view = toProposalListView(params.get("view")) ?? undefined
  const page = toProposalListPage(params.get("page")) ?? undefined

  const proposals = {
    total: 2,
    data: [
      { title: "QUEST 1", id: 1 },
      { title: "QUEST 2", id: 2 },
      { title: "QUEST 3", id: 3 },
      { title: "QUEST 4", id: 4 },
      { title: "QUEST 5", id: 5 },
      { title: "QUEST 6", id: 6 },
    ],
  }

  useEffect(() => {
    if (typeof proposals?.total === "number") {
      const maxPage = Math.ceil(proposals.total / ITEMS_PER_PAGE)
      if (page > maxPage) {
        handlePageFilter(maxPage)
      }
    }
  }, [page, proposals])

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
                    {!proposals && ""}
                    {proposals &&
                      l(`general.count_proposals`, {
                        count: proposals.total || 0,
                      })}
                  </Header>
                }
              >
                {/* <Loader active={!proposals || proposalsState.loading} /> */}
                {proposals && proposals.data.length === 0 && (
                  <Empty
                    description={l(`page.proposal_list.no_proposals_yet`)}
                  />
                )}
                {proposals &&
                  proposals.data.map((proposal) => {
                    return (
                      <Card
                        as={Link}
                        to={`/quest/${proposal.id}`}
                        style={{ width: "100%" }}
                      >
                        <Card.Content>
                          <Header>{proposal.title}</Header>
                        </Card.Content>
                      </Card>
                    )
                  })}
                {proposals && proposals.total > ITEMS_PER_PAGE && (
                  <Pagination
                    onPageChange={(e, { activePage }) =>
                      handlePageFilter(activePage as number)
                    }
                    totalPages={Math.ceil(proposals.total / ITEMS_PER_PAGE)}
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
