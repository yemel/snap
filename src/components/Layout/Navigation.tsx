import React from 'react'
import { Tabs } from 'decentraland-ui/dist/components/Tabs/Tabs'
import useFormatMessage from 'decentraland-gatsby/dist/hooks/useFormatMessage'
import useAuthContext from 'decentraland-gatsby/dist/context/Auth/useAuthContext'
import { Link } from 'gatsby-plugin-intl'
import locations, { QuestActivityList, QuestListView } from '../../modules/locations'
import './Navigation.css'

export enum NavigationTab {
  Proposals = 'proposals',
  Wrapping = 'wrapping',
  Enacted = 'enacted',
  Activity = 'activity',
}

type NavigationProps = {
  activeTab?: NavigationTab
}

const Navigation = (props: NavigationProps) => {
  const l = useFormatMessage()
  const [ user ] = useAuthContext()
  return (
    <Tabs>
      <Tabs.Left>
        <Link to={locations.quests()}>
          <Tabs.Tab active={props.activeTab === NavigationTab.Proposals}>
            {l('navigation.proposals')}
          </Tabs.Tab>
        </Link>
        <Link to={locations.quests({ view: QuestListView.Active })}>
          <Tabs.Tab active={props.activeTab === NavigationTab.Enacted}>
            {l('navigation.enacted')}
          </Tabs.Tab>
        </Link>
        {user && <Link to={locations.balance()}>
          <Tabs.Tab active={props.activeTab === NavigationTab.Wrapping}>
            {l('navigation.wrapping')}
          </Tabs.Tab>
        </Link>}
        {user && <Link to={locations.activity({ list: QuestActivityList.MySnaps })}>
          <Tabs.Tab active={props.activeTab === NavigationTab.Activity}>
            {l('navigation.activity')}
          </Tabs.Tab>
        </Link>}
      </Tabs.Left>
    </Tabs>
  )
}

export default React.memo(Navigation)
