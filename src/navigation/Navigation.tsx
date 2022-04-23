import styled from '@emotion/styled'
import { ReactNode, useState } from 'react'
import { useCurrentRoute } from 'react-navi'
import { Button, Flex, H1, Icon, Layout, themeColor } from 'stinodes-ui'

const NAVBAR_HEIGHT = 80
const SIDEBAR_WIDTH = 240

const NavBar = styled(Flex)`
  height: ${NAVBAR_HEIGHT}px;
  align-items: center;
  background: ${themeColor('surface.4')};
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`

const SideMenu = styled(Flex)<{ show: boolean; fixed: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  transform: translateX(${({ show }) => (show ? '0%' : '-120%')});
  transition: transform 0.3s ease;
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}) {
    position: unset;
    transform: unset;
    transition: unset;
  }
  width: ${SIDEBAR_WIDTH}px;
  background: ${themeColor('surface.4')};
`

const Content = styled(Flex)`
  flex: 1;
  overflow: auto;
  border-top: 2px solid ${themeColor('surface.3')};
  border-left: 2px solid ${themeColor('surface.3')};
`

const Underlay = styled(Flex)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`

export const Navigation = ({ children }: { children: ReactNode }) => {
  const [showMenu, setShowMenu] = useState(false)
  const route = useCurrentRoute()
  const show = !route.data?.hideNavigation

  return (
    <Flex width="100vw" height="100vh" bg="surface.4">
      {show && showMenu && <Underlay onClick={() => setShowMenu(false)} />}
      {show && <SideMenu show={showMenu}></SideMenu>}
      <Layout flex={1}>
        {show && (
          <NavBar>
            <Flex width={100}>
              <Button
                size="circle"
                bg="surface.4"
                onClick={() => setShowMenu(true)}
              >
                <Icon icon="menu" color="primary" size={24} />
              </Button>
            </Flex>
            <Flex flex={1} justifyContent="center">
              <H1 color="primary">{route.title || 'Dungeon Notes'}</H1>
            </Flex>
            <Flex width={100} />
          </NavBar>
        )}
        <Content>{children}</Content>
      </Layout>
    </Flex>
  )
}
