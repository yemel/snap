import React from 'react'
import { Dropdown } from 'decentraland-ui/dist/components/Dropdown/Dropdown'
import useFormatMessage from 'decentraland-gatsby/dist/hooks/useFormatMessage'
import { QuestStatus } from '../../entities/Quest/types'

export type StatusMenu = {
  style?: React.CSSProperties,
  value?: QuestStatus | null,
  onChange?: (e: React.MouseEvent<any>, props: { value: QuestStatus | null }) => void,
}

export default function StatusMenu(props: StatusMenu) {
  const l = useFormatMessage()
  function handleChange(e: React.MouseEvent<any>, value: QuestStatus | null) {
    if (props.onChange) {
      props.onChange(e, { value })
    }
  }

  return <Dropdown text={l(`quest_status.${props.value || 'all'}`) || ''} style={props.style}>
    <Dropdown.Menu>
      <Dropdown.Item text={l(`quest_status.all`)} onClick={(e) => handleChange(e, null)} />
      <Dropdown.Item text={l(`quest_status.${QuestStatus.Pending}`)} onClick={(e) => handleChange(e, QuestStatus.Pending)} />
      <Dropdown.Item text={l(`quest_status.${QuestStatus.Active}`)} onClick={(e) => handleChange(e, QuestStatus.Active)} />
      <Dropdown.Item text={l(`quest_status.${QuestStatus.Finished}`)} onClick={(e) => handleChange(e, QuestStatus.Finished)} />
    </Dropdown.Menu>
  </Dropdown>
}