import { Card, Flex, H4, Layout, PopOut, Text } from 'stinodes-ui'
import { useCharacter } from '../../character/CharacterContext'
import { replaceStats } from '../../character/stats'
import { Description } from '../../common/Description'
import { Action } from '../../types/character'
import { ActionSlots } from './ActionSlots'

type Props = {
  action: Action
}
export const ActionCard = ({ action }: Props) => {
  const character = useCharacter()
  return (
    <PopOut
      trigger="hover"
      content={
        <Card bg="surfaces.3" width={300} p={2}>
          <Description text={replaceStats(character, action.tooltip)} />
        </Card>
      }
    >
      <Card p={2} bg="surfaces.2" border="surfaces.1" shadow flex={1}>
        <Layout flex={1} spacing={1}>
          <H4 textAlign="center">{action.name}</H4>
          {(!!action.usage || !!action.reset) && (
            <Flex height={1} bg="surfaces.1" mx={-2} />
          )}
          {!!action.action && (
            <Text textAlign="center" fontSize={12}>
              {action.action}
            </Text>
          )}
          {!!action.usage && (
            <Flex justifyContent="center">
              <ActionSlots id={action.id} />
            </Flex>
          )}
          {!!action.reset && (
            <Text textAlign="center" fontSize={12}>
              Per {action.reset.toLowerCase()}
            </Text>
          )}
        </Layout>
      </Card>
    </PopOut>
  )
}
