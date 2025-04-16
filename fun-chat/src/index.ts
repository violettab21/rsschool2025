import { Connection } from './app/connection/connection';
import { Main } from './app/components/main';
import { LoginPage } from './app/pages/login';
import './sass/_style.scss';
const connection = new Connection();
connection.connect();
const main = new Main();
main.content = new LoginPage(connection, main);
