import { Col, Row } from 'stinodes-ui'
import { useSpellcasting } from '../CombatContext'
import { SpellCard } from './SpellCard'

export const Spells = () => {
  const spellcasting = useSpellcasting()

  if (!spellcasting || !Object.values(spellcasting).length) return null
  return (
    <Row>
      {Object.values(spellcasting).map(({ spells, class: className }) =>
        spells.map(
          spell =>
            spell.prepared && (
              <Col
                width={{ sm: 1, md: 1 / 2, lg: 1 / 4, xlg: 1 / 4 }}
                key={spell.id}
                mb={3}
              >
                <SpellCard spell={spell} class={className} />
              </Col>
            ),
        ),
      )}
    </Row>
  )
}
