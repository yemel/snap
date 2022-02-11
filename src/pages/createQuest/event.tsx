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
import { newProposalCatalystScheme } from '../../entities/Proposal/types'
import Paragraph from 'decentraland-gatsby/dist/components/Text/Paragraph'
import MarkdownTextarea from 'decentraland-gatsby/dist/components/Form/MarkdownTextarea'
import Label from 'decentraland-gatsby/dist/components/Form/Label'
import useFormatMessage from 'decentraland-gatsby/dist/hooks/useFormatMessage'
import useEditor, { assert, createValidator } from 'decentraland-gatsby/dist/hooks/useEditor'
import ContentLayout, { ContentSection } from '../../components/Layout/ContentLayout'
import { Governance } from '../../api/Governance'
import locations from '../../modules/locations'
import loader from '../../modules/loader'
import Catalyst, { Servers } from 'decentraland-gatsby/dist/utils/api/Catalyst'
import isEthereumAddress from 'validator/lib/isEthereumAddress'
import { isValidDomainName } from '../../entities/Proposal/utils'
import useAsyncMemo from 'decentraland-gatsby/dist/hooks/useAsyncMemo'
import useAuthContext from 'decentraland-gatsby/dist/context/Auth/useAuthContext'
import Head from 'decentraland-gatsby/dist/components/Head/Head'
import MarkdownNotice from '../../components/Form/MarkdownNotice'
import './create.css'
import { QuestCategory } from '../../entities/Quest/types'
import { start } from 'repl'

type EventQuestStatus = {
  description: string,
  start_at: Date,
  finish_at: Date,
}

const initialQuestState: EventQuestStatus = {
  description: '',
  start_at: new Date(),
  finish_at: new Date(),
}

const edit = (state: EventQuestStatus, props: Partial<EventQuestStatus>) => {
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

const validate = createValidator<EventQuestStatus>({
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

export default function SubmitEventQuest() {
  const l = useFormatMessage()
  const [ events, setEvents ] = useState<any>()
  const [ selectedEvent, setSelectedEvent ] = useState<any>()
  const [ startDate, setStartDate ] = useState(new Date())
  const [ finishDate, setFinishDate ] = useState(new Date())
  const [ account, accountState ] = useAuthContext()
  const [ state, editor ] = useEditor(edit, validate, initialQuestState)


  useEffect(() => {
    async function fetchEvents() {
      let events = await fetch('https://events.decentraland.org/api/events').then(res => res.json())
      setSelectedEvent(events.data[0])
      setEvents(events.data)
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    if (state.validated) {
      Governance.get()
        .createQuest({
          category: QuestCategory.Event,
          start_at: state.value.start_at,
          finish_at: state.value.finish_at,
          configuration: {
            event_id: selectedEvent.id,
            title: selectedEvent.name,
            image_url: selectedEvent.image,
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
        title={'Create an Event quest' || ''}
        description={'Create an Event quest' || ''}
        image="https://decentraland.org/images/decentraland.png"
      />
      <SignIn isConnecting={accountState.selecting || accountState.loading} onConnect={() => accountState.select()} />
    </Container>
  }

  return <ContentLayout small>
    <Head
      title={'Create an Event quest' || ''}
      description={'Create an Event quest' || ''}
      image="https://decentraland.org/images/decentraland.png"
    />
    <Helmet title={'Create an Event quest' || ''} />
    <ContentSection>
      <Header size="huge">Create an Event quest</Header>
    </ContentSection>
    <ContentSection>
      <Paragraph small>Create a quest based on a Decentraland event. Events data is gathered from event.decentraland.org</Paragraph>
    </ContentSection>
    <ContentSection>
      <Label>Choose the event</Label>
      { events && events.length > 0 &&
        <Autocomplete
          disablePortal
          id="events-autocomplete"
          value={selectedEvent}
          onChange={(event, newSelectedEvent) => {
            if(newSelectedEvent){
              setSelectedEvent(newSelectedEvent);
            }
          }}
          options={events}
          getOptionLabel={option => {
            return option.name && option.start_at ? option.name + ' ( Starting ' + new Date(option.start_at).toISOString().split('T')[0]  +' )' : ''
          }}
          
          renderInput={(params) => <TextField {...params} label="event" variant="standard" />}
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
