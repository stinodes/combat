import styled from '@emotion/styled'
import { Card, Flex, Icon, Text, themeColor } from 'stinodes-ui'
import Hooded from '../assets/hooded.jpeg'
import { CharacterPreview } from '../types/character'

const DeleteButton = styled.button`
  outline: none;
  border: none;
  background: none;

  position: absolute;
  top: 4px;
  right: 4px;

  opacity: 0.5;
  color: ${themeColor('typography.4')};
  text-shadow: rgba(0, 0, 0, 0.3) 0 2px 3px;

  cursor: pointer;

  transition: opacity 0.2s ease, color 0.2s ease;
  :hover {
    color: ${themeColor('primary')};
    opacity: 1;
  }
`

type CharacterCardProps = {
  character: CharacterPreview
  onDelete: (id: string) => void
}
export const CharacterCard = ({ character, onDelete }: CharacterCardProps) => {
  return (
    <Card
      height={200}
      style={{
        backgroundImage: character.portrait
          ? `url(data:image/png;base64,${character.portrait})`
          : `url(${Hooded})`,
        backgroundSize: 'cover',
        position: 'relative',
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
      <DeleteButton
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          onDelete(character.id)
        }}
      >
        <Icon icon="trash" />
      </DeleteButton>
    </Card>
  )
}
