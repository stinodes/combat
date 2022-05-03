import { Flex, H1, H3, Layout } from 'stinodes-ui'
import { useCombatState } from '../../combat/CombatContext'
import { usePreview } from '../../character/CharacterContext'
import { Bar } from './Bar'
import { Portrait } from './Portrait'
import { GlanceStats } from './GlanceStats'
import { useSelector } from 'react-redux'
import { resourcesPendingSelector } from '../../resources/redux'

export const UnitFrame = () => {
  const isLoading = useSelector(resourcesPendingSelector)
  const preview = usePreview()
  const { hp, maxHp } = useCombatState()

  if (isLoading)
    return (
      <Layout p={3} direction="row">
        <Portrait image={preview.portrait} />
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
        <Bar color="greens.3" total={maxHp} current={hp} showWarnings />

        <Flex mb={-5}>
          <GlanceStats />
        </Flex>
      </Layout>
    </Layout>
  )
}
