import { Col, Row } from 'stinodes-ui'
import { useActions } from '../../character/CharacterContext'
import { ActionCard } from './ActionCard'

export const Actions = () => {
  const actions = useActions()

  if (!actions) return null
  return (
    <Row>
      {Object.values(actions).map(action => (
        <Col
          width={{ sm: 1, md: 1 / 2, lg: 1 / 4, xlg: 1 / 6 }}
          key={action.id}
          mb={3}
        >
          <ActionCard action={action} />
        </Col>
      ))}
    </Row>
  )
}
