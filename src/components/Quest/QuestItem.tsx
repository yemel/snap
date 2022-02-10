import React from "react"
import { Card } from "decentraland-ui/dist/components/Card/Card"
import { Header } from "decentraland-ui/dist/components/Header/Header"
import { Link } from "gatsby-plugin-intl"
import locations from "../../modules/locations"
import StatusLabel from "./QuestStatusLabel"
import CategoryLabel from "./QuestCategoryLabel"
import { QuestAttributes } from "../../entities/Quest/types"

import "./QuestItem.css"
import TokenList from "decentraland-gatsby/dist/utils/dom/TokenList"
import useAuthContext from "decentraland-gatsby/dist/context/Auth/useAuthContext"
import FinishLabel from "./FinishLabel"

export type QuestItemProps = {
  quest: QuestAttributes
}

export default function QuestItem({ quest }: QuestItemProps) {
  const [account] = useAuthContext()
  return (
    <Card
      as={Link}
      to={locations.quest(quest.id)}
      style={{ width: "100%" }}
      className={TokenList.join(["QuestItem"])}
    >
      <Card.Content>
        <div className="QuestItem__Title">
          <Header>{quest.configuration.title}</Header>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <StatusLabel status={quest.status} />
            <CategoryLabel type={quest.category} />
            <FinishLabel date={quest.finish_at} />
          </div>
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ marginBottom: "0px", marginRight: "5px" }}>Submitted</p>
            <img src={`./tick.png`} width="24" height="24" />
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}
