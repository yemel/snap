import React from "react"
import "./ImageWithDescription.css"
import Title from "decentraland-gatsby/dist/components/Text/Title"
import SubTitle from "decentraland-gatsby/dist/components/Text/SubTitle"
import Paragraph from "decentraland-gatsby/dist/components/Text/Paragraph"
import { Button } from "decentraland-ui/dist/components/Button/Button"

export default function ImageWithDescription(props) {
  return (
    <div class="Container">
      <div class="grid">
        <div class="row">
          {props.imageLocation == "left" ? (
            <div className="Container-Background">
              <div class="image">
                <img src={props.image} width="340" height="300" />
              </div>
              <div class="text">
                <Title>{props.title}</Title>
                <Paragraph>{props.desc}</Paragraph>
                {props.hasButton == "yes" ? (
                  <Button primary>{props.buttonText}</Button>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            <div className="Container-Background">
              <div class="text">
                <Title>{props.title}</Title>
                <Paragraph>{props.desc}</Paragraph>
                {props.hasButton == "yes" ? (
                  <Button primary>{props.buttonText}</Button>
                ) : (
                  ""
                )}
              </div>
              <div class="image">
                <img src={props.image} width="300" height="300" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
