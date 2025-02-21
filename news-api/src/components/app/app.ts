import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import { ResponseGeneral, Source, Article } from '../../interfaces';
class App {
    controller: AppController;
    view: AppView;
    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    start() {
        (document.querySelector('.sources') as Element).addEventListener('click', (e: Event) =>
            this.controller.getNews(e, (data: ResponseGeneral<Article>) => this.view.drawNews(data))
        );
        this.controller.getSources((data: ResponseGeneral<Source>) => this.view.drawSources(data));
    }
}

export default App;
