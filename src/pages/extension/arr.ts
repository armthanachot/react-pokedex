export { }
declare global {
    interface Array<T> {
        buildPokemonCard(): void
    }
}

Array.prototype.buildPokemonCard = function () {
}