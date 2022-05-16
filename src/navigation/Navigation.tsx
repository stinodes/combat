import styled from '@emotion/styled'
import { ReactNode, useState } from 'react'
import { Button, Flex, H1, Icon, Layout, themeColor } from 'stinodes-ui'

const NAVBAR_HEIGHT = 80
const SIDEBAR_WIDTH = 80

const AppContainer = styled(Flex)`
  height: 100vh;
  width: 100vw;
  background-color: ${themeColor('surfaces.4')};
`

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
  background: ${themeColor('surfaces.4')};
  flex-direction: column;
`

const Content = styled(Flex)`
  flex: 1;
  overflow: auto;

  border-top: 2px solid ${themeColor('surfaces.2')};
  bborder-left: unset;
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}) {
    border-top: unset;
    border-left: 2px solid ${themeColor('surfaces.2')};
  }
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

export const Navigation = ({
  children,
  menu,
}: {
  children: ReactNode
  menu: ReactNode
}) => {
  const [showMenu, setShowMenu] = useState(false)
  // const show = !route.data?.hideNavigation
  const show = true

  return (
    <AppContainer>
      {show && showMenu && <Underlay onClick={() => setShowMenu(false)} />}
      {show && (
        <SideMenu show={showMenu} onClick={() => setShowMenu(false)}>
          <Flex justifyContent="center" height={150} />
          {menu}
        </SideMenu>
      )}
      <Layout flex={1}>
        {show && (
          <NavBar>
            <Flex width={100}>
              <Button
                size="circle"
                bg="surfaces.4"
                onClick={() => setShowMenu(true)}
              >
                <Icon icon="menu" color="text" size={24} />
              </Button>
            </Flex>
            <Flex flex={1} justifyContent="center">
              <H1 color="text">Combat</H1>
            </Flex>
            <Flex width={100} />
          </NavBar>
        )}
        <Content>{children}</Content>
      </Layout>
    </AppContainer>
  )
}
