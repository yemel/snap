import React from 'react'
import TokenList from 'decentraland-gatsby/dist/utils/dom/TokenList'
import { isQuestStatus, QuestStatus } from '../../entities/Quest/types'
import './QuestStatusLabel.css'

const check = require('../../images/icons/check.svg')
const checkInvert = require('../../images/icons/check-invert.svg')

export type StatusLabelProps = React.HTMLAttributes<HTMLDivElement> & {
  status: QuestStatus
}

export default React.memo(function StatusLabel({ status, ...props }: StatusLabelProps) {
  status = isQuestStatus(status) ? status : QuestStatus.Pending
  return <div {...props} className={TokenList.join(['StatusLabel', `StatusLabel--${status}`, props.className])}>
    <span>{status}</span>
  </div>
})