import { RequestParam, Callback, Options } from '../../interfaces';

class Loader {
    private readonly baseLink: string;
    private readonly options: Options;
    constructor(baseLink: string, options: Options) {
        this.baseLink = baseLink;
        this.options = options;
    }

    protected getResp<T extends object>(
        request: RequestParam,
        callback: Callback<T> = () => {
            console.error('No callback for GET response');
        }
    ): void {
        this.load<T>('GET', request, callback);
    }

    private errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === 401 || res.status === 404)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }

        return res;
    }

    private makeUrl(endpoint: string, options?: Options): string {
        const urlOptions: { [index: string]: string } = { ...this.options, ...options };
        let url = `${this.baseLink}${endpoint}?`;

        Object.keys(urlOptions).forEach((key) => {
            url += `${key}=${urlOptions[key]}&`;
        });

        return url.slice(0, -1);
    }

    private load<T extends object>(method: string, request: RequestParam, callback: Callback<T>): void {
        fetch(this.makeUrl(request.endpoint, request.options), { method })
            .then(this.errorHandler)
            .then((res: Response) => res.json())
            .then((data: Omit<T, 'code' | 'message'>) => callback(data))
            .catch((err: Error) => console.error(err));
    }
}

export default Loader;
