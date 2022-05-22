import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { H1 } from 'stinodes-ui'

const titleFade = keyframes`
  0% {
      transform: translateY(-50%);
      opacity: 0;
  }
  100% {
      transform: translateY(0);
      opacity: 1;
  }
`

export const IntroTitle = styled(H1)`
  font-size: 42px;
  animation: ${titleFade} 0.5s ease-out;
`
