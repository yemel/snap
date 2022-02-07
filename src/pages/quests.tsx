import React, { useMemo, useEffect } from "react"
import { useLocation } from '@reach/router'
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid/Grid"
import { Container } from "decentraland-ui/dist/components/Container/Container"
import { Header } from "decentraland-ui/dist/components/Header/Header"
import { Loader } from "decentraland-ui/dist/components/Loader/Loader"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Pagination } from "decentraland-ui/dist/components/Pagination/Pagination"
import { navigate } from "gatsby-plugin-intl"
import Navigation, { NavigationTab } from "../components/Layout/Navigation"
import locations, { QuestListView, toQuestListPage, toQuestListView } from "../modules/locations"
import ActionableLayout from "../components/Layout/ActionableLayout"
import CategoryOption from "../components/Quest/CategoryOption"
import { QuestStatus, QuestCategory, toQuestStatus, toQuestCategory } from "../entities/Quest/types"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import StatusMenu from "../components/Quest/StatusMenu"
import CategoryBanner from "../components/Quest/CategoryBanner"
import QuestItem from "../components/Quest/QuestItem"
import Empty from "../components/Quest/Empty"
import Head from "decentraland-gatsby/dist/components/Head/Head"
import Link from "decentraland-gatsby/dist/components/Text/Link"
import prevent from "decentraland-gatsby/dist/utils/react/prevent"
import useQuests from "../hooks/useQuests"
import { Governance } from "../api/Governance"
import useAsyncMemo from "decentraland-gatsby/dist/hooks/useAsyncMemo"
import './quests.css'

const ITEMS_PER_PAGE = 25

export default function QuestsPage() {
  const l = useFormatMessage()
  const location = useLocation()
  const params = useMemo(() => new URLSearchParams(location.search), [ location.search ])
  const category = toQuestCategory(params.get('category')) ?? undefined
  const view = toQuestListView(params.get('view')) ?? undefined
  const status = view ? QuestStatus.Active : toQuestStatus(params.get('status')) ?? undefined
  const page = toQuestListPage(params.get('page')) ?? undefined
  const [ quests, questsState ] = useQuests({ category, status, page, itemsPerPage: ITEMS_PER_PAGE })

  useEffect(() => {
    if (typeof quests?.total === 'number') {
      const maxPage = Math.ceil(quests.total / ITEMS_PER_PAGE)
      if (page > maxPage) {
        handlePageFilter(maxPage)
      }
    }
  }, [ page, quests ])

  function handlePageFilter(page: number) {
    const newParams = new URLSearchParams(params)
    page !== 1 ? newParams.set('page', String(page)) : newParams.delete('page')
    return navigate(locations.quests(newParams))
  }

  function handleCategoryFilter(category: QuestCategory | null) {
    const newParams = new URLSearchParams(params)
    category ? newParams.set('category', category) : newParams.delete('category')
    newParams.delete('page')
    return locations.quests(newParams)
  }

  function handleStatusFilter(status: QuestStatus | null) {
    const newParams = new URLSearchParams(params)
    status ? newParams.set('status', status) : newParams.delete('status')
    newParams.delete('page')
    return navigate(locations.quests(newParams))
  }

  return <>
    <Head
      title={
        (view === QuestListView.Active && l('page.proposal_enacted_list.title')) ||
        (category === QuestCategory.Event && l('page.proposal_catalyst_list.title')) ||
        (category === QuestCategory.Other && l('page.proposal_catalyst_list.title')) ||
        (category === QuestCategory.PointOfInterest && l('page.proposal_catalyst_list.title')) ||
        l('page.proposal_list.title') || ''
      }
      description={
        (view === QuestListView.Active && l('page.proposal_enacted_list.description')) ||
        (category === QuestCategory.Event && l('page.proposal_catalyst_list.description')) ||
        (category === QuestCategory.Other && l('page.proposal_catalyst_list.description')) ||
        (category === QuestCategory.PointOfInterest && l('page.proposal_catalyst_list.description')) ||
        l('page.proposal_list.description') || ''
      }
      image="https://decentraland.org/images/decentraland.png"
    />
    <Navigation activeTab={view !== QuestListView.Active ? NavigationTab.Proposals : NavigationTab.Enacted} />
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column tablet="4">
            <ActionableLayout
              leftAction={<Header sub>{l(`page.proposal_list.categories`)}</Header>}
            >
              <CategoryOption type={'all'} href={handleCategoryFilter(null)} active={category === null} />
              <CategoryOption type={QuestCategory.Event} href={handleCategoryFilter(QuestCategory.Event)} active={category === QuestCategory.Event} />
              <CategoryOption type={QuestCategory.PointOfInterest} href={handleCategoryFilter(QuestCategory.PointOfInterest)} active={category === QuestCategory.PointOfInterest} />
              <CategoryOption type={QuestCategory.Other} href={handleCategoryFilter(QuestCategory.Other)} active={category === QuestCategory.Other} />
            </ActionableLayout>
          </Grid.Column>
          <Grid.Column tablet="12">
            <ActionableLayout
              leftAction={<Header sub>
                {!quests && ''}
                {quests && l(`general.count_proposals`, { count: quests.total || 0 })}
              </Header>}
              rightAction={view !== QuestListView.Active && <>
                <StatusMenu style={{ marginRight: '1rem' }} value={status} onChange={(_, { value }) => handleStatusFilter(value)} />
                <Button primary size="small" as={Link} href={locations.createQuest()} onClick={prevent(() => navigate(locations.createQuest()))}>
                  {l(`page.proposal_list.new_proposal`)}
                </Button>
              </>}
            >
              <Loader active={!quests || questsState.loading} />
              {category && <CategoryBanner type={category} active />}
              {quests && quests.data.length === 0 && <Empty description={l(`page.proposal_list.no_proposals_yet`)} />}
              {quests && quests.data.map(quest => {
                return <QuestItem
                  key={quest.id}
                  quest={quest}
                />
              })}
              {quests && quests.total > ITEMS_PER_PAGE && <Pagination
                onPageChange={(e, { activePage }) => handlePageFilter(activePage as number)}
                totalPages={Math.ceil(quests.total / ITEMS_PER_PAGE)}
                activePage={page}
                firstItem={null}
                lastItem={null}
              />}
            </ActionableLayout>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </>
}