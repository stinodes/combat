import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Col, H1, Layout, Row } from 'stinodes-ui'
import { CharacterCard } from './CharacterCard'

export const LOCAL_STORAGE_CHARACTERSE_KEY = 'saved-characters'

export const Overview = () => {
  const [characters, setCharacters] = useState<any[]>(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_CHARACTERSE_KEY) || '[]'),
  )

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_CHARACTERSE_KEY,
      JSON.stringify(characters),
    )
  }, [characters])

  const addCharacter = async () => {
    const char = await window.api.createCharacterPreview()

    if (characters.some(c => c.path === char.path)) return

    setCharacters(characters => [...characters, char])
  }

  return (
    <Layout direction="column" p={3} spacing={3} flex={1}>
      <Layout direction="row" spacing={3} alignItems="center">
        <H1>My Characters</H1>
        <Button size="small" bg="primary" onClick={addCharacter}>
          Add another
        </Button>
      </Layout>
      <Row>
        {characters.map(char => (
          <Col width={1 / 4} key={char.id}>
            <Link to={`/${char.id}`} style={{ textDecoration: 'none' }}>
              <CharacterCard character={char} />
            </Link>
          </Col>
        ))}
      </Row>
    </Layout>
  )
}
