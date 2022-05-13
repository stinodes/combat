import { css } from '@emotion/react'
import { shade, tint } from 'polished'
import { convertToDark, createTheme, themeColor } from 'stinodes-ui'

import './assets/icons.css'
import FEATHER from './assets/feather.ttf'
import M_REGULAR from './assets/Montserrat/Montserrat-Regular.ttf'
import M_SEMIB from './assets/Montserrat/Montserrat-SemiBold.ttf'
import M_BOLD from './assets/Montserrat/Montserrat-Bold.ttf'

const createColorGradient = (color: string) => [
  shade(0.6, color),
  shade(0.3, color),
  color,
  tint(0.3, color),
  tint(0.6, color),
]

const reds = createColorGradient('#CA2B30')
const yellows = createColorGradient('#FFA62B')
const darks = createColorGradient('#1A1423')

const text = createColorGradient('#fcfeff')

export const theme = convertToDark(
  createTheme({
    colors: {
      reds,
      yellows,
      darks,
      text,
      primaries: reds,
      primary: reds[2],
    },
  }),
)

export const globalStyles = css`
  html,
  body {
    margin: 0;
    padding: 0;
  }
  * {
    scrollbar-width: thin;
    scrolbar-color: ${themeColor('surfaces.0', theme)};
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: ${themeColor('surfaces.0', theme)};
    }
  }

  @font-face {
    font-family: 'feather';
    src: url(${FEATHER}) format('truetype');
  }
  @font-face {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 400;
    src: url(${M_REGULAR}) format('truetype');
  }
  @font-face {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    src: url(${M_SEMIB}) format('truetype');
  }
  @font-face {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 600;
    src: url(${M_BOLD}) format('truetype');
  }
`
