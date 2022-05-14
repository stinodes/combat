import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Flex, Spinner } from 'stinodes-ui'
import { Character } from './character'
import { useLoading } from './common/useLoading'
import { NavMenuLink } from './navigation/Link'
import { Navigation } from './navigation/Navigation'
import { Overview } from './overview'
import { Resources, RESOURCE_KEY } from './resources'

function App() {
  const [loading, fetch] = useLoading(window.api.load)
  useEffect(() => {
    fetch(localStorage.getItem(RESOURCE_KEY))
  }, [])

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
        {loading ? (
          <Flex p={3} flex={1} alignItems="center" justifyContent="center">
            <Spinner />
          </Flex>
        ) : (
          <Routes>
            <Route path="resources" element={<Resources />} />
            <Route path="characters/:characterId" element={<Character />} />
            <Route path="characters" element={<Overview />} />
          </Routes>
        )}
      </>
    </Navigation>
  )
}

export default App
