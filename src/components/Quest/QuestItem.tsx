import React from 'react'
import { Card } from "decentraland-ui/dist/components/Card/Card"
import { Header } from "decentraland-ui/dist/components/Header/Header"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Link } from "gatsby-plugin-intl"
import locations from '../../modules/locations'
import StatusLabel from './QuestStatusLabel'
import CategoryLabel from './QuestCategoryLabel'
import { QuestCategory, QuestAttributes } from '../../entities/Quest/types'

import './QuestItem.css'
import TokenList from 'decentraland-gatsby/dist/utils/dom/TokenList'
import useAuthContext from 'decentraland-gatsby/dist/context/Auth/useAuthContext'
import FinishLabel from './FinishLabel'

export type QuestItemProps = {
  quest: QuestAttributes
}

export default function QuestItem({ quest }: QuestItemProps) {
  const [ account ] = useAuthContext()
  return <Card as={Link} to={locations.quest(quest.id)} style={{ width: '100%' }} className={TokenList.join([
      "QuestItem",
    ])
  }>
      <Card.Content>
        <div className="QuestItem__Title">
          <Header>{quest.configuration.title}</Header>
        </div>
        <div>
          <StatusLabel status={quest.status} />
          <CategoryLabel type={quest.category} />
          <FinishLabel date={quest.finish_at} />
        </div>
      </Card.Content>
    </Card>
}