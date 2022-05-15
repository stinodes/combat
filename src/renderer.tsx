import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { UIThemeProvider } from 'stinodes-ui'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { theme, globalStyles } from './theme'
import { Global } from '@emotion/react'

ReactDOM.render(
  <React.StrictMode>
    <UIThemeProvider theme={theme}>
      <Global styles={globalStyles} />
      <Suspense fallback={null}>
        <HashRouter>
          <App />
        </HashRouter>
      </Suspense>
    </UIThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
