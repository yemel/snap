import React, { useState, useReducer } from "react"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import classes from "./curation.module.css"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import Title from "decentraland-gatsby/dist/components/Text/Title"
import Paragraph from "decentraland-gatsby/dist/components/Text/Paragraph"
import Snaps from "../components/Snaps/snaps"

const Curation = () => {
  const l = useFormatMessage()
  // Image Picker
  const [imagePickerState, SetImagePickerState] = useState()
  const imagePickerHandler = (image) => {
    SetImagePickerState(image)
  }
  // END Image Picker

  return (
    <>
      <div className={classes.Header}>
        <Title>Every opinion matters</Title>
        <Paragraph>Help shape the Snap community</Paragraph>
      </div>
      <div className={classes.MainDiv}>
        <Snaps />
      </div>
    </>
  )
}

export default Curation
