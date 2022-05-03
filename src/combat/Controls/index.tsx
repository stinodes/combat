import { Layout } from 'stinodes-ui'
import { HPControl } from './HPControl'

export const Controls = () => {
  return (
    <Layout direction="row" spacing={2} px={3}>
      <HPControl />
    </Layout>
  )
}
