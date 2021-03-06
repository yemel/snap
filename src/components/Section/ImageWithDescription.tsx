import React from "react"
import { Link } from "gatsby"
import "./ImageWithDescription.css"
import Title from "decentraland-gatsby/dist/components/Text/Title"
import Paragraph from "decentraland-gatsby/dist/components/Text/Paragraph"
import { Button } from "decentraland-ui/dist/components/Button/Button"

export default function ImageWithDescription(props: any) {
  return (
    <div className="Container">
      <div className="grid">
        <div className="row">
          {props.imageLocation == "left" ? (
            <div className="Container-Background">
              <div>
                <img src={props.image} width="340" height="300" />
              </div>
              <div className="text">
                <Title>{props.title}</Title>
                <Paragraph>{props.desc}</Paragraph>
                {props.hasButton == "yes" ? (
                  <Link to={props.link}>
                    <Button primary>{props.buttonText}</Button>
                  </Link>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            <div className="Container-Background">
              <div className="text">
                <Title>{props.title}</Title>
                <Paragraph>{props.desc}</Paragraph>
                {props.hasButton == "yes" ? (
                  <Link to={props.link}>
                    <Button primary>{props.buttonText}</Button>
                  </Link>
                ) : (
                  ""
                )}
              </div>
              <div>
                <img src={props.image} width="300" height="300" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
