import { useParams } from 'react-router-dom'
import { Accordeon, Flex, H4, Layout, Spinner } from 'stinodes-ui'
import { Actions } from '../combat/Actions'
import { CombatProvider } from '../combat/CombatContext'
import { Controls } from '../combat/Controls'
import { Log } from '../combat/Log'
import { Spells } from '../combat/Spells'
import { UnitFrame } from '../combat/UnitFrame'
import { Tabs } from '../common/Tabs'
import { CharacterProvider, useCharacterLoading } from './CharacterContext'

export const Character = () => {
  const urlParams = useParams()
  const isLoading = useCharacterLoading()
  return (
    <CharacterProvider id={urlParams.characterId as string}>
      <CombatProvider>
        <Flex flex={1} flexDirection="column">
          <UnitFrame />
          <Flex justifyContent="flex-end" pr={3} mt={-5}>
            <Controls />
          </Flex>
          {isLoading ? (
            <Flex alignItems="center" justifyContent="center">
              <Spinner size={64} />
            </Flex>
          ) : (
            <Flex flexDirection="column" spacing={3} px={2} direction="row">
              <Tabs>
                <Tabs.Tab title="Overview" hash="overview">
                  <Flex justifyContent="center" flex={1}>
                    <Layout
                      spacing={3}
                      pt={4}
                      direction="column"
                      flex={1}
                      maxWidth={1400}
                    >
                      <Accordeon
                        header={
                          <Flex justifyContent="center" py={2}>
                            <H4>Features & Traits</H4>
                          </Flex>
                        }
                      >
                        <Actions />
                      </Accordeon>
                      <Accordeon
                        header={
                          <Flex justifyContent="center" py={2}>
                            <H4>Spells</H4>
                          </Flex>
                        }
                      >
                        <Spells />
                      </Accordeon>
                    </Layout>
                  </Flex>
                </Tabs.Tab>
                <Tabs.Tab title="Combat Log" hash="log">
                  <Log />
                </Tabs.Tab>
              </Tabs>
            </Flex>
          )}
        </Flex>
      </CombatProvider>
    </CharacterProvider>
  )
}
