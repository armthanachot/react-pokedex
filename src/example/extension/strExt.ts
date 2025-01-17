declare global {
    interface String {
        conact: (a: string)=> void
    }
}

String.prototype.conact = function(a: string) {
    console.log(this + a);
}

const str = 'Hello'

str.conact(' World') //Hello World