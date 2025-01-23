"use client"

import React from "react"

export const Snap = () => {

    const [state, setState] = React.useState(0)

    const handleAction = () => {
        // state ยังเป็น 0 ทั้ง 3 ครั้ง เนื่องจากหลักการ snapshot ของ React
        setState(state + 1) // 0 + 1 = 1
        setState(state + 1) // 0 + 1 = 1
        setState(state + 1) // 0 + 1 = 1

        /** 
         * Best Practice
         * let x = state
         * x+=1
         * x+=1
         * x+=1
         * setState(x)
         * 
        */

        setTimeout(() => {
            alert(state)
        }, 2000)
    }

    React.useEffect(() => {
        console.log('state', state)
    }, [state])

    const handlePrevStateAction = () => {
        // การใช้ prev คือการ access เข้าไปในค่า state เดิม แล้วทำการเปลี่ยนแปลงค่า state ใหม่ ในที่นี้จะได้เป็น 3
        setState(prev => prev + 1)  // 0 + 1 = 1
        setState(prev => prev + 1) // 1 + 1 = 2
        setState(prev => prev + 1) // 2 + 1 = 3
    }

    return (
        <div>
            <h1>Snapshot Example</h1>
            <p>State: {state}</p>
            <button onClick={handleAction}>Action</button>
            <button onClick={handlePrevStateAction}>Action Prev</button>
        </div>
    )
}

export default Snap