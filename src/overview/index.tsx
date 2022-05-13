import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Col, H1, Layout, Row, Spinner } from 'stinodes-ui'
import { CharacterPreview } from '../types/character'
import { CharacterCard } from './CharacterCard'

export const LOCAL_STORAGE_CHARACTERSE_KEY = 'saved-characters'

export const Overview = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [characters, setCharacters] = useState<CharacterPreview[]>([])

  const fetchCharacters = useCallback(async () => {
    setLoading(true)
    const characters = await window.api.previews()
    setCharacters(characters)
    setLoading(false)
  }, [setLoading, setCharacters])

  const addCharacter = async () => {
    await window.api.createPreview()
    await fetchCharacters()
  }

  useEffect(() => {
    fetchCharacters()
  }, [fetchCharacters])

  return (
    <Layout direction="column" p={3} spacing={3} flex={1}>
      <Layout direction="row" spacing={3} alignItems="center">
        <H1>My Characters</H1>
        <Button size="small" bg="primary" onClick={addCharacter}>
          Add another
        </Button>
      </Layout>
      <Row>
        {loading && (
          <Col py={3} justifyContent="center">
            <Spinner />
          </Col>
        )}
        {characters.map(char => (
          <Col width={1 / 4} key={char.id}>
            <Link to={`${char.id}`} style={{ textDecoration: 'none' }}>
              <CharacterCard character={char} />
            </Link>
          </Col>
        ))}
      </Row>
    </Layout>
  )
}
