import { Box, Grid2, TextField } from "@mui/material";
import { usePokemonContext } from "./context/PokemonContext";
import PokemonCard from "./PokemonCard";

export default function Pokemon2() {
    const { allPokemon, handleNext, handleBack, isLoading, handleSearch, searchKey, setSearchKey, totalPokemon } = usePokemonContext();

    let gridItemSize = { xl: 4, lg: 4, md: 6, sm: 12 };

    if (allPokemon?.count === 1) {
        gridItemSize = { xl: 12, lg: 12, md: 12, sm: 12 };
    }

    if (isLoading && !allPokemon) {
        return <p>Loading...</p>
    }
    return (
        <>
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
                <img src='src/assets/pokeball.png' width={50} height={50} style={{ cursor: 'pointer' }} onClick={handleSearch} />

            </Box>
            <Grid2 container spacing={2}>
                {allPokemon?.results.map((p) => (
                    //size คือ จำนวน grid เต็ม 12 ที่จะใช้ ในที่นี้คือ 4 จะเท่ากับ 3 แถว
                    <Grid2 itemID="pokemon" key={p.name} size={gridItemSize}>
                        <PokemonCard
                            defaultImage={p.info.sprites}
                            name={p.name}
                            types={p.info.types.map(t => t.type.icon.sprites["generation-viii"]["sword-shield"].name_icon)}
                            showDownImage={p.info.sprites.other.showdown}
                            species={p.species}
                            pokemonResult={p}
                            totalPokemon={totalPokemon}
                        />
                    </Grid2>
                ))}
            </Grid2>
            <Box sx={{ marginTop: 5, textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                {
                    allPokemon?.previous && <button onClick={() => handleBack(allPokemon.previous || '')} disabled={isLoading}>
                        Back
                    </button>
                }
                {
                    allPokemon?.count != 1 && <button onClick={() => handleNext(allPokemon?.next || '')} disabled={isLoading}>
                        Next
                    </button>
                }
            </Box>
        </>

    )
}