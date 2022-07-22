/*import React from 'react'
import { Dropdown } from 'decentraland-ui/dist/components/Dropdown/Dropdown'
import useFormatMessage from 'decentraland-gatsby/dist/hooks/useFormatMessage'
import intl from '../../intl/en.json'
import { QuestCategory } from '../../entities/Quest/types'

export type CategoryMenu = {
  style?: React.CSSProperties,
  value?: QuestCategory | null,
  onChange?: (e: React.MouseEvent<any>, props: { value: QuestCategory | null }) => void,
}

export default function CategoryMenu(props: CategoryMenu) {
  const l = useFormatMessage()
  function handleChange(e: React.MouseEvent<any>, value: QuestCategory | null) {
    if (props.onChange) {
      props.onChange(e, { value })
    }
  }

  return <Dropdown text={l(`quest_category.${type}_title`)intl.quest_category[props.value || QuestCategory.Event] } style={props.style}>
    <Dropdown.Menu>
      <Dropdown.Item text={intl.quest_category[QuestCategory.Event]} onClick={(e) => handleChange(e, QuestCategory.Event)} />
      <Dropdown.Item text={intl.quest_category[QuestCategory.PointOfInterest]} onClick={(e) => handleChange(e, QuestCategory.PointOfInterest)} />
      <Dropdown.Item text={intl.quest_category[QuestCategory.Other]} onClick={(e) => handleChange(e, QuestCategory.Other)} />
    </Dropdown.Menu>
  </Dropdown>
}*/