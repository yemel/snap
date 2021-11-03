import React, { useState, useReducer } from "react"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import ImageSelector from "../components/UI/ImageSelector"
import "./submitSnap.css"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import Title from "decentraland-gatsby/dist/components/Text/Title"
import Paragraph from "decentraland-gatsby/dist/components/Text/Paragraph"

const SubmitSnap = () => {
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
        <Title style={{ color: "white" }}>Upload your best Snap</Title>
        <Paragraph style={{ color: "white" }}>only ONE per day</Paragraph>
      </div>
      <div className="MainDiv">
        <div className="AllItems">
          <ImageSelector
            title="Display Image"
            description="File types supported: JPG and PNG. Max size: 40 MB"
            onChange={imagePickerHandler}
          />
          <div className="formcontrol">
            <label htmlFor="name">Title</label>
            <input
              type="text"
              id="name"
              // value={EventName}
              // onChange={EventNameChangeHandler}
              // onBlur={EventNameBlurHandler}
              placeholder="Snap Name"
            />
          </div>
          <div className="formcontrol">
            <label htmlFor="name">Description</label>
            <input
              type="text"
              id="name"
              // value={EventName}
              // onChange={EventNameChangeHandler}
              // onBlur={EventNameBlurHandler}
              placeholder="Description"
            />
          </div>
          <div className="formcontrol">
            <label htmlFor="name">Tags</label>
            <input
              type="text"
              id="name"
              // value={EventName}
              // onChange={EventNameChangeHandler}
              // onBlur={EventNameBlurHandler}
              placeholder="Tags"
            />
          </div>
          <div className="formcontrol">
            <label htmlFor="name">Time Date</label>
            <input
              type="text"
              id="name"
              // value={EventName}
              // onChange={EventNameChangeHandler}
              // onBlur={EventNameBlurHandler}
              placeholder="Enter the date when the picture was taken"
            />
          </div>
          <div className="formcontrol">
            <label htmlFor="name">Location</label>
            <input
              type="text"
              id="name"
              // value={EventName}
              // onChange={EventNameChangeHandler}
              // onBlur={EventNameBlurHandler}
              placeholder="Enter (X,Y) location"
            />
          </div>
          <Button primary>Submit</Button>
        </div>
      </div>
    </>
  )
}

export default SubmitSnap
