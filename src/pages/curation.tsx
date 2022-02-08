import React from "react"
//CSS
import "./curation.css"
//Libs
import Title from "decentraland-gatsby/dist/components/Text/Title"
import Paragraph from "decentraland-gatsby/dist/components/Text/Paragraph"
import SnapCard from "../components/Snap/snapCardOld"
import { Button } from "decentraland-ui/dist/components/Button/Button"

const Curation = () => {
  const DUMMY_SNAP = [
    {
      id: 1,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
    },
  ]

  return (
    <>
      <div className="Header">
        <Title style={{ color: "white" }}>Every opinion matters</Title>
        <Paragraph style={{ color: "white" }}>
          Score the following Snaps and help shape the community
        </Paragraph>
      </div>
      <div className="MainDiv">
        <div className="MainContainer">
          {DUMMY_SNAP.map((e) => (
            <SnapCard
              key={e.id}
              name={e.name}
              desc={e.desc}
              tags={e.tags}
              location={e.location}
              time={e.time}
            />
          ))}
        </div>
        <div className="buttonsWrapper">
          <Button size="huge" secondary>
            Back
          </Button>
          <Button size="huge" primary>
            Next
          </Button>
        </div>
      </div>
    </>
  )
}

export default Curation
