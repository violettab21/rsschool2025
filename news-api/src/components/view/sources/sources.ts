import './sources.css';
import { Source } from '../../../interfaces';
class Sources {
    draw(data: Source[]) {
        const fragment = document.createDocumentFragment() as Node;
        const sourceItemTemp = document.querySelector('#sourceItemTemp') as HTMLTemplateElement;

        data.forEach((item: Source) => {
            const sourceClone = sourceItemTemp.content.cloneNode(true) as Element;

            sourceClone.querySelector('.source__item-name').textContent = item.name;
            sourceClone.querySelector('.source__item').setAttribute('data-source-id', item.id);

            fragment.appendChild(sourceClone);
        });

        document.querySelector('.sources').append(fragment);
    }
}

export default Sources;
