import type { GarageState, WinnersState } from '../interfaces';
import { LocalStorage } from './local-storage';

export class State {
    public garageState: LocalStorage;
    public winnersState: LocalStorage;
    constructor() {
        this.garageState = new LocalStorage('garage_state');
        this.winnersState = new LocalStorage('winners_state');
    }
    public saveGarageState(garageState: GarageState): void {
        this.garageState.saveData(garageState);
    }
    public saveWinnersState(winnersState: WinnersState): void {
        this.winnersState.saveData(winnersState);
    }
}
