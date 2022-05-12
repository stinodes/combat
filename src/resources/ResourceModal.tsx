import styled from '@emotion/styled'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, H4, Modal, Text } from 'stinodes-ui'
import { dnd } from '../../types/resource'
import { resourceByIdSelector, resourcesByIdSelector } from './redux'

const Description = styled(Box)`
  .feature {
    margin-right: 8px;
    font-weight: bold;
  }
`

type ResourceModalProps = {
  id: null | dnd.ID
  onClose: () => any
}
export const ResourceModal = ({ id, onClose }: ResourceModalProps) => {
  const idRef = useRef(id)
  if (id) idRef.current = id

  const [loading, setLoading] = useState<boolean>(false)
  const [resource, setResource] = useState<null | dnd.Resource>(null)
  const [additionalResources, setAdditionalResources] = useState<
    dnd.Resource[]
  >([])

  const fetchResources = useCallback(
    async (id: string) => {
      setLoading(true)

      const resource = await window.api.resourceForId(id)

      if (!resource) return

      const additionalIds = resource.description
        ? Array.from(resource.description.matchAll(/element="([\w_]+)"/g)).map(
            match => match[1],
          )
        : []

      const additionalResources = await window.api.resourcesForIds(
        additionalIds,
      )

      setResource(resource)
      setAdditionalResources(additionalResources)

      setLoading(false)
    },
    [setResource, setAdditionalResources, setLoading],
  )

  useEffect(() => {
    id && fetchResources(id)
  }, [fetchResources, id])

  if (!resource) return null

  return (
    <Modal visible={!!id} onClose={onClose} width="90vw" maxWidth={924}>
      <Modal.Header>{resource.$.name}</Modal.Header>
      <Text color="surfaces.0" fontSize={12} alignSelf="flex-end">
        {resource.$.id}
      </Text>
      {resource.description && (
        <Box pb={2}>
          <Description
            dangerouslySetInnerHTML={{
              __html: resource.description
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#039;/g, "'"),
            }}
          />
        </Box>
      )}
      {additionalResources?.map(
        resource =>
          resource?.description && (
            <Box>
              <H4 fontSize={20}>{resource.$.name}</H4>
              <Description
                dangerouslySetInnerHTML={{
                  __html: resource.description
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#039;/g, "'"),
                }}
              />
            </Box>
          ),
      )}
    </Modal>
  )
}
