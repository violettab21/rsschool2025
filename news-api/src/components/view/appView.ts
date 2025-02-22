import News from './news/news';
import Sources from './sources/sources';
import { EverythingResponse, SourceResponse, Source, Article } from '../../interfaces';

export class AppView {
    private readonly news: News;
    private readonly sources: Sources;
    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    public drawNews(data: Readonly<EverythingResponse>) {
        const values: Readonly<Article[]> = data?.articles ? data?.articles : [];
        this.news.draw(values);
    }

    public drawSources(data: Readonly<SourceResponse>) {
        const values: Readonly<Source[]> = data?.sources ? data?.sources : [];
        this.sources.draw(values);
    }
}

export default AppView;
