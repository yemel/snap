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
    var IMAGE_ID = uuidv4()
    
    const quest_id = params.get('quest_id') || ""

    console.log(snapName)
    console.log(snapDescription)
    console.log(tags)
    console.log(timeDate)
    console.log(location)
    console.log("This is all the data, now image:")
    console.log(imagePickerState)
    console.log("Now begin magic process asking for S3 URL")

    // Call lambda to ask for signed URL to post in S3 Bucket
    let S3URL: any
    await axios
      .post(
        "https://643043nmsk.execute-api.us-east-2.amazonaws.com/prod/s3link",
        { imageID: IMAGE_ID }
      )
      .then(function (response) {
        console.log("Here is the s3 link:")
        console.log(response)
        S3URL = response.data.body
      })
      .catch(function (error) {
        console.log(error)
      })

    console.log("Now we put the image in S3")
    // Once we now have the signed URL we need to post the IMAGE to the S3 bucket and wait for response
    await axios
      .put(S3URL, imagePickerState)
      .then((res) => {
        console.log(res)
      })
      .catch(function (error) {
        console.log(error)
      })

    // If the image was uploaded correctly we can post to Postgres all the data
    // If the image upload failed we can tell the user SERVER ERROR "try again"

    // await snapService
    //   .createSnap({
    //     imageid: IMAGE_ID,
    //     name: snapName,
    //     description: snapDescription,
    //     tags: tags,
    //     timeDate: timeDate,
    //     location: location,
    //   })
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });

    // ACA ES DONDE VA LA EJECUCION QUE SE HACE CON TODA ESTA DATA

    let questResult = await Governance.get()
        .createSnap({
            category: SnapCategory.IgPhoto,
            title: snapName,
            description: snapDescription,
            taken_at: timeDate,
            x: 1,
            y: 1,
            quest_id
        });

    console.log(questResult)

    SetSnapName("")
    SetSnapDescription("")
    SetTags("")
    SetTimeDate("")
    SetLocation("")
    SetImagePickerState(undefined)
  }
  //

  // State variables for all inputs
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
  const [location, SetLocation] = useState("")
  const setLocationHandler = (event: any) => {
    SetLocation(event.target.value)
  }
  //

  return (
    <>
      <div className="Header">
        <Title style={{ color: "white" }}>Upload your best Snap</Title>
        <Paragraph style={{ color: "white" }}>only ONE per day</Paragraph>
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
              <label htmlFor="name">Tags</label>
              <input
                type="text"
                id="name"
                value={tags}
                onChange={setTagsHandler}
                placeholder="Tags"
              />
            </div>
            <div className="formcontrol">
              <label htmlFor="name">Time Date</label>
              <input
                type="text"
                id="name"
                value={timeDate}
                onChange={setTimeDateHandler}
                placeholder="Enter the date when the picture was taken"
              />
            </div>
            <div className="formcontrol">
              <label htmlFor="name">Location</label>
              <input
                type="text"
                id="name"
                value={location}
                onChange={setLocationHandler}
                placeholder="Enter (X,Y) location"
              />
            </div>
            <Button primary type="submit">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}

export default SubmitSnap
