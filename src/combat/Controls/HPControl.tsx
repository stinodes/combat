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

  const onChange = useCallback(
    (e: SyntheticEvent<HTMLInputElement, InputEvent>) => {
      const string = e.currentTarget.value

      if (e.nativeEvent.data === '-') return onDamage()
      if (e.nativeEvent.data === '+') return onHeal()

      if (!/(^\d*$)/.test(string)) return
      setValue(string)
    },
    [setValue, onDamage, onHeal],
  )

  return (
    <Flex flexDirection="column">
      <TextField type="numeric" value={value} onChange={onChange} width={104} />
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
      </Flex>
    </Flex>
  )
}
