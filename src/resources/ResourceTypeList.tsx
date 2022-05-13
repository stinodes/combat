import { useEffect, useMemo, useState } from 'react'
import { Flex, FlexButton, Spinner } from 'stinodes-ui'
import { ResourceType } from '../types/dnd'

type ResourceTypeListProps = {
  selectedResourceType: null | ResourceType
  onSelect: (type: ResourceType) => any
}
export const ResourceTypeList = ({
  selectedResourceType,
  onSelect,
}: ResourceTypeListProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [types, setTypes] = useState<ResourceType[]>([])

  const sortedTypes = useMemo(
    () =>
      types.sort((a, b) => {
        if (a > b) return 1
        if (a < b) return -1
        return 0
      }),
    [types],
  )

  useEffect(() => {
    setLoading(true)
    window.api
      .resourceTypes()
      .then(t => setTypes(t))
      .then(() => setLoading(false))
  }, [])

  return (
    <Flex flexDirection="column">
      {loading ? (
        <Flex p={3} justifyContent="center">
          <Spinner />
        </Flex>
      ) : (
        sortedTypes.map(type => (
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
        ))
      )}
    </Flex>
  )
}
