import React from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";

export const FormEx = () => {
    const { register } = useForm() //ชั้น root
    // const {} = useFormContext() //ใช้ get value จากชั้น root พวกค่า และ state ใน form
    // const {} = useFieldArray({ //อ้างอืงข้อมมูลใน root
    //     control: control,
    //     name: 'test',
    // })

    return (
        <div>
            FormEx
        </div>
    )
}