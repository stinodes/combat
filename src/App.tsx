import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Flex, Spinner } from 'stinodes-ui'
import { Character } from './character'
import { useLoading } from './common/useLoading'
import { NavMenuLink } from './navigation/Link'
import { Navigation } from './navigation/Navigation'
import { Onboarding } from './onboarding'
import { Overview } from './overview'
import { Resources } from './resources'
import { Settings } from './settings'

function App() {
  const [loading, fetch] = useLoading(window.api.load)
  useEffect(() => {
    fetch()
  }, [])

  return (
    <Navigation
      menu={
        <>
          <NavMenuLink icon="user" to="/characters" />
          <NavMenuLink icon="box" to="/resources" />
          <Flex flex={1} />
          <NavMenuLink icon="settings" to="/settings" />
        </>
      }
    >
      <>
        {loading ? (
          <Flex p={3} flex={1} alignItems="center" justifyContent="center">
            <Spinner />
          </Flex>
        ) : (
          <Routes>
            <Route path="resources" element={<Resources />} />
            <Route path="characters/:characterId" element={<Character />} />
            <Route path="characters" element={<Overview />} />
            <Route path="settings" element={<Settings />} />
            <Route path="/" element={<Onboarding />} />
          </Routes>
        )}
      </>
    </Navigation>
  )
}

export default App
