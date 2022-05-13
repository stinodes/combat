import styled from '@emotion/styled'
import { Flex, Layout, Text, themeColor } from 'stinodes-ui'
import { useCharacter } from '../../character/CharacterContext'
import { AbilityScore } from '../../types/character'

const StatText = styled(Text)<{ label?: boolean }>`
  ${props => (props.label ? `margin-right: 4px;` : `font-weight: bold;`)}
  font-size: 10px;
  text-shadow: ${themeColor('shadow')} 0 0 5px;
`
export const GlanceStats = () => {
  const character = useCharacter()

  if (!character) return null

  const abilityScores = Object.values(AbilityScore).map(score => ({
    name: score,
    value: character.getStat(score + ':modifier'),
  }))

  return (
    <Layout spacing={1}>
      <Layout direction="row" spacing={3}>
        {abilityScores.map(score => (
          <Flex alignItems="center" key={score.name}>
            <StatText label>{score.name}</StatText>
            <StatText>
              {(score.value || 0) >= 0 ? '+' : ''}
              {score.value}
            </StatText>
          </Flex>
        ))}
      </Layout>

      <Layout direction="row" spacing={3}>
        <Flex alignItems="center">
          <StatText label>proficiency</StatText>
          <StatText>+{character.getStat('proficiency')}</StatText>
        </Flex>
        <Flex alignItems="center">
          <StatText label>initiative</StatText>
          <StatText>+{character.getStat('initiative')}</StatText>
        </Flex>
        <Flex alignItems="center">
          <StatText label>ac</StatText>
          <StatText>{character.getStat('ac:calculation')}</StatText>
        </Flex>
        <Flex alignItems="center">
          <StatText label>speed</StatText>
          <StatText>{character.getStat('speed')} ft.</StatText>
        </Flex>
      </Layout>
    </Layout>
  )
}
