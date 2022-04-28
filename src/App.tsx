import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { NavMenuLink } from './navigation/Link'
import { Navigation } from './navigation/Navigation'
import { Resources } from './resources'
import { readResources } from './resources/redux'
import { useAppDispatch } from './store'

function App() {
  const dispatch = useAppDispatch()
  let location = useLocation()

  useEffect(() => {
    dispatch(readResources())
  }, [dispatch])

  return (
    <Navigation
      menu={
        <>
          <NavMenuLink to="/resources">Resources</NavMenuLink>
        </>
      }
    >
      <>
        {location.pathname === '/' && <Navigate to="/resources" />}
        <Routes>
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </>
    </Navigation>
  )
}

export default App
