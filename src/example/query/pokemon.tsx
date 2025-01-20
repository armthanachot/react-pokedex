import { useQuery } from '@tanstack/react-query'

const Pokemon = () => {
    const { data, refetch, isPending, error, isFetching } = useQuery({
        queryKey: ['pokemon'], // ค่าที่ใช้เป็น key ในการเก็บข้อมูล cache ของ query นี้
        queryFn: async () => {
            try {
                const res = await fetch('https://pokeapi.co/api/v2/pokemon')
                return res.json()
            } catch (error) {
                throw new Error('Failed to fetch pokemon')
            }
        },
        refetchOnWindowFocus: true,
    })

    if (isPending) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>
    if (isFetching) return <p>fetching...</p>

    return (
        <div>
            <h1>Pokemon</h1>
            <pre>{
                JSON.stringify(data, null, 2)
            }</pre>
        </div>
    )
}

export default Pokemon
