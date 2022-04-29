import { H1, H3, Layout } from 'stinodes-ui'
import { usePreview } from '../CharacterContext'
import { Bar } from './Bar'
import { Portrait } from './Portrait'

export const UnitFrame = () => {
  const preview = usePreview()

  return (
    <Layout p={3} direction="row">
      <Portrait image={preview.portrait} />
      <Layout
        flex={1}
        flexDirection="column"
        justifyContent="flex-end"
        spacing={1}
        pb={3}
        ml={-5}
      >
        <Layout spacing={3} ml={5} pl={2} direction="row" alignItems="flex-end">
          <H1 mb="-4px" style={{ fontSize: 42 }}>
            {preview.name}
          </H1>
          <H3 color="surfaces.0">{preview.class}</H3>
        </Layout>
        <Bar color="greens.3" total={46} current={30} showWarnings />
        <Bar color="blues.3" total={46} current={30} />
      </Layout>
    </Layout>
  )
}
