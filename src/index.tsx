import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { createTheme, UIThemeProvider } from 'stinodes-ui'
import { Router } from 'react-navi'
import './index.css'
import App from './App'
import { routes } from './navigation/routes'
import { shade, tint } from 'polished'

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

const surface = darks.reverse()
const text = createColorGradient('#fcfeff')

ReactDOM.render(
  <React.StrictMode>
    <UIThemeProvider
      theme={createTheme({
        colors: {
          reds,
          yellows,
          darks,
          text,
          surface,
          primaries: reds,
          primary: reds[2],
        },
      })}
    >
      <Suspense fallback={null}>
        <Router routes={routes}>
          <App />
        </Router>
      </Suspense>
    </UIThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
