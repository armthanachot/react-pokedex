import { useEffect, useState } from "react";
import { HttpBase } from "../api/axios";
import { AllPokemon, PokemonInfo, PokemonTypeIcon } from "../../dto/pokemon";

function Pokemon({ httpBase }: { httpBase: HttpBase }) {
    const [pokemon, setPokemon] = useState<AllPokemon>()
    const [loading, setLoading] = useState<boolean>(false)

    const getPokemon = async (url: string = 'https://pokeapi.co/api/v2/pokemon'): Promise<AllPokemon> => {
        setLoading(true)
        const allPokemon: AllPokemon = await (await httpBase.api.get(url)).data

        for (const p of allPokemon.results) {
            const info: PokemonInfo = await (await httpBase.api.get(p.url)).data
            p.info = info

            for (const t of info.types) {
                const type: PokemonTypeIcon = await (await httpBase.api.get(t.type.url)).data
                t.type.icon = type
            }
        }

        setPokemon(allPokemon)
        setLoading(false)
        return allPokemon
    }

    useEffect(() => {
        getPokemon()
    }, [])

    return (
        <div>
            {
                !loading ? pokemon?.results.map((p) => {
                    return <div key={p.name}>
                        <img src={p.info.sprites.other.showdown.front_default} alt={p.name} />
                        <span style={{ marginLeft: '20px'}}></span>
                        <img src={p.info.sprites.other.showdown.back_default} alt={p.name} />
                         <br />
                         <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                         {/* <audio controls>
                            <source src={p.info.cries.latest} type="audio/ogg" />
                         </audio>
                         <audio controls>
                            <source src={p.info.cries.latest} type="audio/ogg" />
                         </audio> */}
                         </div>
                        {
                               p.info.types.map((t, index) => {
                                return (
                                    <span key={`${p.name}-${t.type.name}-${index}`}>
                                        <img src={t.type.icon.sprites["generation-viii"]["sword-shield"].name_icon} alt={t.type.name} width={80} height={20} />
                                        <span style={{ marginLeft: '10px'}}></span>
                                    </span>
                                )
                               })

                        } 
                        {p.name} 
                        <br />
                        <br />
                    </div>
                }) : <div>Loading...</div>
            }

            <button onClick={async () => !loading && await getPokemon(pokemon?.next || "")} disabled={loading}>Next</button>
        </div>
    )
}

export default Pokemon