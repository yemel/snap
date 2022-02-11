import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { navigate } from "gatsby-plugin-intl"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Header } from "decentraland-ui/dist/components/Header/Header"
import { Field } from "decentraland-ui/dist/components/Field/Field"
import { Container } from "decentraland-ui/dist/components/Container/Container"
import { Loader } from "decentraland-ui/dist/components/Loader/Loader"
import { SignIn } from "decentraland-ui/dist/components/SignIn/SignIn"
import { SelectField } from "decentraland-ui/dist/components/SelectField/SelectField"
import ImageSelector from "../../components/UI/ImageSelector"
import { QuestCategory } from '../../entities/Quest/types'
import Paragraph from 'decentraland-gatsby/dist/components/Text/Paragraph'
import MarkdownTextarea from 'decentraland-gatsby/dist/components/Form/MarkdownTextarea'
import useFormatMessage from 'decentraland-gatsby/dist/hooks/useFormatMessage'
import useEditor, { assert, createValidator } from 'decentraland-gatsby/dist/hooks/useEditor'
import ContentLayout, { ContentSection } from '../../components/Layout/ContentLayout'
import { Governance } from '../../api/Governance'
import loader from '../../modules/loader'
import locations from '../../modules/locations'
import Label from 'decentraland-gatsby/dist/components/Form/Label'
import { asNumber } from '../../entities/Proposal/utils'
import useAuthContext from 'decentraland-gatsby/dist/context/Auth/useAuthContext'
import Head from 'decentraland-gatsby/dist/components/Head/Head'
import MarkdownNotice from '../../components/Form/MarkdownNotice'
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import './create.css'
import "../submitSnap.css"
import isEthereumAddress from 'validator/lib/isEthereumAddress'

type QuestState = {
  title: string,
  description: string,
  start_at: Date,
  finish_at: Date
}

const initialQuestState: QuestState = {
  title: '',
  description: '',
  start_at: new Date(),
  finish_at: new Date()
}


const edit = (state: QuestState, props: Partial<QuestState>) => {
  return {
    ...state,
    ...props,
  }
}

const schema = {
  title: {
    type: 'string',
    minLength: 5,
    maxLength: 200,
  },
  description: {
    type: 'string',
    minLength: 20,
    maxLength: 7000,
  }
}


const validate = createValidator<QuestState>({
  title: (state) => ({
    title: assert(state.title.length <= schema.title.maxLength, 'error.grant.title_too_large') ||
    undefined
  }),
  description: (state) => ({
    description: assert(state.description.length <= schema.description.maxLength, 'error.grant.description_too_large') ||
    undefined
  }),
  start_at: (state) => ({
    start_at: assert(state.start_at >= new Date(Date.now()-10), 'Invalid start date')
  }),
  finish_at: (state) => ({
    finish_at: assert(state.finish_at >= new Date(Date.now() -10) && state.finish_at > state.start_at, 'Invalid finish date')
  }),
  '*': (state) => ({
    title: (
      assert(state.title.length > 0, 'error.grant.title_empty') ||
      assert(state.title.length >= schema.title.minLength, 'error.grant.title_too_short') ||
      assert(state.title.length <= schema.title.maxLength, 'error.grant.title_too_large')
    ),
    description: (
      assert(state.description.length > 0, 'error.grant.description_empty') ||
      assert(state.description.length >= schema.description.minLength, 'error.grant.description_too_short') ||
      assert(state.description.length <= schema.description.maxLength, 'error.grant.description_too_large')
    ),
    start_at: (
      assert(state.start_at >= new Date(Date.now()-10), 'Invalid start date')
    ),
    finish_at: (
      assert(state.finish_at >= new Date(Date.now() -10) && state.finish_at > state.start_at, 'Invalid finish date')
    )
  })
})

