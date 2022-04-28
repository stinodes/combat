import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Flex, FlexButton } from 'stinodes-ui'
import { dnd } from '../../types/resource'
import { resourcesByTypeSelector } from './redux'

type ResourceListProps = {
  type: dnd.ResourceType
  onSelect: (id: dnd.ID) => any
}
export const ResourceList = ({ type, onSelect }: ResourceListProps) => {
  const resources = useSelector(resourcesByTypeSelector(type))

  const sortedResources = useMemo(
    () =>
      resources &&
      Object.values(resources).sort((a, b) => {
        if (a.$.name > b.$.name) return 1
        if (a.$.name < b.$.name) return -1
        return 0
      }),
    [resources],
  )

  return (
    <Flex flexDirection="column" flex={1}>
      {sortedResources.map(resource => (
        <FlexButton
          key={resource.$.id}
          bg="surfaces.4"
          color="typography.4"
          px={2}
          py={1}
          onClick={() => onSelect(resource.$.id)}
        >
          {resource.$.name}
        </FlexButton>
      ))}
    </Flex>
  )
}
