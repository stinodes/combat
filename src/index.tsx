import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import {
  createTheme,
  convertToDark,
  UIThemeProvider,
  themeColor,
} from 'stinodes-ui'
import { shade, tint } from 'polished'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './store'
import { css, Global } from '@emotion/react'
import { BrowserRouter } from 'react-router-dom'

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

const theme = convertToDark(
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

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <UIThemeProvider theme={theme}>
        <Global
          styles={css`
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
          `}
        />
        <Suspense fallback={null}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Suspense>
      </UIThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
