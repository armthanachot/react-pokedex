import { Static, Type } from "@sinclair/typebox";

const PokemonTypeIcon = Type.Object({
    sprites: Type.Object({
        "generation-viii": Type.Object({
            "sword-shield": Type.Object({
                name_icon: Type.String(),
            })
        })
    })
})

const PokemonInfo = Type.Object({
    cries: Type.Object({
        latest: Type.String(),
        legacy: Type.String(),
    }),
    sprites: Type.Object({
        front_default: Type.String(),
        back_default: Type.String(),
        front_shiny: Type.String(),
        back_shiny: Type.String(),
        other: Type.Object({
            dream_world: Type.Object({
                front_default: Type.String(),
            }),
            showdown: Type.Object({
                front_default: Type.String(),
                back_default: Type.String(),
            }),
        }),
    }),
    types: Type.Array(Type.Object({
        type: Type.Object({
            name: Type.String(),
            url: Type.String(),
            icon: PokemonTypeIcon,
        }),
    })),
})

const AllPokemon = Type.Object({
    count: Type.Number(),
    next: Type.String(),
    previous: Type.Null(),
    results: Type.Array(Type.Object({
        name: Type.String(),
        url: Type.String(),
        info: PokemonInfo,
    })),
});



export type AllPokemon = Static<typeof AllPokemon>;
export type PokemonInfo = Static<typeof PokemonInfo>;
export type PokemonTypeIcon = Static<typeof PokemonTypeIcon>;