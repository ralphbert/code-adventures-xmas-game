import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LifeService {
  readonly totalLifes = 8;
  private lifesChangedSubject = new BehaviorSubject<number>(this.totalLifes);
  lifesChanged$ = this.lifesChangedSubject.asObservable();

  constructor() { }

  get lifesArray() {
    const array: boolean[] = [];

    for (let i = 0; i < this.totalLifes; i++) {
      array[i] = i < this.lifesChangedSubject.value;
    }

    return array;
  }

  reset() {
    this.lifesChangedSubject.next(this.totalLifes);
  }

  lifesLost(amount: number = 1) {
    const newAmount = Math.max(this.lifesChangedSubject.value - amount, 0);
    this.lifesChangedSubject.next(newAmount);
  }
}
