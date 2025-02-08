export type PokemonTypeIcon = {
    sprites: {
        "generation-viii": {
            "sword-shield": {
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
    other: {
        dream_world: {
            front_default: string
        },
        showdown: {
            front_default: string,
            back_default: string,
            front_shiny: string,
            back_shiny: string,
        },
        "official-artwork": {
            front_default: string
            front_shiny: string
        }
    }
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
    showMultiple?: string[]
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
            },
            "official-artwork": {
                front_default: string
                front_shiny: string
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
    stats: PokemonStat[],
}

export type PokemonStat = {
    base_stat: number,
    effort: number,
    stat: {
        name: string,
        url: string
    }
}

export type PokemonResult = {
    name: string,
    url: string,
    info: PokemonInfo
    species?: PokemonSpecies
}

export type PokemonSpecies = {
    color: {
        name: string,
        url: string
    },
    base_happiness: number,
    varieties: {
        is_default: boolean,
        pokemon: {
            name: string,
            url: string
            info?: PokemonInfo
        }
    }[],
    megaEvo: boolean
    gigantamaxEvo: boolean
    primalEvo: boolean
}

export type AllPokemon = {
    count: number,
    next?: string,
    previous?: string | null,
    results: PokemonResult[]
}

export type PokemonAllSelect = {
    name: string,
    defaultImage: defaultImg,
}