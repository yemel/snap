import { useState } from "react"
import classes from "./snaps.module.css"
import InfiniteScroll from "react-infinite-scroller"
import SnapCard from "./snapCard"
import React from "react"

export default function Snaps(props) {
  // const DUMMY_SNAPS = JSON.parse(props.events).Items
  const DUMMY_SNAPS = [
    {
      id: 1,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
    },
    {
      id: 2,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
    },
    {
      id: 3,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
    },
    {
      id: 4,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
    },
    {
      id: 5,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
    },
    {
      id: 6,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
    },
    {
      id: 7,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
    },
    {
      id: 8,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
    },
    {
      id: 9,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
    },
    {
      id: 10,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
    },
    {
      id: 11,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
    },
    {
      id: 12,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
    },
  ]

  const [hasMoreElements, setHasMoreElements] = useState(false)
  const loadFunc = () => {
    // API CALL (this function should be received by props to re-use this component)
    console.log("called")
    // IF IT HAS MORE ELEMENTS WHICH IT SHOULD WE TURN THIS TO TRUE
    setHasMoreElements(true)
  }

  return (
    <div className={classes.assetsSearchView}>
      <div className={classes.assetsSearchViewSeparator}>
        <div className={classes.assetsSearchViewSeparatorInside}></div>
      </div>
      <h2>Snaps</h2>
      <div className={classes.assetsSearchViewBody}>
        <div className={classes.assetsSearchViewBody2}>
          <div className={classes.assetsSearchViewBody3}>
            <InfiniteScroll
              className={classes.InfiniteScroll}
              pageStart={0}
              loadMore={loadFunc}
              hasMore={hasMoreElements}
              loader={
                <div className="loader" key={0}>
                  Loading ...
                </div>
              }
            >
              {DUMMY_SNAPS.map((e) => (
                <SnapCard
                  key={e.id}
                  name={e.name}
                  desc={e.desc}
                  tags={e.tags}
                  location={e.location}
                  time={e.time}
                />
              ))}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  )
}
