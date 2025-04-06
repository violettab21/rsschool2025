import type { GarageState, WinnersState } from '../interfaces';
import { LocalStorage } from './local-storage';
import { isGarageState, isWinnersState } from '../utilities';
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
    public getGarageState(): GarageState | null {
        const result = this.garageState.getData();
        if (isGarageState(result)) {
            return result;
        }
        return null;
    }
    public getWinnersState(): WinnersState | null {
        const result = this.winnersState.getData();
        if (isWinnersState(result)) {
            return result;
        }
        return null;
    }
}
