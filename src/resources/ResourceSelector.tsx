import { SyntheticEvent } from 'react'
import { useSelector } from 'react-redux'
import { Button, Flex, Layout, TextField } from 'stinodes-ui'
import { useAppDispatch } from '../store'
import {
  readResources,
  resourcePathSelector,
  resourcesPendingSelector,
  setResourcePath,
} from './redux'

export const ResourceSelector = () => {
  const dispatch = useAppDispatch()
  const dir = useSelector(resourcePathSelector)
  const isLoading = useSelector(resourcesPendingSelector)

  const onSelect = async (e: SyntheticEvent<HTMLInputElement, FocusEvent>) => {
    e.currentTarget.blur()
    const result = await window.api.openDir()
    if (result) dispatch(setResourcePath(result))
  }

  const submit = () => {
    dispatch(readResources())
  }

  return (
    <Layout direction="row" spacing={2} alignItems="flex-end">
      <Flex flex={1} flexDirection="column">
        <TextField
          disabled={resourcesPendingSelector}
          label="Resource Folder"
          onFocus={onSelect}
          value={dir}
          onChange={() => {}}
        />
      </Flex>
      <Button loading={isLoading} onClick={submit}>
        Yes!
      </Button>
    </Layout>
  )
}
