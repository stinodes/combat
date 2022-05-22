import { Card, Flex, H2, H4, Layout } from 'stinodes-ui'
import { Portrait } from '../common/Portrait'
import { CharacterPreview } from '../types/character'

export const Preview = ({ preview }: { preview: CharacterPreview }) => {
  return (
    <Flex alignItems="center" flexDirection="row-reverse">
      <Card bg="surfaces.3" shadow p={5} ml={-5} minWidth="40%">
        <Layout spacing={1} ml={3}>
          <H2>{preview.name}</H2>
          <H4 color="surfaces.0">{preview.class}</H4>
        </Layout>
      </Card>
      <Portrait image={preview.portrait} />
    </Flex>
  )
}
