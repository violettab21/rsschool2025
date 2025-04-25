import type { Connection } from '../connection/connection';
import type { UserService } from '../services/user-service';
import type { Router } from '../components/router';
import {
    disableLoginButton,
    enableLoginButton,
    infoButtonHandlerLogin,
    loginHandler,
    passwordFieldHandler,
    userNameFieldHandler,
} from './login-handlers';

function renderLoginContent(
    Connection: Connection,
    UserService: UserService,
    router: Router
): void {
    const container = document.querySelector('.wrapper');
    if (container) {
        container.innerHTML = '';
        container.append(createLoginForm(Connection, UserService, router));
    }

    const userName = document.querySelector('.user-name-input');

    const password = document.querySelector('.password-input');
    if (
        userName instanceof HTMLInputElement &&
        password instanceof HTMLInputElement
    ) {
        if (
            userName.validity.valid === false ||
            password.validity.valid === false
        )
            disableLoginButton();
        else enableLoginButton();
    }
}

function createLoginForm(
    Connection: Connection,
    UserService: UserService,
    router: Router
): HTMLElement {
    const main = document.createElement('main');
    main.className = 'main';
    main.classList.add('main-login');
    const form = document.createElement('form');
    form.className = 'auth-form';
    const userName = createUserNameField();
    const password = createPasswordField();

    const loginButton = document.createElement('button');
    loginButton.className = 'login-button';
    loginButton.textContent = 'Login';
    const loginButtonHandler = loginHandler(Connection, UserService);
    loginButton.addEventListener('click', loginButtonHandler);
    const infoButton = document.createElement('button');
    infoButton.className = 'login-info-button';
    infoButton.textContent = 'Info';
    const infoHandler = infoButtonHandlerLogin(router);
    infoButton.addEventListener('click', infoHandler);
    form.append(userName, password, loginButton, infoButton);
    main.append(form);
    return main;
}

function createUserNameField(): HTMLElement {
    const userNameContainer = document.createElement('div');
    userNameContainer.className = 'user-name-row';

    const labelUserName = document.createElement('label');
    labelUserName.className = 'user-name-label';
    labelUserName.textContent = 'User Name';

    const inputUserName = document.createElement('input');
    inputUserName.className = 'user-name-input';

    const errorMessage = document.createElement('p');
    errorMessage.className = 'user-name-error';

    if (inputUserName instanceof HTMLInputElement) {
        inputUserName.required = true;
        inputUserName.minLength = 2;
        inputUserName.maxLength = 10;
        const userNameHandler = userNameFieldHandler(
            inputUserName,
            errorMessage
        );
        inputUserName.addEventListener('input', userNameHandler);
    }
    userNameContainer.append(labelUserName, inputUserName, errorMessage);

    return userNameContainer;
}

function createPasswordField(): HTMLElement {
    const passwordContainer = document.createElement('div');
    passwordContainer.className = 'password-row';

    const labelPassword = document.createElement('label');
    labelPassword.className = 'password-label';
    labelPassword.textContent = 'Password';

    const inputPassword = document.createElement('input');
    inputPassword.className = 'password-input';

    const errorMessage = document.createElement('p');
    errorMessage.className = 'password-error';

    if (inputPassword instanceof HTMLInputElement) {
        inputPassword.required = true;
        inputPassword.minLength = 6;
        inputPassword.maxLength = 10;
        inputPassword.pattern = `[a-zA-Z0-9]{6,10}`;
        const passwordHandler = passwordFieldHandler(
            inputPassword,
            errorMessage
        );
        inputPassword.addEventListener('input', passwordHandler);
    }
    passwordContainer.append(labelPassword, inputPassword, errorMessage);

    return passwordContainer;
}

export { renderLoginContent };
