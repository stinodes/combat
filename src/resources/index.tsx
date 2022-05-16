import { useEffect, useState } from 'react'
import { Flex, Layout, Spinner } from 'stinodes-ui'
import { useLoading } from '../common/useLoading'
import { ID, ResourceType } from '../types/dnd'
import { ResourceList } from './ResourceList'
import { ResourceModal } from './ResourceModal'
import { ResourceTypeList } from './ResourceTypeList'

export const RESOURCE_KEY = 'resource-dir'

export const Resources = () => {
  const [selectedResourceType, selectResourceType] =
    useState<null | ResourceType>(null)

  const [selectedResource, selectResource] = useState<null | ID>(null)

  const [loading, loadPath] = useLoading(window.api.load)

  useEffect(() => {
    loadPath()
  }, [loadPath])

  return (
    <Layout direction="column" p={3} pb={0} spacing={2} flex={1}>
      {loading ? (
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      ) : (
        <Flex flex={1} style={{ overflow: 'hidden' }}>
          <Flex flex={1} style={{ overflow: 'auto' }}>
            <ResourceTypeList
              selectedResourceType={selectedResourceType}
              onSelect={selectResourceType}
            />
          </Flex>
          <Flex flex={2} style={{ overflow: 'auto' }}>
            {selectedResourceType && (
              <ResourceList
                type={selectedResourceType}
                onSelect={selectResource}
              />
            )}
          </Flex>
          <ResourceModal
            id={selectedResource}
            onClose={() => selectResource(null)}
          />
        </Flex>
      )}
    </Layout>
  )
}
