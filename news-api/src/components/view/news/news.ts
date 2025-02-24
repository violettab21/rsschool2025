import './news.css';
import { Article } from '../../../interfaces';
import Image from '../../../img/news_placeholder.jpeg';
class News {
    public draw(data: Readonly<Article[]>): void {
        const newsCount: number = data.length;
        if (newsCount === 0) {
            (document.querySelector('.news') as HTMLElement).innerHTML = '';
            const p: Element = document.createElement('p');
            p.className = 'news__not_found';
            p.textContent = 'No news found';
            (document.querySelector('.news') as HTMLElement).append(p);
        } else {
            const news = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;

            const fragment: Node = document.createDocumentFragment() as Node;
            const newsItemTemp: HTMLTemplateElement = document.querySelector('#newsItemTemp') as HTMLTemplateElement;

            news.forEach((item: Readonly<Article>, idx: number) => {
                const newsClone = newsItemTemp.content.cloneNode(true) as HTMLElement;

                if (idx % 2) (newsClone.querySelector('.news__item') as Element).classList.add('alt');

                (newsClone.querySelector('.news__meta-photo') as HTMLElement).style.backgroundImage = `url(${
                    item.urlToImage || Image
                })`;
                (newsClone.querySelector('.news__meta-author') as HTMLElement).textContent =
                    item.author || item.source.name;
                (newsClone.querySelector('.news__meta-date') as HTMLElement).textContent = item.publishedAt
                    .slice(0, 10)
                    .split('-')
                    .reverse()
                    .join('-');

                (newsClone.querySelector('.news__description-title') as HTMLElement).textContent = item.title;
                (newsClone.querySelector('.news__description-source') as HTMLElement).textContent = item.source.name;
                (newsClone.querySelector('.news__description-content') as HTMLElement).textContent = item.description
                    ? item.description
                    : '';
                (newsClone.querySelector('.news__read-more a') as HTMLElement).setAttribute('href', item.url);

                fragment.appendChild(newsClone);
            });

            (document.querySelector('.news') as HTMLElement).innerHTML = '';
            (document.querySelector('.news') as HTMLElement).appendChild(fragment);
        }
    }
}

export default News;
