import { H1, H3, Layout } from 'stinodes-ui'
import { useCharacter, useCombatState, usePreview } from '../CharacterContext'
import { Bar } from './Bar'
import { Portrait } from './Portrait'

export const UnitFrame = () => {
  const preview = usePreview()
  const character = useCharacter()
  const { hp } = useCombatState()

  if (!character) return null

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
        <Bar color="greens.3" total={character.hp} current={hp} showWarnings />
      </Layout>
    </Layout>
  )
}
