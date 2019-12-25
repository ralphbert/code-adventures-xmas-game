import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum GameState {
  MainMenu = 1,
  Game,
  Score,
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private currentState$ = new BehaviorSubject<GameState>(GameState.MainMenu);
  gameStateChange$ = this.currentState$.asObservable();

  constructor() { }

  goToGame() {
    this.currentState$.next(GameState.Game);
  }

  goToScore() {
    this.currentState$.next(GameState.Score);
  }

  goToMainMenu() {
    this.currentState$.next(GameState.MainMenu);
  }
}
