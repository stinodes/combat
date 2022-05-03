import styled from '@emotion/styled'
import { useMemo, useRef } from 'react'
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

  const resource = useSelector(resourceByIdSelector(idRef.current))

  const additionalResourceIds = useMemo(() => {
    if (!resource?.description) return []
    const finds = Array.from(
      resource.description.matchAll(/element="([\w_]+)"/g),
    ).map(match => match[1])
    return finds
  }, [resource])

  const additionalResources = useSelector(
    resourcesByIdSelector(additionalResourceIds),
  )

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
