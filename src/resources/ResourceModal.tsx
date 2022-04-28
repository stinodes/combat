import { useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Box, H4, Modal } from 'stinodes-ui'
import { dnd } from '../../types/resource'
import { resourceByIdSelector, resourcesByIdSelector } from './redux'

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
      {resource.description && (
        <Box pb={2}>
          <div dangerouslySetInnerHTML={{ __html: resource.description }} />
        </Box>
      )}
      {additionalResources?.map(
        resource =>
          resource?.description && (
            <Box>
              <H4 fontSize={20}>{resource.$.name}</H4>
              <div dangerouslySetInnerHTML={{ __html: resource.description }} />
            </Box>
          ),
      )}
    </Modal>
  )
}
