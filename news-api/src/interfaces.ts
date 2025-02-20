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

interface EverythingResponse {
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
}

interface RequestParam {
    endpoint: string;
    options?: {
        [index: string]: string;
    };
}

export { Source, Article, EverythingResponse, SourceResponse, RequestParam };
