export type CharacterPreview = {
  path: string
  name: string
  class: string
  portrait: null | string
  id: string
}

type Ability =
  | 'Strength'
  | 'Dexterity'
  | 'Constitution'
  | 'Wisdom'
  | 'Intelligence'
  | 'Charisma'

type Attack = {
  $: {
    identifier: string
    name: string
    range: string
    attack: string
    damage: string
    ability: Ability
  }
  description: [string]
}

type SumElement = {
  $: {
    type: string
    id: string
  }
}

export type ItemElement = Element<
  {},
  { equipped?: [{ _: string; $: { location: string } }] }
>

export type Element<Extra extends {} = {}, Body = { element: Element[] }> = {
  $: {
    type: string
    id: string
    name: string
  } & Extra
} & Body

export type Character = {
  build: [
    {
      abilities: [
        {
          [a: Lowercase<Ability>]: [string]
        },
      ]
      input: [
        {
          attacks: [
            {
              attack: Attack[]
            },
          ]
        },
      ]
      equipment: [
        {
          item: ItemElement[]
          storage: Element[]
        },
      ]
      elements: [
        {
          $: { 'level-count': string; 'registered-count': string }
          element: Element[]
        },
      ]
      sum: [
        {
          $: { 'element-count': string }
          element: SumElement[]
        },
      ]
    },
  ]
}
