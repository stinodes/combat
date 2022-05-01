import { useParams } from 'react-router-dom'
import { Flex } from 'stinodes-ui'
import { CharacterProvider } from './CharacterContext'
import { Controls } from './Controls'
import { UnitFrame } from './UnitFrame'

export const Character = () => {
  const urlParams = useParams()
  return (
    <CharacterProvider id={urlParams.characterId as string}>
      <Flex flex={1} flexDirection="column">
        <UnitFrame />
        <Controls />
      </Flex>
    </CharacterProvider>
  )
}
