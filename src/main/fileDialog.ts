import { dialog } from 'electron'

export const handleDirOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })
  if (canceled) {
    return null
  } else {
    return filePaths[0]
  }
}

export const handleFileOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: '', extensions: ['dnd5e'] }],
  })
  if (canceled) {
    return null
  } else {
    return filePaths[0]
  }
}
