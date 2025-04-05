import { GaragePage } from './app/pages/garage';
import './sass/_style.scss';
import { Main } from './app/components/main';
const main = new Main();
main.content = new GaragePage(main);
