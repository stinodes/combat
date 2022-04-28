import fs from 'fs'
import { dnd } from '../../types/resource'
import { parseString } from 'xml2js'

const parseXml = <R extends {}>(xml: string) =>
  new Promise<R>((resolve, reject) =>
    parseString(xml, (error, v) => (error ? reject(error) : resolve(v))),
  )

export const parseResources = async (_: any, path: string) => {
  const fileNames = await recursivelyLoadFileNames(path)

  const parsedFiles = await Promise.all(fileNames.map(readFile))

  return indexResources(parsedFiles)
}

const recursivelyLoadFileNames = async (dirPath: string): Promise<string[]> => {
  const fileNames = (await fs.promises.readdir(dirPath)).map(
    name => `${dirPath}/${name}`,
  )
  const stats = await Promise.all(
    fileNames.map(fileName => fs.promises.lstat(fileName)),
  )
  const subDirs = fileNames.filter((_, i) => stats[i].isDirectory())
  const xmls = fileNames.filter(fileName => /\.xml$/.test(fileName))
  const subXmls = await Promise.all(
    subDirs.map(path => recursivelyLoadFileNames(path)),
  )

  const allFiles = subXmls.reduce((prev, v) => prev.concat(v), xmls)
  return allFiles
}

const readFile = async (path: string) => {
  const content = (await fs.promises.readFile(path, {
    encoding: 'utf8',
  })) as string

  const doc = await parseXml<{ elements: { element: dnd.Resource[] } }>(content)
  const elementsMarkup = content
    .replace(/<\/?elements>/, '')
    .split('</element>')

  const descriptions = elementsMarkup.map(element => {
    const arr = element.split(/<\/?description>/)

    if (arr.length >= 3) return arr[1]
    return null
  })

  doc.elements.element?.forEach((el, i) => {
    if (el.description) el.description = descriptions[i]
  })

  return doc
}

const indexResources = (
  resources: { elements: { element: dnd.Resource[] } }[],
) => {
  return resources.reduce(
    (prev, { elements: { element } }) => {
      element &&
        element.forEach(el => {
          prev.resources[el.$.id] = el
          if (!prev.typeIndex[el.$.type]) prev.typeIndex[el.$.type] = []
          prev.typeIndex[el.$.type].push(el.$.id)
        })
      return prev
    },
    { resources: {}, typeIndex: {} } as dnd.ResourceDB,
  )
}
