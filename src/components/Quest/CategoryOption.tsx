import Paragraph from 'decentraland-gatsby/dist/components/Text/Paragraph'
import useFormatMessage from 'decentraland-gatsby/dist/hooks/useFormatMessage'
import TokenList from 'decentraland-gatsby/dist/utils/dom/TokenList'
import { QuestCategory } from '../../entities/Quest/types'
import React from 'react'

import './CategoryOption.css'
import { navigate } from 'gatsby-plugin-intl'

export type CategoryOptionProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
  active?: boolean
  type: QuestCategory | 'all'
}

const icons = {
  all: require('../../images/icons/all.svg'),
  [QuestCategory.Event]: require('../../images/icons/pin.svg'),
  [QuestCategory.PointOfInterest]: require('../../images/icons/poi.svg'),
  [QuestCategory.Other]: require('../../images/icons/poll.svg')
}

export default React.memo(function CategoryOption({ active, type, className, ...props }: CategoryOptionProps) {
  const l = useFormatMessage()
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (props.onClick) {
      props.onClick(e)
    }

    if(!e.defaultPrevented) {
      e.preventDefault()

      if (props.href) {
        navigate(props.href)
      }
    }
  }

  return <a {...props} onClick={handleClick} className={TokenList.join([
    'CategoryOption',
    `CategoryOption--${type}`,
    active && 'CategoryOption--active',
    className
  ])}>
    <span><img src={icons[type]} width="24" height="24" /></span>
    <span><Paragraph tiny semiBold>{l(`quest_category.${type}_title`)}</Paragraph></span>
  </a>
})