import {ID} from './dnd'

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
    {equipped?: [{_: string; $: {location: string}}]}
>

export type Element<Extra extends {} = {}, Body = {element: Element[]}> = {
    $: {
        type: string
        id: string
        name: string
    } & Extra
} & Body

export type SpellSlotLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type SpellSlotName = `s${SpellSlotLevel}`
export type AuroraSpellCasting = {
    $: {
        name: string
        ability: Ability
        attack: string
        dc: string
        source: ID
    }
    slots: [
        {
            $: {
                [slot in SpellSlotName]: string
            }
        },
    ]
}

export type AuroraCharacter = {
    build: [
        {
            abilities: [
                {
                    [a in Lowercase<Ability>]: [string]
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
                    $: {'level-count': string; 'registered-count': string}
                    element: Element[]
                },
            ]
            magic: [
                {
                    $: {multiclass: 'true' | 'false'; level: string}
                    spellcasting: AuroraSpellCasting[]
                },
            ]
            sum: [
                {
                    $: {'element-count': string}
                    element: SumElement[]
                },
            ]
        },
    ]
}
