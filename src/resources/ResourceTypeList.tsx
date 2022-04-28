import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Flex, FlexButton } from 'stinodes-ui'
import { dnd } from '../../types/resource'
import { resourceTypesSelector } from './redux'

type ResourceTypeListProps = {
  selectedResourceType: null | dnd.ResourceType
  onSelect: (type: dnd.ResourceType) => any
}
export const ResourceTypeList = ({
  selectedResourceType,
  onSelect,
}: ResourceTypeListProps) => {
  const types = useSelector(resourceTypesSelector)

  const sortedTypes = useMemo(
    () =>
      types.sort((a, b) => {
        if (a > b) return 1
        if (a < b) return -1
        return 0
      }),
    [types],
  )

  return (
    <Flex flexDirection="column">
      {sortedTypes.map(type => (
        <FlexButton
          key={type}
          bg={selectedResourceType === type ? 'primaries.2' : 'surfaces.4'}
          color="typography.4"
          px={2}
          py={1}
          onClick={() => onSelect(type)}
        >
          {type}
        </FlexButton>
      ))}
    </Flex>
  )
}
