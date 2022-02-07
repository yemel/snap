import React from "react"
import { Header } from "decentraland-ui/dist/components/Header/Header"

// import useFeatureFlagContext from "decentraland-gatsby/dist/context/FeatureFlag/useFeatureFlagContext"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import ContentLayout, { ContentSection } from "../../components/Layout/ContentLayout"
import Head from "decentraland-gatsby/dist/components/Head/Head"
import Paragraph from "decentraland-gatsby/dist/components/Text/Paragraph"
import CategoryBanner from "../../components/Quest/CategoryBanner"
import { ProposalType } from "../../entities/Proposal/types"
import {QuestCategory } from "../../entities/Quest/types"
import locations from "../../modules/locations"
// import { FeatureFlags } from "../../modules/features"
import './create.css'

export default function NewQuestPage() {
  const l = useFormatMessage()
  // const [ ff ] = useFeatureFlagContext()

  return <>
  <Head
    title={l('page.create.title') || ''}
    description={l('page.create.description') || ''}
    image="https://decentraland.org/images/decentraland.png"
  />
  <ContentLayout className="ProposalDetailPage">
    <ContentSection>
      <Header size="huge">{l('page.create.title')} &nbsp;</Header>
      <Paragraph>{l('page.create.description') || ''}</Paragraph>
    </ContentSection>
    <ContentSection>
      <CategoryBanner type={QuestCategory.Event} href={locations.createQuest(QuestCategory.Event)} active />
      <CategoryBanner type={QuestCategory.PointOfInterest} href={locations.createQuest(QuestCategory.PointOfInterest)} active />
      <CategoryBanner type={QuestCategory.Other} href={locations.createQuest(QuestCategory.Other)} active />
    </ContentSection>
  </ContentLayout>
  </>
}