export default function CreateQuest() {
  const l = useFormatMessage()
  const [ account, accountState ] = useAuthContext()
  const [ state, editor ] = useEditor(edit, validate, initialQuestState)
  const [imagePickerState, SetImagePickerState] = useState()

  useEffect(() => {
    const submitImage = async (image_id : string) => {

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
    }

    if (state.validated) {
      var image_id = uuidv4()

      submitImage(image_id);

      Governance.get()
        .createQuest({
          category: QuestCategory.Other,
          start_at: state.value.start_at,
          finish_at: state.value.finish_at,
          configuration: {
            image_id: image_id,
            title: state.value.title,
            description: state.value.description
          }
        })
        .then((quest) => {
          loader.quests.set(quest.id, quest)
          navigate(locations.quest(quest.id), { replace: true })
        })
        .catch((err) => {
          console.error(err, { ...err })
          editor.error({ '*': err.body?.error || err.message })
        })
    }
  }, [ state.validated ])

  if (accountState.loading) {
    return <Container className="WelcomePage">
      <div>
        <Loader size="huge" active/>
      </div>
    </Container>
  }

  if (!account) {
    return <Container>
      <Head
        title="{l('page.submit_grant.title') || ''}"
        description={l('page.submit_grant.description') || ''}
        image="https://decentraland.org/images/decentraland.png"
      />
      <SignIn isConnecting={accountState.selecting || accountState.loading} onConnect={() => accountState.select()} />
    </Container>
  }

  return <ContentLayout small>
    <Head
      title="{l('page.submit_grant.title') || ''}"
      description={l('page.submit_grant.description') || ''}
      image="https://decentraland.org/images/decentraland.png"
    />
    <Helmet title="{l('page.submit_grant.title') || ''}" />
    <ContentSection>
      <Header size="huge">Create a custom quest</Header>
    </ContentSection>
    {/* <ContentSection className="MarkdownSection--tiny">
      {l.markdown('page.submit_grant.description')}
    </ContentSection> */}
    <ContentSection>
      <Label>{l('page.submit_grant.title_label')}</Label>
      <Field
        value={state.value.title}
        placeholder="Enter a descriptive title for your quest"
        onChange={(_, { value }) => editor.set({ title: value })}
        onBlur={() => editor.set({ title: state.value.title.trim() })}
        error={!!state.error.title}
        message={
          l.optional(state.error.title) + ' ' +
          l('page.submit.character_counter', {
            current: state.value.title.length,
            limit: schema.title.maxLength
          })
        }
      />
    </ContentSection>
    <ContentSection>
      <Label>
        {l('page.submit_grant.description_label')}
        <MarkdownNotice />
      </Label>
      <MarkdownTextarea
        minHeight={175}
        value={state.value.description}
        placeholder="Enter Quest description"
        onChange={(_: any, { value }: any) => editor.set({ description: value })}
        onBlur={() => editor.set({ description: state.value.description.trim() })}
        error={!!state.error.description}
        message={
          l.optional(state.error.description) + ' ' +
          l('page.submit.character_counter', {
            current: state.value.description.length,
            limit: schema.description.maxLength
          })
        }
      />
    </ContentSection>
    <ContentSection>
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
          onChange={(image: any) => SetImagePickerState(image)}
        />
      )}
    </ContentSection>
    <ContentSection>
      <Label>Quest starting date</Label>
        <Field
          type="date"
          placeholder='Starting date'
          onChange={(_, { value }) => editor.set({ start_at: new Date(value) }, { validate: false })}
          error={!!state.error.start_at}
        />
    
      <Label>Quest finishing date</Label>
        <Field
          type="date"
          placeholder='Finish date'
          onChange={(_, { value }) => editor.set({ finish_at: new Date(value) }, { validate: false })}
          error={!!state.error.finish_at}
        />
    </ContentSection>
    <ContentSection>
      <Button primary disabled={state.validated} loading={state.validated} onClick={() => editor.validate()}>
        CREATE QUEST
      </Button>
    </ContentSection>
    {state.error['*'] && <ContentSection>
      <Paragraph small primary>{l(state.error['*']) || state.error['*']}</Paragraph>
    </ContentSection>}
  </ContentLayout>
}
