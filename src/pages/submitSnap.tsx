import React, { useState, useMemo } from "react"
import { useLocation } from '@reach/router'
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import ImageSelector from "../components/UI/ImageSelector"
import "./submitSnap.css"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import Title from "decentraland-gatsby/dist/components/Text/Title"
import Paragraph from "decentraland-gatsby/dist/components/Text/Paragraph"
import { v4 as uuidv4 } from "uuid"
import { SnapCategory } from '../entities/Snap/types'
import { Governance } from "../api/Governance"
import axios from "axios"
import { navigate } from "gatsby-plugin-intl"
import locations from "../modules/locations"

const SubmitSnap = () => {
  const locationHook = useLocation()
  const l = useFormatMessage()
  const params = useMemo(() => new URLSearchParams(locationHook.search), [locationHook.search])
  
  // Image Picker
  const [imagePickerState, SetImagePickerState] = useState()
  const imagePickerHandler = (image: any) => {
    SetImagePickerState(image)
  }
  // END Image Picker

  // Form Submit Handler
  const formSubmitHandler = async (e: any) => {
    e.preventDefault()
    var image_id = uuidv4()
    const quest_id = params.get('quest_id') || ""
    SetLoading(true)

    // Call lambda to ask for signed URL to post in S3 Bucket
    let S3URL: any
    await axios
      .post(
        "https://643043nmsk.execute-api.us-east-2.amazonaws.com/prod/s3link",
        { imageID: image_id }
      )
      .then(function (response) {
        console.log("Here is the s3 link:")
        console.log(response)
        S3URL = response.data.body
      })
      .catch(function (error) {
        console.log(error)
      })
      
    // Once we now have the signed URL we need to post the IMAGE to the S3 bucket and wait for response
    await axios
      .put(S3URL, imagePickerState)
      .then((res) => {
        console.log(res)
      })
      .catch(function (error) {
        console.log(error)
      })
      

    let questResult = await Governance.get()
        .createSnap({
            category: SnapCategory.IgPhoto,
            title: snapName,
            description: snapDescription,
            taken_at: timeDate,
            x: locationX || 0,
            y: locationY || 0,
            quest_id,
            image_id
        });
    
    SetLoading(false)
    navigate(locations.quests())
  }
  //

  // State variables for all inputs
  const [loading, SetLoading] = useState(false)
  const [snapName, SetSnapName] = useState("")
  const setSnapNameHandler = (event: any) => {
    SetSnapName(event.target.value)
  }
  const [snapDescription, SetSnapDescription] = useState("")
  const setSnapDescriptionHandler = (event: any) => {
    SetSnapDescription(event.target.value)
  }
  const [tags, SetTags] = useState("")
  const setTagsHandler = (event: any) => {
    SetTags(event.target.value)
  }
  const [timeDate, SetTimeDate] = useState(new Date())
  const setTimeDateHandler = (event: any) => {
    SetTimeDate(event.target.value)
  }
  const [locationX, SetLocationX] = useState()
  const setLocationXHandler = (event: any) => {
    SetLocationX(event.target.value)
  }
  const [locationY, SetLocationY] = useState()
  const setLocationYHandler = (event: any) => {
    SetLocationY(event.target.value)
  }
  //

  return (
    <>
      <div className="Header">
        <Title style={{ color: "white" }}>Upload your best Snap</Title>
        <Paragraph style={{ color: "white" }}>Win MANA if your Snap gets Featured!</Paragraph>
      </div>
      <div className="MainDiv">
        <div className="AllItems">
          {imagePickerState ? (
            <div className="ImagePreview">
              <img
                className="Image"
                src={URL.createObjectURL(imagePickerState)}
              />
              <button
                onClick={() => {
                  SetImagePickerState(undefined)
                }}
              >
                Remove
              </button>
            </div>
          ) : (
            <ImageSelector
              title="Display Image"
              description="File types supported: JPG and PNG. Max size: 40 MB"
              onChange={imagePickerHandler}
            />
          )}
          <form onSubmit={formSubmitHandler}>
            <div className="formcontrol">
              <label htmlFor="name">Title</label>
              <input
                type="text"
                id="name"
                value={snapName}
                onChange={setSnapNameHandler}
                placeholder="Snap Name"
              />
            </div>
            <div className="formcontrol">
              <label htmlFor="name">Description</label>
              <input
                type="text"
                id="name"
                value={snapDescription}
                onChange={setSnapDescriptionHandler}
                placeholder="Description"
              />
            </div>
            <div className="formcontrol">
              <label htmlFor="name">Date the snap was taken at </label>
              <input
                type="date"
                id="taken_at"
                value={timeDate}
                onChange={setTimeDateHandler}
                placeholder="Enter the date when the picture was taken"
              />
            </div>
            <div className="formcontrol">
              <label htmlFor="name">Location, X and Y coordinates</label>
              <div style={{ display: 'flex', position: 'relative' }}>
                <input
                  type="number"
                  min={-150}
                  max={150}
                  id="location_x"
                  value={locationX}
                  onChange={setLocationXHandler}
                  placeholder="-150 to 150"
                />
                <input
                  type="number"
                  min={-150}
                  max={150}
                  id="location_y"
                  value={locationY}
                  onChange={setLocationYHandler}
                  placeholder="-150 to 150"
                />
              </div>
            </div>
            <Button primary type="submit" loading={loading}>
              Submit
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}

export default SubmitSnap
