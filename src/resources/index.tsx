import { useState } from 'react'
import { Flex, Layout } from 'stinodes-ui'
import { dnd } from '../../types/resource'
import { ResourceList } from './ResourceList'
import { ResourceModal } from './ResourceModal'
import { ResourceSelector } from './ResourceSelector'
import { ResourceTypeList } from './ResourceTypeList'

export const Resources = () => {
  const [selectedResourceType, selectResourceType] =
    useState<null | dnd.ResourceType>(null)

  const [selectedResource, selectResource] = useState<null | dnd.ID>(null)

  return (
    <Layout direction="column" p={3} pb={0} spacing={2} flex={1}>
      <ResourceSelector />
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
      </Flex>
      <ResourceModal
        id={selectedResource}
        onClose={() => selectResource(null)}
      />
    </Layout>
  )
}
