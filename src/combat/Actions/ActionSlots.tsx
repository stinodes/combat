import styled from '@emotion/styled'
import { Button, Flex, themeColor } from 'stinodes-ui'
import { ID } from '../../types/dnd'
import { useCombatApi, useFeatureUsage } from '../CombatContext'

const ActionSlot = styled(Button)<{ empty?: boolean }>`
  color: ${themeColor('typography.4')};
  border: 2px ${themeColor('typography.4')} solid;
  height: 24px;
  width: 24px;
  padding: 0;
  border-radius: 12px;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  text-shadow: ${themeColor('shadow')} 0 0 5px;
  margin-left: -12px;
`

type Props = {
  id: ID
}
export const ActionSlots = ({ id }: Props) => {
  const featureUsage = useFeatureUsage(id)
  const { consumeFeature, restoreFeature } = useCombatApi()
  if (!featureUsage) return null
  return (
    <Flex ml={12}>
      {new Array(featureUsage.max).fill(null).map((_, i, arr) => {
        return (
          <ActionSlot
            key={i}
            title="Right-click to restore"
            bg={arr.length - i > featureUsage.current ? 'surfaces.2' : 'reds.2'}
            onClick={() => consumeFeature(id)}
            onContextMenu={() => restoreFeature(id)}
          />
        )
      })}
    </Flex>
  )
}
