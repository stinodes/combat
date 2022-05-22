import styled from '@emotion/styled'
import { Button, Flex, Layout, Text, themeColor } from 'stinodes-ui'
import { useAdditionalResources } from '../../character/CharacterContext'
import { SpellSlotName } from '../../types/aurora'
import { useCombatApi, useFeatures, useSpellcasting } from '../CombatContext'

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
  const features = useFeatures()
  const additionalResources = useAdditionalResources()
  const api = useCombatApi()

  if (!spellcasting && !additionalResources.length) return null

  const onSpellSlotUse = (className: string, level: SpellSlotName) => {
    api.consumeSpellslot(className, level)
  }
  const onSpellSlotRestore = (className: string, level: SpellSlotName) => {
    api.restoreSpellslot(className, level)
  }

  const onFeatureUse = (stat: string) => {
    api.consumeFeature(stat)
  }
  const onFeatureRestore = (stat: string) => {
    api.restoreFeature(stat)
  }

  return (
    <Layout spacing={2} direction="row">
      {spellcasting &&
        Object.keys(spellcasting).map(className => {
          const sc = spellcasting[className]
          if (sc.multiclass) return null
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

      {additionalResources.map(resource => {
        const usage = features[resource.name]
        if (!usage || !usage.max) return null
        return (
          <Layout direction="row" alignItems="center" key={resource.name}>
            <Label>{resource.label}</Label>
            {new Array(usage.max).fill(null).map((_, i, arr) => {
              return (
                <SpellSlot
                  key={i}
                  title="Right-click to restore"
                  bg={
                    arr.length - i > usage.current
                      ? 'surfaces.2'
                      : resource.color
                  }
                  onContextMenu={() => onFeatureRestore(resource.name)}
                  onClick={() => onFeatureUse(resource.name)}
                />
              )
            })}
          </Layout>
        )
      })}
    </Layout>
  )
}
