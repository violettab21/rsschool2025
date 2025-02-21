import AppLoader from './appLoader';
import { ResponseGeneral, Source, Article, Callback } from '../../interfaces';
class AppController extends AppLoader {
    getSources(callback: Callback<ResponseGeneral<Source>>): void {
        super.getResp<ResponseGeneral<Source>>(
            {
                endpoint: 'sources',
            },
            callback
        );
    }

    getNews(e: Event, callback: Callback<ResponseGeneral<Article>>): void {
        let target: Element = e.target as Element;
        const newsContainer: Element = e.currentTarget as Element;

        while (target !== newsContainer) {
            if (target.classList.contains('source__item')) {
                const sourceId: string = target.getAttribute('data-source-id') as string;
                if (newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId);
                    super.getResp<ResponseGeneral<Article>>(
                        {
                            endpoint: 'everything',
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
}

export default AppController;
