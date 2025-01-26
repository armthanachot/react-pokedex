import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { HttpBase } from "../api/axios";
import { AllPokemon, PokemonInfo, PokemonTypeIcon, PokemonSpecies } from "../../dto/pokemon";
import PokemonCard from "./PokemonCard";
import { Box, Grid2 } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import './extension/str';
import { getImagePalette } from "../utils/img";
import { TextField } from '@mui/material';

type PokemonContext = {
    pokemon: AllPokemon | undefined,
}
export const PokemonContext = createContext({} as PokemonContext);

function Pokemon({ httpBase }: { httpBase: HttpBase }) {

    const [url, setUrl] = useState<string>('https://pokeapi.co/api/v2/pokemon');
    const [searchKey, setSearchKey] = useState<string>('');
    const [isSearch, setIsSearch] = useState<boolean>(false);

    const handleSearch = () => {
        if (searchKey.trim() !== '') {
            setIsSearch(true);
            setUrl(`https://pokeapi.co/api/v2/pokemon/${searchKey.toLowerCase()}`);
        } else {
            setIsSearch(false);
            setUrl('https://pokeapi.co/api/v2/pokemon');
        }
    };

    const fetchPokemon = async (url: string): Promise<AllPokemon> => {
        const res = await httpBase.api.get(url);
        const results = await Promise.all(
            res.data.results.map(async (p: any) => {
                const info: PokemonInfo = (await httpBase.api.get(p.url)).data;
                info.sprites.bgColor = (await getImagePalette(info.sprites.front_default)).join(',');

                const types = await Promise.all(
                    info.types.map(async (t: any) => {
                        const typeIcon: PokemonTypeIcon = (await httpBase.api.get(t.type.url)).data;
                        return { ...t, type: { ...t.type, icon: typeIcon } };
                    })
                );

                const species = await fetchPokemonSpecies(info.id);
                return { ...p, info: { ...info, types }, species };
            })
        );

        setIsSearch(false);
        return { ...res.data, results };
    };

    const fetchPokemonDetails = async (nameOrId: string): Promise<AllPokemon> => {
        const info: PokemonInfo = (await httpBase.api.get(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`)).data;
        if (!info) {
            return { count: 0, results: [] };
        }
        info.sprites.bgColor = (await getImagePalette(info.sprites.front_default)).join(',');

        const types = await Promise.all(
            info.types.map(async (t: any) => {
                const typeIcon: PokemonTypeIcon = (await httpBase.api.get(t.type.url)).data;
                return { ...t, type: { ...t.type, icon: typeIcon } };
            })
        );

        const species = await fetchPokemonSpecies(info.id);

        setIsSearch(false);
        return {
            count: 1,
            results: [{ name: info.name, url: 'no-url', info: { ...info, types }, species }],
        };
    };

    const fetchPokemonSpecies = async (id: number): Promise<PokemonSpecies> => {
        const species: PokemonSpecies = (await httpBase.api.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`)).data;
        if (!species) {
            return { base_happiness: 0, varieties: [], megaEvo: false, gigantamaxEvo: false, primalEvo: false };
        }

        for (const v of species.varieties) {
            const info: PokemonInfo = (await httpBase.api.get(v.pokemon.url)).data;
            v.pokemon.info = info;
        }

        species.megaEvo = species.varieties.some(v => v.pokemon.name.includes('-mega'));
        species.gigantamaxEvo = species.varieties.some(v => v.pokemon.name.includes('-gmax'));
        species.primalEvo = species.varieties.some(v => v.pokemon.name.includes('-primal'));
        return species;
    }

    const { data: pokemon, isLoading } = useQuery<AllPokemon>({
        queryKey: ['pokemon', url, isSearch], // ใช้ url เป็น key ของ query หาก url มีการเปลี่ยนแปลง query จะถูกเรียกใหม่ (built-in cache and state management, ทำให้ไม่ต้อง manage state ของ pokemon ด้วยตัวเอง)
        queryFn: () => {
            if (searchKey.trim() !== '') {
                return fetchPokemonDetails(searchKey);
            }
            return fetchPokemon(url);
        },
        // placeholderData: (prev) => prev,
        staleTime: 300000, // 5 นาที
    })

    const queryClient = useQueryClient();

    // Prefetch สำหรับ next
    useEffect(() => {
        console.log("next", pokemon?.next);
        if (pokemon?.next) {
            queryClient.prefetchQuery({
                queryKey: ['pokemon', pokemon.next, isSearch],
                queryFn: async () => fetchPokemon(pokemon.next || ''),
            });
        }
    }, [pokemon?.next, isSearch, queryClient]);

    // Prefetch สำหรับ previous
    useEffect(() => {
        console.log("previous", pokemon?.previous);
        if (pokemon?.previous) {
            queryClient.prefetchQuery({
                queryKey: ['pokemon', pokemon.previous, isSearch],
                queryFn: async () => fetchPokemon(pokemon.previous || '')
            });
        }
    }, [pokemon?.previous, isSearch, queryClient]);


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
        return <p>Loading...</p>
    }

    const ChildPokemonCard = () => {
        const { pokemon } = useContext(PokemonContext);
        let gridItemSize = { xl: 4, lg: 4, md: 6, sm: 12 };
        if (pokemon?.results.length === 0) {
            return <p>Loading...</p>
        }

        if (pokemon?.count === 1) {
            gridItemSize = { xl: 12, lg: 12, md: 12, sm: 12 };
        }
        return (
            <Grid2 container spacing={2}>
                {pokemon?.results.map((p) => (
                    //size คือ จำนวน grid เต็ม 12 ที่จะใช้ ในที่นี้คือ 4 จะเท่ากับ 3 แถว
                    <Grid2 itemID="pokemon" key={p.name} size={gridItemSize}>
                        <PokemonCard
                            defaultImage={p.info.sprites}
                            name={p.name}
                            types={p.info.types.map(t => t.type.icon.sprites["generation-viii"]["sword-shield"].name_icon)}
                            showDownImage={p.info.sprites.other.showdown}
                            voice={p.info.cries.legacy}
                            no={p.info.id}
                            species={p.species}
                        />
                    </Grid2>
                ))}
            </Grid2>
        )
    }

    return (
        <Box sx={{ padding: 2 }}>
            <PokemonContext.Provider value={{ pokemon }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2, }}>
                    <TextField
                        placeholder="search by name"
                        variant="outlined"
                        fullWidth
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        sx={{ backgroundColor: 'grey' }}
                        autoFocus
                    />
                    {/* <IconBtn
                        Icon={Search}
                        iconProp={{ sx: { color: 'white' } }}
                        onClick={handleSearch}
                    /> */}
                    <img src='src/assets/pokeball.png' width={50} height={50} style={{ cursor: 'pointer' }} onClick={handleSearch} />

                </Box>
                <ChildPokemonCard />
            </PokemonContext.Provider>

            <Box sx={{ marginTop: 5, textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                {
                    pokemon?.previous && <button onClick={handleBack} disabled={isLoading}>
                        Back
                    </button>
                }
                {
                    pokemon?.count && <button onClick={handleNext} disabled={isLoading}>
                        Next
                    </button>
                }
            </Box>
        </Box>
    );
}

export default Pokemon;