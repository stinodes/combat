import { SyntheticEvent, useCallback, useState } from 'react'
import { Button, Flex, Icon, TextField } from 'stinodes-ui'
import { useCombatApi } from '../../combat/CombatContext'

export const HPControl = () => {
  const [value, setValue] = useState<string>('')
  const api = useCombatApi()

  const onDamage = useCallback(() => {
    api.damage(Number(value))
    setValue('')
  }, [setValue, api, value])

  const onHeal = useCallback(() => {
    api.heal(Number(value))
    setValue('')
  }, [setValue, api, value])

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
    <Flex p={2} flexDirection="column">
      <TextField type="numeric" value={value} onChange={onChange} width={104} />
      <Flex>
        <Flex flex={1} flexDirection="column">
          <Button
            onClick={onDamage}
            bg="surfaces.4"
            color="reds.2"
            size="small"
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
          >
            <Icon icon="plus" />
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}
