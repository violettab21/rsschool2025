interface Source {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
}

interface Article {
    source: {
        id?: string;
        name: string;
    };
    author?: string;
    title: string;
    description?: string;
    url: string;
    urlToImage?: string;
    publishedAt: string;
    content: string;
}

/*interface EverythingResponse {
    status: 'ok' | 'error';
    code?: string;
    message?: string;
    totalResults?: number;
    articles?: Article[];
}

interface SourceResponse {
    status: 'ok' | 'error';
    code?: string;
    message?: string;
    sources?: Source[];
}*/

interface ResponseGeneral<T> {
    status: 'ok' | 'error';
    code?: string;
    message?: string;
    totalResults?: number;
    articles?: T[];
    sources?: T[];
}

interface RequestParam {
    endpoint: string;
    options?: {
        sources?: string;
    };
}

interface Callback<T> {
    (data: T): void;
}

export { Source, Article, RequestParam, ResponseGeneral, Callback };
