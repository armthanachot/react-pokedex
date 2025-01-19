export {}

declare global {
    interface String {
        urlSplit: (splitter: string)=> string[]
        toNumber: ()=> number
    }
}

String.prototype.urlSplit = function(splitter: string) {
    return this.split(splitter);
}

String.prototype.toNumber = function() {
    return Number(this);
}