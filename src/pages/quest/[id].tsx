import React from "react"

//Libs
import Title from "decentraland-gatsby/dist/components/Text/Title"
import Paragraph from "decentraland-gatsby/dist/components/Text/Paragraph"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Link } from "gatsby"

const Curation = () => {
  //Here we should fetch the quest from the API using useEffect
  const DUMMY_QUEST = {
    id: 1,
    name: "Find the gold treasure",
    desc:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    tags: ["casino", "nature"],
    location: "(X,Y)",
    time: "xx/xx/xxxx",
  }

  return (
    <>
      <div className="Header">
        <Title style={{ color: "white" }}>Quest #{DUMMY_QUEST.id}</Title>
        <Paragraph style={{ color: "white" }}>
          Submit your snap and participate for a prize
        </Paragraph>
      </div>
      <div className="MainDiv">
        <div className="MainContainer">
          <Title style={{ fontSize: "medium" }}>{DUMMY_QUEST.name}</Title>
          <Paragraph style={{ fontSize: "small" }}>
            {DUMMY_QUEST.desc}
          </Paragraph>
          <Title style={{ fontSize: "medium" }}>Nearby location</Title>
          <Paragraph style={{ fontSize: "small" }}>
            {DUMMY_QUEST.location}
          </Paragraph>
          <Title style={{ fontSize: "medium" }}>Deadline</Title>
          <Paragraph style={{ fontSize: "small" }}>
            {DUMMY_QUEST.time}
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

export default Curation
