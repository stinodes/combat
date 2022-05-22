import { useState } from 'react'
import { Flex, Icon, Layout } from 'stinodes-ui'
import { FadeContainer } from '../common/FadeContainer'
import { CharacterPreview } from '../types/character'
import { IntroButton } from './IntroButton'
import { IntroTitle } from './IntroTitle'
import { Preview } from './Preview'

export const SelectCharacter = ({ next }: { next: (id: string) => void }) => {
  const [preview, setPreview] = useState<null | CharacterPreview>(null)
  const addCharacter = async () => {
    const preview = await window.api.createPreview()
    setPreview(preview)
  }

  return (
    <Flex p={3} alignItems="center">
      <Layout spacing={2}>
        <IntroTitle fontSize={42}>Your character</IntroTitle>

        {!preview ? (
          <FadeContainer key="select" delay={0.5} flexDirection="column">
            <IntroButton onClick={addCharacter}>
              Select file <Icon icon="upload" />
            </IntroButton>
          </FadeContainer>
        ) : (
          <FadeContainer key="preview" delay={3}>
            <Layout spacing={5}>
              <Preview preview={preview} />
              <IntroButton onClick={() => next(preview.id)}>
                To battle
                <Icon icon="arrow-right" />
              </IntroButton>
            </Layout>
          </FadeContainer>
        )}
      </Layout>
    </Flex>
  )
}
