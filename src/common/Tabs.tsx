import { Children, ReactElement, ReactNode, useState } from 'react'
import { Flex, FlexButton, H3, Layout } from 'stinodes-ui'

type TabProps = {
  children: ReactNode
  hash: string
  title: string
}
const Tab = (_: TabProps): undefined => {
  return undefined
}

type TabsProps = {
  children: ReactNode
}
export const Tabs = ({ children }: TabsProps) => {
  const tabs = Children.toArray(children).filter(
    child => typeof child !== 'string' && (child as ReactElement).type === Tab,
  ) as ReactElement<TabProps>[]

  const [activeTab, setActiveTab] = useState(tabs[0].props.hash)

  return (
    <Flex flexDirection="column">
      <Layout direction="row" justifyContent="center">
        {tabs.map(tab => (
          <FlexButton
            p={2}
            bg="surfaces.4"
            onClick={() => setActiveTab(tab.props.hash)}
          >
            <H3
              color={tab.props.hash === activeTab ? 'primary' : 'typography.4'}
            >
              {tab.props.title}
            </H3>
          </FlexButton>
        ))}
      </Layout>
      <Flex flexDirection="column" flex={1}>
        {tabs.find(tab => tab.props.hash === activeTab)?.props.children}
      </Flex>
    </Flex>
  )
}
Tabs.Tab = Tab
