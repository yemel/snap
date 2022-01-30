import React, { useState, useReducer } from "react"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import ImageSelector from "../../components/UI/ImageSelector"
import { Dropdown } from 'decentraland-ui/dist/components/Dropdown/Dropdown'
import "../submitSnap.css"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import Title from "decentraland-gatsby/dist/components/Text/Title"
import { Governance } from '../../api/Governance'
import { QuestCategory } from '../../entities/Quest/types'
import Paragraph from "decentraland-gatsby/dist/components/Text/Paragraph"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"

const SubmitQuest = () => {
  const l = useFormatMessage()
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
        .createQuest({
            category: category,
            title: questTitle,
            description: questDescription,
            configuration: {location},
            start_at: timeDateStart,
            finish_at: timeDateFinish,
            image_id
        });

    console.log(questResult)

    setQuestTitle("")
    setQuestDescription("")
    setTimeDateStart(new Date())
    setTimeDateFinish(new Date())
    setLocation("")
    SetImagePickerState(undefined)
  }
  //

  // State variables for all inputs
  const [questTitle, setQuestTitle] = useState("")
  const setQuestTitleHandler = (event: any) => {
    setQuestTitle(event.target.value)
  }
  const [questDescription, setQuestDescription] = useState("")
  const setQuestDescriptionHandler = (event: any) => {
    setQuestDescription(event.target.value)
  }
  const [timeDateStart, setTimeDateStart] = useState(new Date())
  const setTimeDateStartHandler = (event: any) => {
    setTimeDateStart(event.target.value)
  }
  const [timeDateFinish, setTimeDateFinish] = useState(new Date())
  const setTimeDateFinishHandler = (event: any) => {
    setTimeDateFinish(event.target.value)
  }
  const [location, setLocation] = useState("")
  const setLocationHandler = (event: any) => {
    setLocation(event.target.value)
  }
  const [category, setCategory] = useState(QuestCategory.Event)
  const setCategoryHandler = (category: QuestCategory) => {
    setCategory(category)
  }

  return (
    <>
      <div className="Header">
        <Title style={{ color: "white" }}>Upload a new Quest!</Title>
      </div>
      <div className="MainDiv">
        <div className="AllItems">
          <form onSubmit={formSubmitHandler}>
            <div className="formcontrol">
              <label htmlFor="name">Title</label>
              <input
                type="text"
                id="name"
                value={questTitle}
                onChange={setQuestTitleHandler}
                placeholder="Quest Name"
              />
            </div>
            <div className="formcontrol">
              <label htmlFor="name">Description</label>
              <input
                type="text"
                id="name"
                value={questDescription}
                onChange={setQuestDescriptionHandler}
                placeholder="Description"
              />
            </div>
            <div className="formcontrol">
              <label htmlFor="name">Start Date</label>
              <input
                type="text"
                id="name"
                value={timeDateStart}
                onChange={setTimeDateStartHandler}
                placeholder="Enter the date when the Quest starts"
              />
            </div>
            <div className="formcontrol">
              <label htmlFor="name">Finish Date</label>
              <input
                type="date"
                id="name"
                value={timeDateFinish}
                onChange={setTimeDateFinishHandler}
                placeholder="Enter the date when the Quest finishes"
              />
            </div>
            <div className="formcontrol">
                <label htmlFor="name">Category</label>
                <Dropdown text="Category"  value={category}>
                    <Dropdown.Menu>
                        <Dropdown.Item text="Event" value={QuestCategory.Event} onClick={(e) => setCategoryHandler(QuestCategory.Event)} />
                        <Dropdown.Item text="Point of interest" value={QuestCategory.PointOfInterest} onClick={(e) => setCategoryHandler(QuestCategory.PointOfInterest)} />
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="formcontrol">
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

export default SubmitQuest
