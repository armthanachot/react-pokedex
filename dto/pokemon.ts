export type PokemonTypeIcon = {
    sprites:{
        "generation-viii":{
            "sword-shield":{
                name_icon: string
            }
        }
    }
}

export type defaultImg = {
    front_default: string,
    back_default: string,
    front_shiny: string,
    back_shiny: string,
    bgColor: string,
}

export type showDownImage = {
    front_default: string,
    back_default: string,
    front_shiny: string,
    back_shiny: string,
}

export type pokemonImage = {
    front: string,
    back: string,
    show: string,
}

export type PokemonInfo = {
    cries: {
        latest: string,
        legacy: string,
    },
    sprites: {
        front_default: string,
        back_default: string,
        front_shiny: string,
        back_shiny: string,
        bgColor: string,
        other: {
            dream_world: {
                front_default: string
            },
            showdown: {
                front_default: string,
                back_default: string,
                front_shiny: string,
                back_shiny: string,
            }
        }
    },
    types: {
        type: {
            name: string,
            url: string,
            icon: PokemonTypeIcon
        }
    }[],
    name: string,
    id: number,
}

export type PokemonResult = {
    name: string,
    url: string,
    info: PokemonInfo
}

export type AllPokemon = {
    count: number,
    next?: string,
    previous?: null,
    results: PokemonResult[]
}
