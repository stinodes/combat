import styled from '@emotion/styled'
import { ComponentPropsWithoutRef } from 'react'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import { FlexButton, Icon, themeColor } from 'stinodes-ui'

export const StyledNavMenuLink = styled(FlexButton.withComponent(Link))`
  text-decoration: none;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  &.active {
    color: ${themeColor('primary')};
  }
`
StyledNavMenuLink.defaultProps = {
  bg: 'surfaces.4',
  color: 'typography.4',
  p: 2,
}

export const NavMenuLink = (
  props: { icon: string } & ComponentPropsWithoutRef<typeof Link>,
) => {
  const resolved = useResolvedPath(props.to)
  const match = useMatch({ path: resolved.pathname, end: false })

  return (
    <StyledNavMenuLink {...props} className={match ? 'active' : ''}>
      <Icon icon={props.icon} fontSize={28} />
    </StyledNavMenuLink>
  )
}
