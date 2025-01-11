import { useEffect, useState } from "react";
import { HttpBase } from "../api/axios";
import { AllPokemon, PokemonInfo, PokemonTypeIcon } from "../../dto/pokemon";
import ActionAreaCard from "../components/Card";
import { Box, Grid2 } from "@mui/material";

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
                        //size คือ จำนวน grid เต็ม 12 และ border คือ ความหนาของเส้นขอบ
                        <Grid2 itemID="pokemon" key={p.name} size={4} border={1} wrap="wrap">
                            <ActionAreaCard
                                imgSrc={p.info.sprites.front_default}
                                name={p.name}
                                types={p.info.types.map(t => t.type.icon.sprites["generation-viii"]["sword-shield"].name_icon)}
                                animationSrc={p.info.sprites.other.showdown.front_default}
                            />
                        </Grid2>
                    ))}
                </Grid2>
            )}
            <Box sx={{ marginTop: 5, textAlign: 'center' }}>
                <button onClick={async () => !loading && await getPokemon(pokemon?.next || "")} disabled={loading}>
                    Next
                </button>
            </Box>
        </Box>
    );
}

export default Pokemon;