export {}

//interface is structure
//implement is to use the structure
declare global {
    interface Array<T extends string | number> {
        print: ()=> void
        loopPrint: ()=> void
    }
}

Array.prototype.print = function() {
    console.log(this.join(', '));   
}

Array.prototype.loopPrint = function() {
    this.forEach((item: any) => {
        console.log(item);
    })
}

const arr = [1,2,3,4]
arr.print() //1, 2, 3, 4

const arrStr = ['a', 'b', 'c', 'd']
arrStr.print() //a, b, c, d

const arrObj = [{},{},{}]
arrObj.print()