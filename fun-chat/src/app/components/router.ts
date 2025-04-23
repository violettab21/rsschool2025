import type { Route } from '../interfaces';
import { renderLoginContent } from '../pages/login';
import { UserService } from '../services/user-service';
import type { Connection } from '../connection/connection';
import { renderChatPageContent } from '../pages/chat';
import { renderInfoContent } from '../pages/info';
import { ChatService } from '../services/chat-service';
import type { State } from '../state/state';
export class Router {
    public routes: Route[];
    public currentUrl: string;
    public connection: Connection;
    public userService: UserService;
    public chatService: ChatService;
    constructor(connection: Connection, state: State) {
        this.connection = connection;
        this.currentUrl = '';
        this.userService = new UserService(connection, this, state);
        this.chatService = new ChatService(
            connection,
            this,
            this.userService,
            state
        );
        this.routes = this.setRoutes(this.userService);
    }

    public openPage(path?: string): void {
        const isHistory: boolean = path !== undefined;
        if (isHistory) {
            history.pushState(null, '', path);
        }
        this.currentUrl = globalThis.location.pathname.slice(1);
        if (this.currentUrl === '') history.pushState(null, '', 'login');
        this.routes.find((route) => route.url === this.currentUrl)?.handler();
    }
    protected setRoutes(userService: UserService): Route[] {
        const routes: Route[] = [
            {
                url: 'login',
                handler: (): void => {
                    userService.getAllActiveUsers();
                    userService.getAllInactiveUsers();
                    console.log(userService.users);
                    const currentUser = userService.users.find(
                        (element) =>
                            element.login === userService.currentUser.login
                    );
                    if (currentUser && currentUser.isLogined) {
                        renderChatPageContent.call(
                            null,
                            userService,
                            this.chatService,
                            this
                        );
                        history.replaceState(null, '', '/chat');
                    } else
                        renderLoginContent.call(
                            null,
                            this.connection,
                            userService,
                            this
                        );
                },
            },
            {
                url: 'chat',
                handler: (): void => {
                    userService.getAllActiveUsers();
                    userService.getAllInactiveUsers();
                    console.log(userService.users);
                    const currentUser = userService.users.find(
                        (element) =>
                            element.login === userService.currentUser.login
                    );

                    if (currentUser && currentUser.isLogined) {
                        renderChatPageContent.call(
                            null,
                            userService,
                            this.chatService,
                            this
                        );
                    } else {
                        renderLoginContent.call(
                            null,
                            this.connection,
                            userService,
                            this
                        );
                        history.replaceState(null, '', '/login');
                    }
                },
            },
            {
                url: 'info',
                handler: renderInfoContent,
            },
            {
                url: '',
                handler: (): void => {
                    userService.getAllActiveUsers();
                    userService.getAllInactiveUsers();
                    const currentUser = userService.users.find(
                        (element) =>
                            element.login === userService.currentUser.login
                    );
                    if (currentUser && currentUser.isLogined) {
                        renderChatPageContent.call(
                            null,
                            userService,
                            this.chatService,
                            this
                        );
                        history.replaceState(null, '', '/chat');
                    } else
                        renderLoginContent.call(
                            null,
                            this.connection,
                            userService,
                            this
                        );
                },
            },
        ];

        return routes;
    }
}
