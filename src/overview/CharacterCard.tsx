import { Card, Flex, Text } from 'stinodes-ui'
import Hooded from '../assets/hooded.jpeg'
import { dnd } from '../../types/resource'

type CharacterCardProps = { character: dnd.CharacterPreview }
export const CharacterCard = ({ character }: CharacterCardProps) => {
  return (
    <Card
      height={200}
      style={{
        backgroundImage: character.portrait
          ? `url(data:image/png;base64,${character.portrait})`
          : `url(${Hooded})`,
        backgroundSize: 'cover',
      }}
      shadow
      alignItems="flex-end"
    >
      <Flex
        flexDirection="column"
        p={1}
        flex={1}
        style={{
          backgroundImage:
            'linear-gradient(to top, rgba(0, 0, 0, .5), rgba(0, 0, 0, .3) 70%, rgba(0, 0, 0, 0))',
        }}
      >
        <Text fontSize={20} fontWeight="bold">
          {character.name}
        </Text>
        <Text fontSize={14}>{character.class}</Text>
      </Flex>
    </Card>
  )
}
