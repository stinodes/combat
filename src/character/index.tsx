import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Flex, Layout, Spinner } from 'stinodes-ui'
import { CombatProvider } from '../combat/CombatContext'
import { Controls } from '../combat/Controls'
import { Log } from '../combat/Log'
import { UnitFrame } from '../combat/UnitFrame'
import { CharacterProvider } from './CharacterContext'
import { resourcesPendingSelector } from '../resources/redux'

export const Character = () => {
  const urlParams = useParams()
  const isLoading = useSelector(resourcesPendingSelector)
  return (
    <CharacterProvider id={urlParams.characterId as string}>
      <CombatProvider>
        <Flex flex={1} flexDirection="column">
          <UnitFrame />
          {isLoading ? (
            <Flex alignItems="center" justifyContent="center">
              <Spinner size={64} />
            </Flex>
          ) : (
            <Layout spacing={3} px={2} direction="row" pt={5}>
              <Flex flexDirection="column" pl={162}>
                <Controls />
              </Flex>
              <Flex flexDirection="column">
                <Log width={400} />
              </Flex>
            </Layout>
          )}
        </Flex>
      </CombatProvider>
    </CharacterProvider>
  )
}
