import { useEffect, useMemo, useState } from 'react'
import { Flex, FlexButton, Spinner } from 'stinodes-ui'
import { dnd } from '../../types/resource'

type ResourceListProps = {
  type: dnd.ResourceType
  onSelect: (id: dnd.ID) => any
}
export const ResourceList = ({ type, onSelect }: ResourceListProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [resources, setResources] = useState<dnd.Resource[]>([])

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
    setLoading(true)
    window.api
      .resourcesForType(type)
      .then(setResources)
      .then(() => setLoading(false))
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
