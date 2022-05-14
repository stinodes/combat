import { useCallback, useEffect, useMemo, useState } from 'react'
import { Flex, FlexButton, Spinner } from 'stinodes-ui'
import { useLoading } from '../common/useLoading'
import { ID, Resource, ResourceType } from '../types/dnd'

type ResourceListProps = {
  type: ResourceType
  onSelect: (id: ID) => any
}
export const ResourceList = ({ type, onSelect }: ResourceListProps) => {
  const [resources, setResources] = useState<Resource[]>([])

  const [loading, fetchResources] = useLoading(
    useCallback(async () => {
      setResources(await window.api.resourcesForType(type))
    }, [setResources]),
  )

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

  useEffect(() => {
    fetchResources()
  }, [type])

  return (
    <Flex flexDirection="column" flex={1}>
      {loading ? (
        <Flex p={3} justifyContent="center">
          <Spinner />
        </Flex>
      ) : (
        sortedResources.map(resource => (
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
        ))
      )}
    </Flex>
  )
}
