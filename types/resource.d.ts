import {
  CharacterPreview as _CP,
  Character as _C,
  Element as _E,
  ItemElement as _IE,
} from './character.d'

export declare namespace dnd {
  type ID = string

  export enum ResourceType {
    'Source' = 'Source',
    'Archetype' = 'Archetype',
    'Archetype Feature' = 'Archetype Feature',
    'Magic Item' = 'Magic Item',
    'Option' = 'Option',
    'Item' = 'Item',
    'Weapon' = 'Weapon',
    'Proficiency' = 'Proficiency',
    'Weapon Property' = 'Weapon Property',
    'Support' = 'Support',
    'Sub Race' = 'Sub Race',
    'Racial Trait' = 'Racial Trait',
    'Companion' = 'Companion',
    'Companion Trait' = 'Companion Trait',
    'Companion Action' = 'Companion Action',
    'Language' = 'Language',
    'Deity' = 'Deity',
    'Feat' = 'Feat',
    'Feat Feature' = 'Feat Feature',
    'Ability Score Improvement' = 'Ability Score Improvement',
    'Grants' = 'Grants',
    'Spell' = 'Spell',
    'Background' = 'Background',
    'Background Feature' = 'Background Feature',
    'Background Variant' = 'Background Variant',
    'Class' = 'Class',
    'Class Feature' = 'Class Feature',
    'Armor' = 'Armor',
    'Race' = 'Race',
    'Race Variant' = 'Race Variant',
    'Companion Reaction' = 'Companion Reaction',
    'Information' = 'Information',
    'Internal' = 'Internal',
    'Dragonmark' = 'Dragonmark',
    'Condition' = 'Condition',
    'Magic School' = 'Magic School',
    'Rule' = 'Rule',
    'Companion Feature' = 'Companion Feature',
  }

  export enum DescriptionTag {
    'p' = 'p',
    'span' = 'span',
    'div' = 'div',
    'br' = 'br',
    'strong' = 'strong',
    'em' = 'em',
    '_' = '_',
  }

  type ResourceMeta = {
    name: string
    type: ResourceType
    source: string
    id: ID
  }

  type HTMLString = string
  type ResourceDescription = HTMLString

  type ResourceRule = {
    grant?: GrantRule[]
    select?: SelectRule[]
    stat?: StatRule[]
  }
  type GrantRule = {
    $: {
      id: ID
      type: string
      level: string
    }
  }
  type StatRule = {
    $: {
      name: string
      value: string
      level?: string
      equipped?: string
    }
  }
  type SelectRule = {
    $: {
      type: string
      name: string
      value?: string
      level: string
      supports: string
    }
  }

  type ResourceSetter = {
    $: { name: string }
    _: string
  }
  export type Resource = ResourceMeta & {
    $: ResourceMeta
    description?: ResourceDescription
    rules?: ResourceRule[]
    supports?: ID[]
    setters?: [{ set: ResourceSetter[] }]
  }
  export type ResourceDB = {
    resources: { [id: dnd.ID]: dnd.Resource }
    typeIndex: { [type in dnd.ResourceType]: dnd.ID[] }
  }

  export type Element<Extra = {}, Body = { element: _E[] }> = _E<Extra, Body>
  export type CharacterPreview = _CP
  export type Character = _C
  export type ItemElement = _IE
}
