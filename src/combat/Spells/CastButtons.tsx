import styled from '@emotion/styled'
import { Button, Flex, Text, themeColor } from 'stinodes-ui'
import { SpellSlotName } from '../../types/aurora'
import { useCombatApi, useSpellcasting } from '../CombatContext'

const CastButton = styled(Flex.withComponent(Button))`
  flex-shrink: 0;
  height: 24px;
  padding: 0;
  justify-content: center;
  align-items: center;
  border-radius: 0;
  color: ${themeColor('surfaces.4')};
  font-size: 12px;
  &:first-child,
  &:nth-child(7) {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  &:last-child,
  &:nth-child(6) {
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
  }

  &[disabled] {
    cursor: not-allowed;
    background-color: ${themeColor('surfaces.0')};
    border-color: ${themeColor('surfaces.0')};
  }
`

type CastButtonsProps = {
  minSlot: number
  className: string
}
export const CastButtons = ({ className, minSlot }: CastButtonsProps) => {
  const api = useCombatApi()
  const spellcasting = useSpellcasting()
  const classCasting = spellcasting[className].multiclass
    ? spellcasting.multiclass
    : spellcasting[className]
  const slots = Object.keys(classCasting.slots)
  const usableSlots = slots.filter(slotName => {
    const level = Number(slotName.replace('s', ''))
    if (level < minSlot) return false
    if (classCasting.slots[slotName as SpellSlotName].max === 0) return false
    return true
  })

  return (
    <Flex flexDirection="column">
      <Text fontSize={12} style={{ opacity: 0.5 }}>
        Use spellslot:
      </Text>
      <Flex flexWrap="wrap" mt={1}>
        {usableSlots.map(slot => (
          <CastButton
            width={1 / 6}
            disabled={classCasting.slots[slot as SpellSlotName].current === 0}
            onClick={() =>
              api.consumeSpellslot(classCasting.class, slot as SpellSlotName)
            }
          >
            {slot.replace('s', '')}
          </CastButton>
        ))}
      </Flex>
    </Flex>
  )
}
