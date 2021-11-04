import React from "react"
import { useRef } from "react"
import classes from "./ImageSelector.module.css"
import ImageIcon from "@material-ui/icons/Image"

// To use this ImageSelector you must provide through props: Title , Description, onChange (function to store the value captured)

export default function ImageSelector(props) {
  const imageInputRef = useRef()

  const imageReceiverHandler = (event) => {
    props.onChange(event.target.files[0])
  }

  return (
    <div className={classes.imageSelectorWrapper}>
      <label className={classes.imageSelectorTitle}>{props.title}</label>
      <div className={classes.imageSelectorDescription}>
        {props.description}
      </div>
      <div className={classes.imageSelector}>
        <div className={classes.imageSelector2}>
          <div className={classes.imageSelector3}>
            <div className={classes.imageSelector4}>
              <input
                className={classes.imageSelectorInput}
                type="file"
                accept="image/*"
                id="featuredImage"
                onChange={imageReceiverHandler}
                ref={imageInputRef}
              />
              <ImageIcon
                className={classes.imageSelectorImage}
                style={{ fontSize: "84px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
