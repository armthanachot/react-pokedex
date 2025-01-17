"use client"

import { createContext, ReactNode, useCallback, useState, Context, useContext } from 'react';

type contextType<T> = {
    val: number
    sum: (a: number, b: number) => void
    generic: T
}
//=> normal context ถึงจะใช้ generic แต่เป็นการ fix type ที่เป็น number ไม่ค่อยยืดหยุ่น
// export const ContextIndex = createContext({} as contextType<number>)

//=> generic context
export function ContextIndexGContext<T>() {
    return createContext({} as contextType<T>)
}

//=> เรียกใช้ generic context
export const MyIndexGenericContext = ContextIndexGContext<string>()

type Props = {
    children: ReactNode
}

export const Provider = ({ children }: Props) => {
    const [val, setVal] = useState(0)
    const sum = useCallback((a: number, b: number) => setVal(a + b), [])

    return (
        //=> normal context
        // <ContextIndex.Provider value={{val, sum, generic: 123456789}}>
        //     <p>provider value: {val}</p>
        //     {children}
        // </ContextIndex.Provider>

        //=> generic context
        //=> below is provider responsible for sharing the value to all children under it
        <MyIndexGenericContext.Provider value={{ val, sum, generic: "this is string" }}>
            <p>provider value: {val}</p>
            {children}
        </MyIndexGenericContext.Provider>
    )
}

type CtxProp<T> = {
    children: ReactNode,
    context: Context<contextType<T>>
}
// export const MyIndexGenericContext2 = ContextIndexGContext<string>()
export const GetIndexProvider = <T extends any>(context: Context<contextType<T>>) => {
    const useCtx = () => { return useContext(context) }
    const indexProvider = ({
        children,
        context
    }: CtxProp<T>) => {
        return (<context.Provider value={{ val: 0, sum: () => { }, generic: "this is string" as T }}>
            {children}
        </context.Provider>)
    }

    return {
        indexProvider,
        useCtx
    }
}