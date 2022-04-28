import { dialog } from 'electron'

export const handleDirOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}
