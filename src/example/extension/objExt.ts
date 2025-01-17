declare global {
    interface Object {
        print: ()=> void
    }
}

Object.prototype.print = function() {
    console.log(this);
}

const obj = {
    name: 'John',
    age: 30
}

obj.print() //{ name: 'John', age: 30 }