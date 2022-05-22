import styled from '@emotion/styled'
import { Flex, themeColor } from 'stinodes-ui'

export const IntroButton = styled(Flex.withComponent('button'))`
  outline: none;
  border: none;
  background: transparent;
  cursor: pointer;

  align-items: center;

  font-weight: 600;
  font-size: 28px;
  color: ${themeColor('surfaces.0')};
  transition: color 0.2s ease;

  &[disabled] {
    cursor: not-allowed;
  }
  :hover:not([disabled]) {
    color: ${themeColor('primary')};
  }

  i {
    font-size: inherit;
    margin-left: 24px;
  }
`
