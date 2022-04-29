import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Character } from './character'
import { NavMenuLink } from './navigation/Link'
import { Navigation } from './navigation/Navigation'
import { Overview } from './overview'
import { Resources } from './resources'
import { readResources } from './resources/redux'
import { useAppDispatch } from './store'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(readResources())
  }, [dispatch])

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
