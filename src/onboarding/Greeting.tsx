import { Flex, Icon, Layout } from 'stinodes-ui'
import { FadeContainer } from '../common/FadeContainer'
import { IntroButton } from './IntroButton'
import { IntroTitle } from './IntroTitle'

export const Greeting = ({ next }: { next: () => void }) => {
  return (
    <Flex p={3} alignItems="center">
      <Layout spacing={2}>
        <IntroTitle fontSize={42}>Welcome</IntroTitle>
        <FadeContainer delay={0.5}>
          <IntroButton onClick={next}>
            Are you ready for battle?
            <Icon icon="arrow-right" />
          </IntroButton>
        </FadeContainer>
      </Layout>
    </Flex>
  )
}
