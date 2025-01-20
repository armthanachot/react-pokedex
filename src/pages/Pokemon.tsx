import { createContext, useCallback, useContext, useState } from "react";
import { HttpBase } from "../api/axios";
import { AllPokemon, PokemonInfo, PokemonTypeIcon } from "../../dto/pokemon";
import PokemonCard from "./PokemonCard";
import { Box, Grid2 } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import './extension/str';

type PokemonContext = {
    pokemon: AllPokemon | undefined,
}
export const PokemonContext = createContext({} as PokemonContext);

function Pokemon({ httpBase }: { httpBase: HttpBase }) {

    const [url, setUrl] = useState<string>('https://pokeapi.co/api/v2/pokemon');

    const fetchPokemon = async (url: string): Promise<AllPokemon> => {
        const res = await httpBase.api.get(url);
        const results = await Promise.all(
            res.data.results.map(async (p: any) => {
                const info: PokemonInfo = (await httpBase.api.get(p.url)).data;
                const types = await Promise.all(
                    info.types.map(async (t: any) => {
                        const typeIcon: PokemonTypeIcon = (await httpBase.api.get(t.type.url)).data;
                        return { ...t, type: { ...t.type, icon: typeIcon } };
                    })
                );
                return { ...p, info: { ...info, types } };
            })
        );
        return { ...res.data, results };
    };

    const { data: pokemon, isLoading } = useQuery<AllPokemon>({
        queryKey: ['pokemon', url], // ใช้ url เป็น key ของ query หาก url มีการเปลี่ยนแปลง query จะถูกเรียกใหม่ (built-in cache and state management, ทำให้ไม่ต้อง manage state ของ pokemon ด้วยตัวเอง)
        queryFn: () => fetchPokemon(url),
    })

    // ใช้ useCallback เพื่อป้องกันการเรียกใช้งานซ้ำๆ ของ function นี้ โดย function จะถูกเรียกต่อเมื่อ isLoading หรือ pokemon มีการเปลี่ยนแปลง และยังเหมาะกับ function ที่ถูกใช่้งานเป็น props ของ component อื่นๆ
    const handleNext = useCallback(() => {
        if (!isLoading && pokemon?.next) {
            setUrl(pokemon.next);
        }
    }, [isLoading, pokemon]);

    const handleBack = useCallback(() => {
        if (!isLoading && pokemon?.previous) {
            setUrl(pokemon.previous);
        }
    }, [isLoading, pokemon]);

    if (isLoading && !pokemon) {
        return <div>Loading...</div>;
    }

    const ChildPokemonCard = () => {
        const { pokemon } = useContext(PokemonContext);
        return (
            <Grid2 container spacing={2}>
                {pokemon?.results.map((p) => (
                    //size คือ จำนวน grid เต็ม 12 ที่จะใช้ ในที่นี้คือ 4 จะเท่ากับ 3 แถว
                    <Grid2 itemID="pokemon" key={p.name} size={{ xl: 4, lg: 4, md: 6, sm: 12 }}>
                        <PokemonCard
                            defaultImage={p.info.sprites}
                            name={p.name}
                            types={p.info.types.map(t => t.type.icon.sprites["generation-viii"]["sword-shield"].name_icon)}
                            showDownImage={p.info.sprites.other.showdown}
                            voice={p.info.cries.legacy}
                            no={p.url.urlSplit('/')[6].toNumber()}
                        />
                    </Grid2>
                ))}
            </Grid2>
        )
    }

    return (
        <Box sx={{ padding: 2 }}>
            <PokemonContext.Provider value={{ pokemon }}>
                <ChildPokemonCard />
            </PokemonContext.Provider>

            <Box sx={{ marginTop: 5, textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                {
                    pokemon?.previous && <button onClick={handleBack} disabled={isLoading}>
                        Back
                    </button>
                }
                <button onClick={handleNext} disabled={isLoading}>
                    Next
                </button>
            </Box>
        </Box>
    );
}

export default Pokemon;