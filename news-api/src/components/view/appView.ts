import News from './news/news';
import Sources from './sources/sources';
import { ResponseGeneral, Source, Article } from '../../interfaces';

export class AppView {
    news: News;
    sources: Sources;
    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    drawNews(data: ResponseGeneral<Article>) {
        const values = data?.articles ? data?.articles : [];
        this.news.draw(values);
    }

    drawSources(data: ResponseGeneral<Source>) {
        const values: Source[] = data?.sources ? data?.sources : [];
        this.sources.draw(values);
    }
}

export default AppView;
