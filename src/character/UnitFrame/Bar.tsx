import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, Flex, Text, themeColor } from 'stinodes-ui'

const shake = keyframes`
from, to {
    transform: translateX(0);
}
20%, 60% {
    transform: translateX(1%);
}
40%, 80% {
    transform: translateX(-1%);
}
`

const BarBackground = styled(Card)<{ damaged: boolean; healed: boolean }>`
  background: ${themeColor('surfaces.2')};
  border-radius: 4px;
  border: 2px ${themeColor('typography.4')} solid;
  height: 32px;
  overflow: hidden;
  position: relative;
  ${props =>
    props.damaged
      ? css`
          animation: ${shake} 0.3s linear;
        `
      : ''}
`
const BarFill = styled(Flex)`
  transition: width 0.2s ease, background-color 0.2s ease;
`

const BarText = styled(Flex)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  align-items: center;
  font-weight: bold;
  text-shadow: ${themeColor('shadow')} 0 0 5px;
`

type BarProps = {
  total: number
  current: number
  color: string
  showWarnings?: boolean
}
export const Bar = ({
  total,
  current,
  color: baseColor,
  showWarnings,
}: BarProps) => {
  const currentRef = useRef(current)
  const [status, setStatus] = useState<null | 'healed' | 'damaged'>(null)

  const color = useMemo(() => {
    if (!showWarnings) return baseColor

    if (current < total * 0.25) return 'reds.3'
    if (current < total * 0.5) return 'yellows.3'
    return baseColor
  }, [baseColor, showWarnings, current, total])

  useEffect(() => {
    if (current < currentRef.current) setStatus('damaged')
    if (current > currentRef.current) setStatus('healed')
    currentRef.current = current
  }, [current, currentRef])

  return (
    <Flex>
      <BarBackground
        width={1}
        shadow
        damaged={status === 'damaged'}
        healed={status === 'healed'}
        onAnimationEnd={() => setStatus(null)}
      >
        <BarFill width={current / total} bg={color} />
        <BarText pl={2}>
          <Text>
            {current} / {total}
          </Text>
        </BarText>
      </BarBackground>
    </Flex>
  )
}
