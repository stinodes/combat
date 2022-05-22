import styled from '@emotion/styled'
import { Card, themeColor } from 'stinodes-ui'
import Hooded from '../assets/hooded.jpeg'

type PortraitProps = {
  image: string
  size: number
}

export const Portrait = styled(Card)<PortraitProps>`
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  border-radius: ${p => p.size * 0.5}px;
  background-image: url(${p =>
    p.image ? `data:image/png;base64,${p.image}` : Hooded});
  background-size: cover;
  border: 2px ${themeColor('typography.4')} solid;
`

Portrait.defaultProps = {
  size: 200,
  shadow: true,
}
