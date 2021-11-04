// This component needs: key, name, desc, tags, location, time
import React from "react"
import { useState } from "react"
// LIBS
import { Loader } from "decentraland-ui/dist/components/Loader/Loader"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"
import Title from "decentraland-gatsby/dist/components/Text/Title"
import Paragraph from "decentraland-gatsby/dist/components/Text/Paragraph"
// CSS
import "./snapCard.css"

export default function snapCard(props: any) {
  // Fetch Image from API
  // const [imageURL, setImageURL] = useState()
  // useEffect(() => {
  //   axios
  //     .post(
  //       "HERE PUT LINK",
  //       { imageID: props.imageID }
  //     )
  //     .then(function (response) {
  //       console.log(response.data.body)
  //       setImageURL(response.data.body)
  //     })
  //     .catch(function (error) {
  //       console.log(error)
  //     })
  // }, [])

  const [score, setScore] = useState(0)
  const setScoreHandler = (number: any) => {
    setScore(number)
  }
  const assetLink = "/"
  return (
    // <Link href={assetLink}>
    <div className="EventCardPrincipal">
      <div className="EventCardImageWrapper">
        <div className="EventCardImageWrapper2">
          <div className="EventCardImageWrapper3">
            <div className="EventCardImageWrapper4">
              {/* {imageURL ? (
                    <img src={imageURL} className={classes.EventCardImage} />
                  ) : (
                    <Loader active size="massive" />
                  )} */}
              <Loader active size="massive" />
            </div>
          </div>
        </div>
      </div>
      <div className="EventCardDescriptionWrapper">
        <Title style={{ fontSize: "medium" }}>
          Martin Garrix virtual concert in Decentraland's Casino
        </Title>
        <Paragraph style={{ fontSize: "small" }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </Paragraph>
      </div>
      <div className="score">
        <p>Score: {score}</p>
      </div>
      <div className="EventCardDescriptionWrapper">
        <Slider min={0} max={5} step={0.1} onChange={setScoreHandler} />
      </div>
    </div>
    // </Link>
  )
}
