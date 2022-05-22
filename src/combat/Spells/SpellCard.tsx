import styled from '@emotion/styled'
import {
  Card,
  Flex,
  Col,
  H4,
  Layout,
  PopOut,
  Row,
  Text,
  themeColor,
  Button,
  Accordeon,
} from 'stinodes-ui'
import { useCharacter } from '../../character/CharacterContext'
import { replaceStats } from '../../character/stats'
import { Description } from '../../common/Description'
import { Spell } from '../../types/character'
import { CastButtons } from './CastButtons'

const SpellCardContainer = styled(Card)`
  flex: 1;
  position: relative;
  flex-direction: column;
`
const SpellComponents = styled(Flex)`
  position: absolute;
  right: 0;
  top: 0;
  color: ${themeColor('typography.0')};
  opacity: 0.5;
  font-size: 12px;
`

type SpellCardProps = {
  spell: Spell
  class: string
}

export const SpellCard = ({ spell, class: className }: SpellCardProps) => {
  const character = useCharacter()

  return (
    <PopOut
      trigger="hover"
      content={
        <Card bg="surfaces.3" width={300} p={2}>
          <Description text={replaceStats(character, spell.description)} />
        </Card>
      }
    >
      <SpellCardContainer bg="surfaces.2" border="surfaces.1" shadow pt={1}>
        <Accordeon
          header={
            <Layout flex={1} spacing={1} p={2}>
              <H4 textAlign="center">{spell.name}</H4>
              <Text fontSize={12}>{className} spell</Text>

              <Flex mx={-2} height={1} bg="surfaces.1" my={1} />

              <Row gutter={1} alignItems="center">
                <Col width={1 / 2} gutter={1}>
                  <Text textAlign="center" fontSize={12}>
                    {spell.action}
                  </Text>
                </Col>
                <Col width={1 / 2} gutter={1}>
                  <Text textAlign="center" fontSize={12}>
                    {spell.duration}
                  </Text>
                </Col>
              </Row>
            </Layout>
          }
        >
          <Layout flex={1} spacing={1} pb={2}>
            <Flex height={1} bg="surfaces.1" my={1} />
            <Flex px={3} flexDirection="column">
              <CastButtons minSlot={spell.slotLevel} className={className} />
            </Flex>
          </Layout>
        </Accordeon>

        <SpellComponents p={1}>
          {spell.isConcentration && (
            <Text color="reds.2" mr="3px">
              C
            </Text>
          )}
          {spell.isVerbal && 'V '}
          {spell.isSomatic && 'S '}
          {spell.isMaterial && 'M '}
          {spell.isRitual && 'R '}
        </SpellComponents>
      </SpellCardContainer>
    </PopOut>
  )
}
