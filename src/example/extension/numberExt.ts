declare global {
    interface Number {
        add: (a: number)=> void
    }
}

Number.prototype.add = function(a: number) {
    console.log((this as number) + a);
}

const num = 10

num.add(20) //30