import { z } from 'zod';

const baseFieldSchema = z.object({
    name: z.string(),
    type: z.string(),
})

export type TField = z.infer<typeof baseFieldSchema>;

export const fieldSchema: z.ZodSchema<TField> = baseFieldSchema.extend({});

export const modelSchema = z.object({})

const TestZ = z.object({
    name: z.string({required_error: 'Name is required'}),
    age: z.number(),
}).partial().required(
    {
        name: true,
    }
);

export type TestType = z.infer<typeof TestZ>;

TestZ.parse({
    name: 'test',
})

//refine

const RefineTest = z.object({
    name: z.string(),
    age: z.number(),
}).refine(data => data.age > 18, {
    message: 'Age must be greater than 18',
}).refine(data => data.name.length > 1, {
    message: 'Name must be greater than 1',
})

export type RefineTestType = z.infer<typeof RefineTest>;

RefineTest.parse({
    name: '',
    age: 12,
})