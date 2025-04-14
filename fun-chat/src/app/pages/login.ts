import type { Connection } from '../connection/connection';
import type { Main } from '../components/main';
import { ElementBase } from '../components/elements';
import type { CustomElement } from '../interfaces';
import { Button } from '../components/buttons';

export class LoginPage {
    public connection: Connection;
    constructor(connection: Connection, mainElement: Main) {
        this.connection = connection;
        configurePage(mainElement);
    }
}
function configurePage(mainElement: Main): void {
    const form = renderLoginForm();
    mainElement.main.append(form);
}
function renderLoginForm(): CustomElement {
    const form = new ElementBase({
        tag: 'form',
        className: ['auth-form'],
    }).element;

    const userName = createUserNameField();
    const password = createPasswordField();
    const loginButton = new Button({
        className: ['login-button'],
        textContent: 'Login',
        handlerFunction: (event): void => {
            event?.preventDefault();
            console.log('login');
        },
    }).element;

    form.append(userName, password, loginButton);

    return form;
}

function createUserNameField(): CustomElement {
    const userNameContainer = new ElementBase({
        tag: 'div',
        className: ['user-name-row'],
    }).element;
    const labelUserName = new ElementBase({
        tag: 'label',
        className: ['user-name-label'],
        textContent: 'User Name',
    }).element;
    const inputUserName = new ElementBase({
        tag: 'input',
        className: ['user-name-input'],
    }).element;
    userNameContainer.append(labelUserName, inputUserName);

    return userNameContainer;
}

function createPasswordField(): CustomElement {
    const passwordContainer = new ElementBase({
        tag: 'div',
        className: ['password-row'],
    }).element;
    const labelPassword = new ElementBase({
        tag: 'label',
        className: ['password-label'],
        textContent: 'Password',
    }).element;
    const inputPassword = new ElementBase({
        tag: 'input',
        className: ['password-input'],
    }).element;
    passwordContainer.append(labelPassword, inputPassword);

    return passwordContainer;
}
