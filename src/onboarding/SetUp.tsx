import { SyntheticEvent, useEffect, useState } from 'react'
import {
  Button,
  Flex,
  Icon,
  Layout,
  Paragraph,
  TextAreaField,
  TextField,
} from 'stinodes-ui'
import { FadeContainer } from '../common/FadeContainer'
import { INDEXES_REGEX } from '../settings'
import { IntroButton } from './IntroButton'
import { IntroTitle } from './IntroTitle'

export const SetUp = ({ next }: { next: () => void }) => {
  const [path, setPath] = useState('')
  const [indexes, setIndexes] = useState('')

  const onSubmit = async () => {
    if (!INDEXES_REGEX.test(indexes)) return

    const settings = await window.api.settings()
    await window.api.saveSettings({
      ...settings,
      path,
      indexes: indexes.split('\n'),
    })
    next()
  }

  useEffect(() => {
    window.api.settings().then(settings => {
      setPath(settings.path || '')
      setIndexes(settings.indexes?.join('\n') || '')
    })
  }, [])

  return (
    <Flex p={3} alignItems="center" flex={1}>
      <Layout spacing={3} flex={1}>
        <IntroTitle>Set Up</IntroTitle>
        <FadeContainer delay={0.5} flexDirection="column">
          <Layout spacing={1} maxWidth={642}>
            <Flex alignItems="flex-end">
              <Flex flex={1} flexDirection="column">
                <TextField
                  label="Resource Folder"
                  value={path}
                  onChange={() => {}}
                />
              </Flex>
              <Button
                onClick={async () => {
                  const path = await window.api.openDir()
                  setPath(path)
                }}
              >
                <Icon icon="folder" />
              </Button>
            </Flex>
            <Paragraph color="surfaces.0">
              Select the folder containing your Aurora Resource files. This is
              needed to feed your character sheet with the necessary data.
            </Paragraph>

            <Flex pb={2} />

            <TextAreaField
              label="Index URLs"
              style={{ height: 100 }}
              value={indexes}
              onChange={(e: SyntheticEvent<HTMLTextAreaElement>) =>
                setIndexes(e.currentTarget.value)
              }
              placeholder={`Linebreak-separated indexes here.`}
            />
            <Paragraph color="surfaces.0">
              Alternatively, enter a list of *.index files (generally hosted on
              github). These will be downloaded at start-up to be used.
            </Paragraph>

            <Flex pb={2} />

            <IntroButton
              disabled={!path && !indexes}
              onClick={onSubmit}
              title={!path ? 'Select your resource folder first.' : undefined}
            >
              Continue
              <Icon icon="arrow-right" />
            </IntroButton>
          </Layout>
        </FadeContainer>
      </Layout>
    </Flex>
  )
}
