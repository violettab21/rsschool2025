import AppLoader from './appLoader';
import { EverythingResponse, SourceResponse, Callback } from '../../interfaces';
import { Endpoint } from '../../enums';
import { Category } from '../../types';
class AppController extends AppLoader {
    public getSources(callback: Callback<SourceResponse>): void {
        super.getResp<SourceResponse>(
            {
                endpoint: Endpoint.source,
            },
            callback
        );
    }
    public getSourcesByCategories(callback: Callback<SourceResponse>): void {
        const selectedValue: string = (document.querySelector('.categories') as HTMLInputElement).value;

        if (selectedValue !== 'all') {
            const selectedCategory: Category = selectedValue as Category;
            super.getResp<SourceResponse>(
                {
                    endpoint: Endpoint.source,
                    options: {
                        category: selectedCategory,
                    },
                },
                callback
            );
        } else {
            super.getResp<SourceResponse>(
                {
                    endpoint: Endpoint.source,
                },
                callback
            );
        }
    }

    public getNews(e: Event, callback: Callback<EverythingResponse>): void {
        let target: Element = e.target as Element;
        const newsContainer: Element = e.currentTarget as Element;

        while (target !== newsContainer) {
            if (target.classList.contains('source__item')) {
                (document.querySelector('.search__field') as HTMLInputElement).value = '';
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
    public getNewsBySearch(callback: Callback<EverythingResponse>): void {
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

export default AppController;
