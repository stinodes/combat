import { SyntheticEvent, useCallback, useState } from 'react'
import { Button, Flex, Icon, TextField } from 'stinodes-ui'
import { useStat } from '../../character/CharacterContext'
import { useCombatApi, useCombatState } from '../../combat/CombatContext'

export const HPControl = () => {
  const maxHp = useStat('hp') || 0
  const { hp } = useCombatState()
  const [value, setValue] = useState<string>('')
  const api = useCombatApi()

  const onDamage = useCallback(() => {
    const number = Number(value)
    const result = Math.max(hp - number, 0)
    const actualDamage = hp - result
    api.damage(actualDamage)
    setValue('')
  }, [setValue, api, value, hp])

  const onHeal = useCallback(() => {
    const number = Number(value)
    const result = Math.min(hp + number, maxHp)
    const actualHeal = result - hp
    api.heal(actualHeal)
    setValue('')
  }, [setValue, api, value, hp, maxHp])

  const onShield = useCallback(() => {
    const number = Number(value)
    api.shield(number)
    setValue('')
  }, [setValue, api, value, hp, maxHp])

  const onChange = useCallback(
    (e: SyntheticEvent<HTMLInputElement, InputEvent>) => {
      const string = e.currentTarget.value

      if (e.nativeEvent.data === '-') return onDamage()
      if (e.nativeEvent.data === '+') return onHeal()
      if (e.nativeEvent.data === 's') return onShield()
      if (e.nativeEvent.data === 't') return onShield()

      if (!/(^\d*$)/.test(string)) return
      setValue(string)
    },
    [setValue, onDamage, onHeal, onShield],
  )

  return (
    <Flex flexDirection="column" flex={0}>
      <TextField type="numeric" value={value} onChange={onChange} width={150} />
      <Flex>
        <Flex flex={1} flexDirection="column">
          <Button
            onClick={onDamage}
            bg="surfaces.4"
            color="reds.2"
            size="small"
            title="Shortcut: -"
          >
            <Icon icon="minus" />
          </Button>
        </Flex>
        <Flex flex={1} flexDirection="column">
          <Button
            onClick={onHeal}
            bg="surfaces.4"
            color="greens.2"
            size="small"
            title="Shortcut: +"
          >
            <Icon icon="plus" />
          </Button>
        </Flex>
        <Flex flex={1} flexDirection="column">
          <Button
            onClick={onShield}
            bg="surfaces.4"
            color="typography.2"
            size="small"
            title="Shortcut: s, t"
          >
            <Icon icon="circle" />
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}
