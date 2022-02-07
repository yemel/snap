import React from 'react'
import { QuestCategory } from '../../entities/Quest/types'
import TokenList from 'decentraland-gatsby/dist/utils/dom/TokenList'

import './QuestCategoryLabel.css'

export type CategoryLabelProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  type: QuestCategory
}

export default React.memo(function CategoryLabel({ type, ...props }: CategoryLabelProps) {
  return <div
    {...props}
    className={TokenList.join([
      `CategoryLabel`,
      `CategoryLabel--${type}`
    ])}
  >
    <span>{type}</span>
  </div>
})