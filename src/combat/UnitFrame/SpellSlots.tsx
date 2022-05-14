import styled from '@emotion/styled'
import { Button, Flex, Layout, Text, themeColor } from 'stinodes-ui'
import { SpellSlotName } from '../../types/aurora'
import { useCombatApi, useSpellcasting } from '../CombatContext'

const Label = styled(Text)`
  font-weight: bold;
  font-size: 14px;
  width: 52px;
  border-bottom: ${themeColor('typography.4')} 2px solid;
  text-shadow: ${themeColor('shadow')} 0 0 5px;
`
const SpellSlot = styled(Button)<{ empty?: boolean }>`
  color: ${themeColor('typography.4')};
  border: 2px ${themeColor('typography.4')} solid;
  height: 32px;
  width: 32px;
  padding: 0;
  border-radius: 16px;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  text-shadow: ${themeColor('shadow')} 0 0 5px;
  margin-left: -16px;
`

export const SpellSlots = () => {
  const spellcasting = useSpellcasting()
  const api = useCombatApi()

  if (!spellcasting) return null

  let renderedMulticlass = false

  const onSpellSlotUse = (className: string, level: SpellSlotName) => {
    api.consumeSpellslot(className, level)
  }
  const onSpellSlotRestore = (className: string, level: SpellSlotName) => {
    api.restoreSpellslot(className, level)
  }

  return (
    <Layout spacing={2} direction="row">
      {Object.keys(spellcasting).map(className => {
        const sc = spellcasting[className]
        if (sc.multiclass && renderedMulticlass) return null
        if (sc.multiclass && !renderedMulticlass) renderedMulticlass = true
        return (
          <Layout direction="row" alignItems="center" key={sc.class}>
            <Label>{sc.multiclass ? 'Multiclass' : sc.class}</Label>
            <Layout direction="row" spacing={3}>
              {Object.keys(sc.slots).map(key => {
                if (!sc.slots[key as SpellSlotName].max) return null
                return (
                  <Flex key={key}>
                    {new Array(sc.slots[key as SpellSlotName].max)
                      .fill(null)
                      .map((_, i, arr) => {
                        return (
                          <SpellSlot
                            key={i}
                            title="Right-click to restore"
                            bg={
                              arr.length - i >
                              sc.slots[key as SpellSlotName].current
                                ? 'surfaces.2'
                                : 'blues.2'
                            }
                            onContextMenu={() =>
                              onSpellSlotRestore(
                                className,
                                key as SpellSlotName,
                              )
                            }
                            onClick={() =>
                              onSpellSlotUse(className, key as SpellSlotName)
                            }
                          >
                            {i === arr.length - 1 ? key.replace('s', '') : ''}
                          </SpellSlot>
                        )
                      })}
                  </Flex>
                )
              })}
            </Layout>
          </Layout>
        )
      })}
    </Layout>
  )
}
