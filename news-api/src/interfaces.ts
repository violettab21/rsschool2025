import { Language, Category, Country } from './types';

import { Endpoint, Status } from './enums';

interface Source {
    id: string;
    name: string;
    description: string;
    url: string;
    category: Category;
    language: Language;
    country: Country;
}

interface Article {
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string;
}

interface EverythingResponse {
    status: Status;
    code?: string;
    message?: string;
    totalResults?: number;
    articles?: Article[];
}

interface SourceResponse {
    status: Status;
    code?: string;
    message?: string;
    sources?: Source[];
}

interface RequestParam {
    endpoint: Endpoint;
    options?: {
        sources?: string;
    };
}

interface Callback<T extends object> {
    (data: T): void;
}

export { Source, Article, RequestParam, Callback, EverythingResponse, SourceResponse };
