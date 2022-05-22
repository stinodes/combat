import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { ComponentPropsWithoutRef, useState } from 'react'
import { Flex } from 'stinodes-ui'

const fade = keyframes`
  0% {
      opacity: 0
  }
  100% {
      opacity: 1;
  }
`

type Props = {
  delay?: number
  faded?: boolean
}
const FC = styled(Flex)<Props>`
  opacity: ${props => (props.faded ? 1 : 0)};
  animation: ${fade} 0.5s ${props => props.delay || 0}s ease-out;
`

export const FadeContainer = (props: ComponentPropsWithoutRef<typeof FC>) => {
  const [hasFaded, setHasFaded] = useState(false)

  return (
    <FC {...props} faded={hasFaded} onAnimationEnd={() => setHasFaded(true)} />
  )
}
