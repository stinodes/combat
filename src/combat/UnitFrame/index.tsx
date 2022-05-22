import { Flex, H1, H3, Layout, Spinner } from 'stinodes-ui'
import { useCombatState } from '../../combat/CombatContext'
import {
  useCharacterLoading,
  usePreview,
} from '../../character/CharacterContext'
import { Bar } from './Bar'
import { GlanceStats } from './GlanceStats'
import { SpellSlots } from './SpellSlots'
import { Portrait } from '../../common/Portrait'

export const UnitFrame = () => {
  const isLoading = useCharacterLoading()
  const preview = usePreview()
  const { hp, maxHp, shield } = useCombatState()

  if (!preview || isLoading)
    return (
      <Layout p={3} direction="row">
        <Spinner />
      </Layout>
    )

  return (
    <Layout p={3} direction="row">
      <Portrait image={preview.portrait} />
      <Layout
        flex={1}
        flexDirection="column"
        justifyContent="flex-end"
        spacing={1}
        pb={3}
        ml={-5}
      >
        <Layout spacing={3} ml={5} pl={2} direction="row" alignItems="flex-end">
          <H1 mb="-4px" style={{ fontSize: 42 }}>
            {preview.name}
          </H1>
          <H3 color="surfaces.0">{preview.class}</H3>
        </Layout>
        <Bar
          color="greens.3"
          max={maxHp}
          current={hp}
          extra={shield}
          showWarnings
        />
        <SpellSlots />

        <Flex mb={-5}>
          <GlanceStats />
        </Flex>
      </Layout>
    </Layout>
  )
}
