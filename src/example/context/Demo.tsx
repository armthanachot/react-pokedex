"use client"

import React from 'react';

import { MyIndexGenericContext, ContextIndexGContext, Provider, GetIndexProvider } from '.'

export default function DemoContext() {
    // <Fragment></Fragment> is the same as <></>
    return (
        <Provider>
            <>
                Demo
                <A />
            </>
        </Provider>
    )
}

const A = () => {
    //=> normal context
    // const { val, sum, generic } = React.useContext(ContextIndex)

    //=> generic context
    // const { val, sum, generic } = React.useContext(MyIndexGenericContext)

    const ctx = ContextIndexGContext<string>()
    const {indexProvider, useCtx} = GetIndexProvider(ctx)

    const { val, sum, generic } = useCtx()

    return (
        <div className="">
            <p>val: {val}</p>
            <p className="text-white">genericVal: {generic}</p>
            <button onClick={() => sum(1, 2)}>Sum</button>
        </div>
    )
}

//1.00.34