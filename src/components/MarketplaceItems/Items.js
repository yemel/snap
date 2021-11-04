import { useState } from "react"
import classes from "./Items.module.css"
import InfiniteScroll from "react-infinite-scroller"
import Item from "./Item"
import React from "react"

export default function Items(props) {
  // const DUMMY_ITEMS = JSON.parse(props.events).Items
  const DUMMY_ITEMS = [
    {
      id: 1,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
      price: "534",
    },
    {
      id: 2,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
      price: "534",
    },
    {
      id: 3,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
      price: "534",
    },
    {
      id: 4,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
      price: "534",
    },
    {
      id: 5,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
      price: "534",
    },
    {
      id: 6,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
      price: "534",
    },
    {
      id: 7,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
      price: "534",
    },
    {
      id: 8,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
      price: "534",
    },
    {
      id: 9,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
      price: "534",
    },
    {
      id: 10,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
      price: "534",
    },
    {
      id: 11,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
      price: "534",
    },
    {
      id: 12,
      name: "TestName",
      desc: "TestDesc",
      tags: ["casino", "nature"],
      location: "(X,Y)",
      time: "ab/cd/efgh",
      price: "534",
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
      {/* <h2>Marketplace Items</h2> */}
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
              {DUMMY_ITEMS.map((e) => (
                <Item
                  key={e.id}
                  name={e.name}
                  desc={e.desc}
                  tags={e.tags}
                  location={e.location}
                  time={e.time}
                  price={e.price}
                />
              ))}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  )
}
