import React from 'react'
import { navigate } from 'gatsby-plugin-intl'
import Paragraph from 'decentraland-gatsby/dist/components/Text/Paragraph'
import useFormatMessage from 'decentraland-gatsby/dist/hooks/useFormatMessage'
import { QuestCategory } from '../../entities/Quest/types'
import TokenList from 'decentraland-gatsby/dist/utils/dom/TokenList'

import './CategoryBanner.css'

const icons = {
  [QuestCategory.Event]: require('../../images/icons/pin.svg'),
  [QuestCategory.PointOfInterest]: require('../../images/icons/poi.svg'),
  [QuestCategory.Other]: require('../../images/icons/poll.svg')
}

export type CategoryBannerProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
  active?: boolean
  type: QuestCategory
}

export default React.memo(function CategoryBanner({ active, type, ...props }: CategoryBannerProps) {
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

  return <a
    {...props}
    onClick={handleClick}
    className={TokenList.join([
      `CategoryBanner`,
      `CategoryBanner--${type}`,
      active && `CategoryBanner--active`
    ])}
  >
    <div className="CategoryBanner__Icon">
      <img src={icons[type]} width="48" height="48" />
    </div>
    <div className="CategoryBanner__Description">
      <Paragraph small semiBold>{l(`quest_category.${type}_title`)}</Paragraph>
      <Paragraph tiny>{l(`quest_category.${type}_description`)}</Paragraph>
    </div>
  </a>
})