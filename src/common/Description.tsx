import styled from '@emotion/styled'
import { Box, themeColor } from 'stinodes-ui'

const StyledDescription = styled(Box)`
  color: ${themeColor('text')};
  .feature {
    margin-right: 8px;
    font-weight: bold;
  }
`

type Props = { text: string }
export const Description = ({ text }: Props) => {
  return (
    <StyledDescription
      dangerouslySetInnerHTML={{
        __html: text
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'"),
      }}
    />
  )
}
