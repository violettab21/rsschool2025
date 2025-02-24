import AppLoader from './appLoader';
import { EverythingResponse, SourceResponse, Callback } from '../../interfaces';
import { Endpoint } from '../../enums';
class AppController extends AppLoader {
    public getSources(callback: Callback<SourceResponse>): void {
        super.getResp<SourceResponse>(
            {
                endpoint: Endpoint.source,
            },
            callback
        );
    }

    public getNews(e: Event, callback: Callback<EverythingResponse>): void {
        let target: Element = e.target as Element;
        const newsContainer: Element = e.currentTarget as Element;

        while (target !== newsContainer) {
            if (target.classList.contains('source__item')) {
                const sourceId: string = target.getAttribute('data-source-id') as string;
                if (newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId);
                    super.getResp<EverythingResponse>(
                        {
                            endpoint: Endpoint.news,
                            options: {
                                sources: sourceId,
                            },
                        },
                        callback
                    );
                }
                return;
            }
            target = target.parentNode as Element;
        }
    }
    public getNewsBySearch(e: Event, callback: Callback<EverythingResponse>): void {
        const target: Element = e.target as Element;
        if (target.classList.contains('search__button')) {
            const searchValue: string = (document.querySelector('.search__field') as HTMLInputElement).value;
            super.getResp<EverythingResponse>(
                {
                    endpoint: Endpoint.news,
                    options: {
                        q: searchValue,
                    },
                },
                callback
            );
        }
    }
}

export default AppController;
