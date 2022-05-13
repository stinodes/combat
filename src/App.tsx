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
          <NavMenuLink icon="user" to="/characters" />
          <NavMenuLink icon="box" to="/resources" />
        </>
      }
    >
      <>
        <Routes>
          <Route path="resources" element={<Resources />} />
          <Route path="characters/:characterId" element={<Character />} />
          <Route path="characters" element={<Overview />} />
        </Routes>
      </>
    </Navigation>
  )
}

export default App
