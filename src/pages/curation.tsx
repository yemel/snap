import React, { useState, useReducer } from "react"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
// import classes from "./curation.css"
import "./curation.css"
import Title from "decentraland-gatsby/dist/components/Text/Title"
import Paragraph from "decentraland-gatsby/dist/components/Text/Paragraph"
import Snaps from "../components/Snaps/snaps"
import { AnyAaaaRecord } from "dns"

const Curation = () => {
  const l = useFormatMessage()
  // Image Picker
  const [imagePickerState, SetImagePickerState] = useState()
  const imagePickerHandler = (image: any) => {
    SetImagePickerState(image)
  }
  // END Image Picker

  return (
    <>
      <div className="Header">
        <Title>Every opinion matters</Title>
        <Paragraph>Help shape the Snap community</Paragraph>
      </div>
      <div className="MainDiv">
        <Snaps />
      </div>
    </>
  )
}

export default Curation
