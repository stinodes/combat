import { useEffect, useState } from 'react'
import { Button, Flex, Icon, Layout, Paragraph, TextField } from 'stinodes-ui'
import { FadeContainer } from '../common/FadeContainer'
import { IntroButton } from './IntroButton'
import { IntroTitle } from './IntroTitle'

export const SetUp = ({ next }: { next: () => void }) => {
  const [path, setPath] = useState('')

  const onSubmit = async () => {
    const settings = await window.api.settings()
    await window.api.saveSettings({ ...settings, path })
    next()
  }

  useEffect(() => {
    window.api.path().then(path => setPath(path || ''))
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
            <IntroButton
              disabled={!path}
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
