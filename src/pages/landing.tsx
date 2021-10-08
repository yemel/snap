import React from "react"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import ImageWithDescription from "../components/Section/ImageWithDescription"

export default function Landing() {
  const l = useFormatMessage()

  return (
    <>
      <ImageWithDescription
        image={"Snap.png"}
        imageLocation={"right"}
        hasButton={"no"}
        title={"Decentraland Snap"}
        desc={
          "Flooding the Internet with Epic Memories. An experiment in play-2-earn mechanics"
        }
      />
      <ImageWithDescription
        image={"Camera.png"}
        imageLocation={"left"}
        hasButton={"yes"}
        buttonText={"Get Started"}
        desc={
          "Become a Virtual Photographer. Submit your best photos and videos. Earn MANA per featured Snap"
        }
      />
      <ImageWithDescription
        image={"Vote.png"}
        imageLocation={"right"}
        hasButton={"yes"}
        buttonText={"Curate Content"}
        desc={
          "Use your MANA and LAND to vote. Have fun curating the best work of the week"
        }
      />
      <ImageWithDescription
        image={"Tokens.png"}
        imageLocation={"left"}
        hasButton={"yes"}
        buttonText={"Browse Market"}
        desc={
          "Featured Snaps are sold as NFTs. Profits are redistribute to creators and curators"
        }
      />
    </>
  )
}
