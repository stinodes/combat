import styled from '@emotion/styled'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, H4, Modal, Text } from 'stinodes-ui'
import { useLoading } from '../common/useLoading'
import { ID, Resource } from '../types/dnd'

const Description = styled(Box)`
  .feature {
    margin-right: 8px;
    font-weight: bold;
  }
`

type ResourceModalProps = {
  id: null | ID
  onClose: () => any
}
export const ResourceModal = ({ id, onClose }: ResourceModalProps) => {
  const idRef = useRef(id)
  if (id) idRef.current = id

  const [resource, setResource] = useState<null | Resource>(null)
  const [additionalResources, setAdditionalResources] = useState<Resource[]>([])

  const [_, fetchResources] = useLoading(
    useCallback(
      async (id: string) => {
        const resource = await window.api.resourceForId(id)

        if (!resource) return

        const additionalIds = resource.description
          ? Array.from(
              resource.description.matchAll(/element="([\w_]+)"/g),
            ).map(match => match[1])
          : []

        const additionalResources = await window.api.resourcesForIds(
          additionalIds,
        )

        setResource(resource)
        setAdditionalResources(additionalResources)
      },
      [setResource, setAdditionalResources],
    ),
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
