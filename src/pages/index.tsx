import React from "react"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import ImageWithDescription from "../components/Section/ImageWithDescription"
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid/Grid"
import ImgFixed from "decentraland-gatsby/dist/components/Image/ImgFixed"
import Title from "decentraland-gatsby/dist/components/Text/Title"
import SubTitle from "decentraland-gatsby/dist/components/Text/SubTitle"

export default function Landing() {
  const l = useFormatMessage()

  return (
    <>
      {/* <Grid>
        <Grid.Row>
          <Grid.Column width={5}>
            <Title>Decentraland Snap</Title>
            <SubTitle>
              Flooding the Internet with Epic Memories. An experiment in
              play-2-earn mechanics
            </SubTitle>
          </Grid.Column>
          <Grid.Column width={5}>
            <ImgFixed dimension="wide" size="contain" src={`/Snap.png`} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={10}></Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={10}></Grid.Column>
        </Grid.Row>
      </Grid> */}
      <ImageWithDescription
        image={"/Snap.png"}
        imageLocation={"right"}
        hasButton={"yes"}
        buttonText={"Get Started"}
        title={"Decentraland Snap"}
        desc={
          "Flooding the Internet with Epic Memories. An experiment in play-2-earn mechanics"
        }
      />
      <ImageWithDescription
        image={"/Camera.png"}
        imageLocation={"left"}
        hasButton={"no"}
        link="/quests"
        desc={
          "Become a Virtual Photographer. Participate in quests to submit your best photos and videos. Earn MANA per featured Snap"
        }
      />
      {/* <ImageWithDescription
        image={"/Vote.png"}
        imageLocation={"right"}
        hasButton={"no"}
        buttonText={"Curate Content"}
        link="/curation"
        desc={
          "Use your MANA and LAND to vote. Have fun curating the best work of the week"
        }
      />
      <ImageWithDescription
        image={"/Tokens.png"}
        imageLocation={"left"}
        hasButton={"no"}
        buttonText={"Browse Market"}
        link="/marketplace"
        desc={
          "Featured Snaps are sold as NFTs. Profits are redistribute to creators and curators"
        }
      /> */}
    </>
  )
}
