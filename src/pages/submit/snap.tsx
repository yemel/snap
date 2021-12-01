import React, { useEffect } from 'react'
import Helmet from 'react-helmet'
import { navigate } from "gatsby-plugin-intl"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Header } from "decentraland-ui/dist/components/Header/Header"
import { Field } from "decentraland-ui/dist/components/Field/Field"
import { Container } from "decentraland-ui/dist/components/Container/Container"
import { Loader } from "decentraland-ui/dist/components/Loader/Loader"
import { SignIn } from "decentraland-ui/dist/components/SignIn/SignIn"
import { SelectField } from "decentraland-ui/dist/components/SelectField/SelectField"
import { isProposalGrantCategory, isProposalGrantTier, newProposalGrantScheme, ProposalGrantCategory, ProposalGrantTier } from '../../entities/Proposal/types'
import { SnapCategory } from '../../entities/Snap/types'
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
import './submit.css'
import isEthereumAddress from 'validator/lib/isEthereumAddress'

type SnapState = {
  title: string,
  abstract: string,
  category: string | null,
  tier: string | null,
  size: string | number,
  beneficiary: string,
  description: string,
  specification: string,
  personnel: string,
  roadmap: string
}

const initialPollState: SnapState = {
  title: '',
  abstract: '',
  category: null,
  tier: null,
  size: '',
  beneficiary: '',
  description: '',
  specification: '',
  personnel: '',
  roadmap: ''
}

const categories = [
  { key: ProposalGrantCategory.Community, text: ProposalGrantCategory.Community, value: ProposalGrantCategory.Community },
  { key: ProposalGrantCategory.ContentCreator, text: ProposalGrantCategory.ContentCreator, value: ProposalGrantCategory.ContentCreator },
  { key: ProposalGrantCategory.Gaming, text: ProposalGrantCategory.Gaming, value: ProposalGrantCategory.Gaming },
  { key: ProposalGrantCategory.PlatformContributor, text: ProposalGrantCategory.PlatformContributor, value: ProposalGrantCategory.PlatformContributor },
]

const tiers = [
  { key: ProposalGrantTier.Tier1, text: ProposalGrantTier.Tier1, value: ProposalGrantTier.Tier1 },
  { key: ProposalGrantTier.Tier2, text: ProposalGrantTier.Tier2, value: ProposalGrantTier.Tier2 },
  { key: ProposalGrantTier.Tier3, text: ProposalGrantTier.Tier3, value: ProposalGrantTier.Tier3 },
]


export default function SubmitBanName() {
  const l = useFormatMessage()
  const [ account, accountState ] = useAuthContext()


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
        title={l('page.submit_grant.title') || ''}
        description={l('page.submit_grant.description') || ''}
        image="https://decentraland.org/images/decentraland.png"
      />
      <SignIn isConnecting={accountState.selecting || accountState.loading} onConnect={() => accountState.select()} />
    </Container>
  }

  return <ContentLayout small>
    <ContentSection>
      <Button primary onClick={() => Governance.get().createSnap({
            category: SnapCategory.IgPhoto,
            title: 'Snap test',
            description: 'Snap description',
            taken_at: '2020',
            x: 10,
            y: 10
          })}>
        {l('page.submit.button_submit')}
      </Button>
    </ContentSection>
  </ContentLayout>
}
