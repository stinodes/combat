import { useCallback, useEffect, useState } from 'react'
import { Button, Flex, Layout, Spinner, TextField } from 'stinodes-ui'
import { dnd } from '../../types/resource'
import { ResourceList } from './ResourceList'
import { ResourceModal } from './ResourceModal'
import { ResourceTypeList } from './ResourceTypeList'

const KEY = 'resource-dir'

export const Resources = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [path, setPath] = useState<string>(localStorage.getItem(KEY) || '')
  const [selectedResourceType, selectResourceType] =
    useState<null | dnd.ResourceType>(null)

  const [selectedResource, selectResource] = useState<null | dnd.ID>(null)

  const selectPath = async () => {
    const path = await window.api.openDir()
    setPath(path)
  }

  const loadPath = useCallback(
    async (path: string) => {
      setLoading(true)
      await window.api.load(path)
      localStorage.setItem(KEY, path)
      setLoading(false)
    },
    [setLoading],
  )

  useEffect(() => {
    loadPath(path)
  }, [loadPath, path])

  return (
    <Layout direction="column" p={3} pb={0} spacing={2} flex={1}>
      <Layout direction="row" spacing={2} alignItems="flex-end">
        <Flex flex={1} flexDirection="column">
          <TextField
            disabled={loading}
            label="Resource Folder"
            onFocus={selectPath}
            value={path}
            onChange={() => {}}
          />
        </Flex>
        <Button loading={loading} onClick={loadPath}>
          Yes!
        </Button>
      </Layout>
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
