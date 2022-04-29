import { handleFileOpen } from '../fileDialog'
import fs from 'fs'
import { parseStringPromise } from 'xml2js'
import { v4 } from 'uuid'

export const createCharacterPreview = async () => {
  const filePath = await handleFileOpen()
  if (!filePath) return null

  const file = await fs.promises.readFile(filePath, { encoding: 'utf8' })
  const doc = await parseStringPromise(file)
  return {
    path: filePath,
    name: doc.character['display-properties'][0].name[0],
    class: doc.character['display-properties'][0].class[0],
    portrait: doc.character['display-properties'][0].portrait[0].base64[0],
    id: v4(),
  }
}

export const openCharacter = async (_: any, path: string) => {
  const file = await fs.promises.readFile(path, { encoding: 'utf8' })
  const doc = await parseStringPromise(file)
  return doc.character
}
