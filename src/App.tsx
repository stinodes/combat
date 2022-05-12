import { Route, Routes } from 'react-router-dom'
import { Character } from './character'
import { NavMenuLink } from './navigation/Link'
import { Navigation } from './navigation/Navigation'
import { Overview } from './overview'
import { Resources } from './resources'

function App() {
  return (
    <Navigation
      menu={
        <>
          <NavMenuLink to="/">Overview</NavMenuLink>
          <NavMenuLink to="/resources">Resources</NavMenuLink>
        </>
      }
    >
      <>
        <Routes>
          <Route path="resources" element={<Resources />} />
          <Route path=":characterId" element={<Character />} />
          <Route path="" element={<Overview />} />
        </Routes>
      </>
    </Navigation>
  )
}

export default App
