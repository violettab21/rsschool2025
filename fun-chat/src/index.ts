import { Connection } from './app/connection/connection';
import { Main } from './app/components/main';
import { LoginPage } from './app/pages/login';
const connection = new Connection();
const main = new Main();
main.content = new LoginPage(connection, main);
