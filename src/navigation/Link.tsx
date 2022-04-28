import styled from '@emotion/styled'
import { ComponentPropsWithoutRef } from 'react'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import { FlexButton, themeColor } from 'stinodes-ui'

export const StyledNavMenuLink = styled(FlexButton.withComponent(Link))`
  text-decoration: none;
  font-size: 18px;
  &.active {
    background-color: ${themeColor('text')};
    color: ${themeColor('surfaces.4')};
  }
`
StyledNavMenuLink.defaultProps = {
  bg: 'surfaces.4',
  color: 'text',
  p: 2,
}

export const NavMenuLink = (props: ComponentPropsWithoutRef<typeof Link>) => {
  const resolved = useResolvedPath(props.to)
  const match = useMatch({ path: resolved.pathname, end: true })

  return <StyledNavMenuLink {...props} className={match ? 'active' : ''} />
}
