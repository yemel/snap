import React, { useMemo } from "react"

//Libs
import Title from "decentraland-gatsby/dist/components/Text/Title"
import { useLocation } from '@reach/router'
import Paragraph from "decentraland-gatsby/dist/components/Text/Paragraph"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import useQuest from "../hooks/useQuest"
import { Link } from "gatsby"


const QuestPage = () => {
    
  const location = useLocation()
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const [quest, questState] = useQuest(params.get('id'))


  return (
    <>
      <div className="Header">
        <Title style={{ color: "white" }}>Quest #{quest?.id}</Title>
        <Paragraph style={{ color: "white" }}>
          Submit your snap and participate for a prize
        </Paragraph>
      </div>
      <div className="MainDiv">
        <div className="MainContainer">
          <Title style={{ fontSize: "medium" }}>{quest?.title}</Title>
          <Paragraph style={{ fontSize: "small" }}>
            {quest?.description}
          </Paragraph>
          <Title style={{ fontSize: "medium" }}>Nearby location</Title>
          <Paragraph style={{ fontSize: "small" }}>
            {quest?.configuration.location}
          </Paragraph>
          <Title style={{ fontSize: "medium" }}>Deadline</Title>
          <Paragraph style={{ fontSize: "small" }}>
            {/* {quest?.finish_at} */}
          </Paragraph>
        </div>
        <Link to={`/submitSnap/`}>
          <Button size="huge" primary>
            Submit Snap
          </Button>
        </Link>
      </div>
    </>
  )
}

export default QuestPage
