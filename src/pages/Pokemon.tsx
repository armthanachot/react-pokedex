import { useEffect, useState } from "react";
import { HttpBase } from "../api/axios";
import { AllPokemon, PokemonInfo, PokemonTypeIcon } from "../../dto/pokemon";
import ActionAreaCard from "../components/Card";
import { Box, Grid2 } from "@mui/material";
import { splitUrl } from "../utils/str";

function Pokemon({ httpBase }: { httpBase: HttpBase }) {
    const [pokemon, setPokemon] = useState<AllPokemon>();
    const [loading, setLoading] = useState<boolean>(false);

    const getPokemon = async (url: string = 'https://pokeapi.co/api/v2/pokemon'): Promise<AllPokemon> => {
        setLoading(true);
        const allPokemon: AllPokemon = await (await httpBase.api.get(url)).data;

        for (const p of allPokemon.results) {
            const info: PokemonInfo = await (await httpBase.api.get(p.url)).data;
            p.info = info;

            for (const t of info.types) {
                const type: PokemonTypeIcon = await (await httpBase.api.get(t.type.url)).data;
                t.type.icon = type;
            }
        }

        setPokemon(allPokemon);
        setLoading(false);
        return allPokemon;
    };

    useEffect(() => {
        getPokemon();
    }, []);

    return (
        <Box sx={{ padding: 2 }}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Grid2 container spacing={2}>
                    {pokemon?.results.map((p) => (
                        //size คือ จำนวน grid เต็ม 12 ที่จะใช้ ในที่นี้คือ 4 จะเท่ากับ 3 แถว
                        <Grid2 itemID="pokemon" key={p.name} size={{ xl: 4, lg: 4, md: 6, sm: 12 }}>
                            <ActionAreaCard
                                imgSrc={p.info.sprites.front_default}
                                imgShinySrc={p.info.sprites.front_shiny}
                                name={p.name}
                                types={p.info.types.map(t => t.type.icon.sprites["generation-viii"]["sword-shield"].name_icon)}
                                animationSrc={p.info.sprites.other.showdown.front_default}
                                voice={p.info.cries.legacy}
                                no={Number(splitUrl(p.url, '/')[6]) || 0}
                            />
                        </Grid2>
                    ))}
                </Grid2>
            )}
            <Box sx={{ marginTop: 5, textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                {
                    pokemon?.previous && <button onClick={async () => !loading && await getPokemon(pokemon?.previous || "")} disabled={loading}>
                        Back
                    </button>
                }
                <button onClick={async () => !loading && await getPokemon(pokemon?.next || "")} disabled={loading}>
                    Next
                </button>
            </Box>
        </Box>
    );
}

export default Pokemon;