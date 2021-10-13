import React from "react"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import "./marketplace.css"
import Title from "decentraland-gatsby/dist/components/Text/Title"
import Paragraph from "decentraland-gatsby/dist/components/Text/Paragraph"
import Items from "../components/MarketplaceItems/Items"

const Marketplace = () => {
  const l = useFormatMessage()

  return (
    <>
      <div className="Header">
        <Title style={{ color: "white" }}>Snap's Marketplace</Title>
        <Paragraph style={{ color: "white" }}>
          Where moments become collectible NFTs
        </Paragraph>
      </div>
      <div className="MainDiv">
        <Items />
      </div>
    </>
  )
}

export default Marketplace
