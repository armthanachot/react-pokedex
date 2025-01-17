"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import Pokemon from './pokemon';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';


const queryClient = new QueryClient();

const Query = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <Pokemon />
        </QueryClientProvider>
    )
}

export default Query;