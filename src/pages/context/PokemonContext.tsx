import { createContext, ReactNode, useCallback, useState, Context, useContext, useEffect } from 'react';
import { AllPokemon, PokemonInfo, PokemonResult, PokemonSpecies, PokemonTypeIcon } from '../../../dto/pokemon';
import { HttpBase } from '../../api/axios';
import { getImagePalette } from '../../utils/img';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type pokemonContextType = {
    allPokemon: AllPokemon | undefined
    handleNext: (url: string) => void
    handleBack: (url: string) => void
    isLoading: boolean
    handleSearch: () => void
    searchKey: string
    setSearchKey: React.Dispatch<React.SetStateAction<string>>
}

export const PokemonContext = createContext({} as pokemonContextType)

type Props = {
    children: ReactNode
}

export const PokemonProvider = ({ children }: Props) => {
    const httpBase = new HttpBase();
    const [url, setUrl] = useState<string>('https://pokeapi.co/api/v2/pokemon');
    const [searchKey, setSearchKey] = useState<string>('');
    const [isSearch, setIsSearch] = useState<boolean>(false);

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
        try {
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
        } catch (error) {
            return { base_happiness: 0, varieties: [], megaEvo: false, gigantamaxEvo: false, primalEvo: false };
        }
    }

    const { data: pokemon, isLoading } = useQuery<AllPokemon>({
        queryKey: ['pokemon', url], // ใช้ url เป็น key ของ query หาก url มีการเปลี่ยนแปลง query จะถูกเรียกใหม่ (built-in cache and state management, ทำให้ไม่ต้อง manage state ของ pokemon ด้วยตัวเอง)
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
                queryKey: ['pokemon', pokemon.next],
                queryFn: async () => fetchPokemon(pokemon.next || ''),
            });
        }
    }, [pokemon?.next, queryClient]);

    // Prefetch สำหรับ previous
    useEffect(() => {
        console.log("previous", pokemon?.previous);
        if (pokemon?.previous) {
            queryClient.prefetchQuery({
                queryKey: ['pokemon', pokemon.previous],
                queryFn: async () => fetchPokemon(pokemon.previous || '')
            });
        }
    }, [pokemon?.previous, queryClient]);

    const handleNext = useCallback((url: string) => {
        if (!isLoading) {
            setUrl(url);
        }
    }, [isLoading, pokemon]);

    const handleBack = useCallback((url: string) => {
        if (!isLoading) {
            setUrl(url);
        }
    }, [isLoading, pokemon]);

    const handleSearch = () => {
        if (searchKey.trim() !== '') {
            setIsSearch(true);
            setUrl(`https://pokeapi.co/api/v2/pokemon/${searchKey.toLowerCase()}`);
        } else {
            setIsSearch(false);
            setUrl('https://pokeapi.co/api/v2/pokemon');
        }
    };

    return (
        <PokemonContext.Provider value={{ allPokemon: pokemon, handleNext, handleBack, isLoading, handleSearch, searchKey, setSearchKey }}>
            {children}
        </PokemonContext.Provider>
    )
}

export const usePokemonContext = () => {
    return useContext(PokemonContext)
}