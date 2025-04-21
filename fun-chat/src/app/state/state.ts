import type { User } from '../interfaces';
import { SessionStorage } from './session-storage';

export class State {
    public chatState: SessionStorage;
    constructor() {
        this.chatState = new SessionStorage('chat_state');
    }
    public saveChatState(chatState: {
        currentUser: Partial<User>;
        activeChatWith: Partial<User>;
    }): void {
        this.chatState.saveData(chatState);
    }

    public getChatState(): unknown {
        const result = this.chatState.getData();

        return result;
    }
}
