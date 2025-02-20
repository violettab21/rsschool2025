import { EverythingResponse, SourceResponse, RequestParam } from '../../interfaces';

class Loader {
    baseLink: string;
    options: { apiKey: string };
    constructor(baseLink: string, options: { apiKey: string }) {
        this.baseLink = baseLink;
        this.options = options;
    }

    getResp(
        request: RequestParam,
        callback: (data: EverythingResponse | SourceResponse) => void = () => {
            console.error('No callback for GET response');
        }
    ): void {
        this.load('GET', request.endpoint, callback, request.options);
    }

    errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === 401 || res.status === 404)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }

        return res;
    }

    makeUrl(
        endpoint: string,
        options?: {
            [index: string]: string;
        }
    ): string {
        const urlOptions = { ...this.options, ...options };
        let url = `${this.baseLink}${endpoint}?`;

        Object.keys(urlOptions).forEach((key) => {
            url += `${key}=${urlOptions[key]}&`;
        });

        return url.slice(0, -1);
    }

    load(
        method: string,
        endpoint: string,
        callback: (data: EverythingResponse | SourceResponse) => void,
        options = {}
    ): void {
        fetch(this.makeUrl(endpoint, options), { method })
            .then(this.errorHandler)
            .then((res: Response) => res.json())
            .then((data: EverythingResponse | SourceResponse) => callback(data))
            .catch((err: Error) => console.error(err));
    }
}

export default Loader;
