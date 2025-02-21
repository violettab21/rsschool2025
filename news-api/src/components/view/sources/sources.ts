import './sources.css';
import { Source } from '../../../interfaces';
class Sources {
    draw(data: Source[]): void {
        const fragment = document.createDocumentFragment() as Node;
        const sourceItemTemp = document.querySelector('#sourceItemTemp') as HTMLTemplateElement;

        data.forEach((item: Source) => {
            const sourceClone = sourceItemTemp.content.cloneNode(true) as Element;

            (sourceClone.querySelector('.source__item-name') as Element).textContent = item.name;
            (sourceClone.querySelector('.source__item') as Element).setAttribute('data-source-id', item.id);

            fragment.appendChild(sourceClone);
        });

        (document.querySelector('.sources') as Element).append(fragment);
    }
}

export default Sources;
