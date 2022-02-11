import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { navigate } from 'gatsby-plugin-intl'
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Header } from "decentraland-ui/dist/components/Header/Header"
import { Field } from "decentraland-ui/dist/components/Field/Field"
import { Container } from "decentraland-ui/dist/components/Container/Container"
import { Loader } from "decentraland-ui/dist/components/Loader/Loader"
import { Autocomplete } from '@mui/material'
import { TextField } from '@mui/material'
import { SignIn } from "decentraland-ui/dist/components/SignIn/SignIn"
import Paragraph from 'decentraland-gatsby/dist/components/Text/Paragraph'
import Label from 'decentraland-gatsby/dist/components/Form/Label'
import useFormatMessage from 'decentraland-gatsby/dist/hooks/useFormatMessage'
import useEditor, { assert, createValidator } from 'decentraland-gatsby/dist/hooks/useEditor'
import ContentLayout, { ContentSection } from '../../components/Layout/ContentLayout'
import { Governance } from '../../api/Governance'
import Land from 'decentraland-gatsby/dist/utils/api/Land'
import MarkdownTextarea from 'decentraland-gatsby/dist/components/Form/MarkdownTextarea'
import MarkdownNotice from '../../components/Form/MarkdownNotice'
import locations from '../../modules/locations'
import loader from '../../modules/loader'
import useAuthContext from 'decentraland-gatsby/dist/context/Auth/useAuthContext'
import Head from 'decentraland-gatsby/dist/components/Head/Head'
import './create.css'
import useAsyncMemo from 'decentraland-gatsby/dist/hooks/useAsyncMemo'
import { QuestCategory } from '../../entities/Quest/types'
import Catalyst from "decentraland-gatsby/dist/utils/api/Catalyst"

type POIQuestStatus = {
  start_at: Date,
  finish_at: Date,
  description: string
}

const initialQuestState: POIQuestStatus = {
  start_at: new Date(),
  finish_at: new Date(),
  description: ''
}

const edit = (state: POIQuestStatus, props: Partial<POIQuestStatus>) => {
  return {
    ...state,
    ...props
  }
}

const schema = {
  description: {
    type: 'string',
    minLength: 20,
    maxLength: 7000,
  }
}

const validate = createValidator<POIQuestStatus>({
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

export default function SubmitPOIQuest() {
  const l = useFormatMessage()
  const [ POIs, setPOIs ] = useState<any>()
  const [ selectedPoi, setSelectedPoi ] = useState<any>()
  const [ startDate, setStartDate ] = useState(new Date())
  const [ finishDate, setFinishDate ] = useState(new Date())
  const [ account, accountState ] = useAuthContext()
  const [ state, editor ] = useEditor(edit, validate, initialQuestState)


  useEffect(() => {
    async function fetchPOIs() {
      const pois = await Catalyst.get().getPOIs()
      let poiTiles: any = await Promise.all(pois.map(async poi => {
       return await Land.get().getTile(poi)
      }))

      setSelectedPoi(poiTiles[0])
      setPOIs(poiTiles)
    }

    fetchPOIs()
  }, [])

  useEffect(() => {
    if (state.validated) {
      Governance.get()
        .createQuest({
          category: QuestCategory.PointOfInterest,
          start_at: state.value.start_at,
          finish_at: state.value.finish_at,
          configuration: {
            poi_location_x: selectedPoi.x,
            poi_location_y: selectedPoi.y,
            title: selectedPoi.name,
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
        title={'Create a POI quest' || ''}
        description={'Create a POI quest' || ''}
        image="https://decentraland.org/images/decentraland.png"
      />
      <SignIn isConnecting={accountState.selecting || accountState.loading} onConnect={() => accountState.select()} />
    </Container>
  }

  return <ContentLayout small>
    <Head
      title={'Create a POI quest' || ''}
      description={'Create a POI quest' || ''}
      image="https://decentraland.org/images/decentraland.png"
    />
    <Helmet title={'Create a POI quest' || ''} />
    <ContentSection>
      <Header size="huge">Create a POI quest</Header>
    </ContentSection>
    <ContentSection>
      <Paragraph small>Create a quest based on a Decentraland point of interest. Events data is gathered from event.decentraland.org</Paragraph>
      
    </ContentSection>
    <ContentSection>
      <Label>Choose the Point of Interest</Label>
      { POIs && POIs.length > 0 &&
        <Autocomplete
          disablePortal
          id="pois-autocomplete"
          value={selectedPoi}
          onChange={(event, newSelectedPoi) => {
            if(newSelectedPoi){
              setSelectedPoi(newSelectedPoi);
            }
          }}
          options={POIs}
          getOptionLabel={option => {
            return `${option.name || ''} ( ${option.x},${option.y} )`
          }}
          
          renderInput={(params) => <TextField {...params} label="poi" variant="standard" />}
        />
      }
      
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
      <Button primary
        disabled={state.validated}
        loading={state.validated}
        onClick={() => editor.validate()}
      >
        Create Quest
      </Button>
    </ContentSection>
    {state.error['*'] && <ContentSection>
      <Paragraph small primary>{l(state.error['*']) || state.error['*']}</Paragraph>
    </ContentSection>}
  </ContentLayout>
}
