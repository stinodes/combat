import { Button, Flex, H3, Icon, Layout, Text } from 'stinodes-ui'
import { useCombatLog, useCombatUndo } from '../CombatContext'

type Props = { width?: number | string }
export const Log = (props: Props) => {
  const undo = useCombatUndo()
  const log = useCombatLog()
  return (
    <Layout px={3} width={props.width || 250}>
      <H3>Combat Log</H3>
      {!log.length && (
        <Flex py={3}>
          <Text fontSize={12} color="surfaces.0">
            Nothing's happened yet
          </Text>
        </Flex>
      )}
      {log.map(cl => (
        <Layout
          direction="row"
          spacing={2}
          key={cl.meta.id}
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize={12}>
            {(() => {
              switch (cl.type) {
                case 'combat/damage':
                  return `Took ${cl.payload} damage`
                case 'combat/heal':
                  return `Healed for ${cl.payload}`
                case 'combat/consumeSpellslot':
                  return `Used a ${cl.payload.class} level ${cl.payload.slot[1]} spell.`
              }
            })()}
          </Text>
          <Button size="small" onClick={() => undo(cl)} bg="surfaces.4">
            <Icon icon="x" color="primary" />
          </Button>
        </Layout>
      ))}
    </Layout>
  )
}
