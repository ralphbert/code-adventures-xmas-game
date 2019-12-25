import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, timer } from 'rxjs';
import { scan, switchMap, takeUntil } from 'rxjs/operators';
import { ScoreService } from './score.service';
import { NavigationService } from './navigation.service';
import { LifeService } from './life.service';

export enum GameItemType {
  gift = 1,
  enemy,
}

export interface GameItemData {
  id: number;
  type: GameItemType;
  image: string;
  clickSound: string;
  score: number;
  speed: number;
  start: number;
  clicksNeeded: number;
  scales: boolean;
}

const bell = {
  type: GameItemType.gift,
  image: 'assets/bell.png',
  clickSound: 'assets/bell-click.ogg',
  score: 300,
};

const gift = {
  type: GameItemType.gift,
  image: 'assets/gift.png',
  clickSound: 'assets/gift-click.wav',
  score: 300,
};

const bomb = {
  type: GameItemType.enemy,
  image: 'assets/bomb.png',
  clickSound: 'assets/bomb.mp3',
  score: -400,
};

const gameItems = [
  bell, bell,
  gift, gift, gift,
  bomb,
];

const maxClicks = 3;

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameItems: GameItemData[] = [];

  private onStop$ = new Subject();
  private gameItemsChangedSubject$ = new Subject<GameItemData[]>();
  private creationInterval: Observable<number>;
  private updateSubject$ = new Subject<number>();
  private nextId = 1;

  update$ = this.updateSubject$.asObservable();
  gameItemsChanged$ = this.gameItemsChangedSubject$.asObservable();

  constructor(
    private scoreService: ScoreService,
    public lifeService: LifeService,
    private navigationService: NavigationService,
  ) {
  }

  start() {
    this.scoreService.reset();
    this.lifeService.reset();
    this.gameItems = [];
    this.gameItemsChangedSubject$.next(this.gameItems);

    this.creationInterval = timer(500, 500).pipe(takeUntil(this.onStop$));
    this.creationInterval.subscribe((id) => {
      this.addRandomItem();
    });

    let timestamp = Date.now();
    timer(0, 50)
      .pipe(takeUntil(this.onStop$))
      .subscribe(() => {
        const now = Date.now();
        const delta = now - timestamp;
        this.updateSubject$.next(delta);
        timestamp = now;
      });

    this.lifeService.lifesChanged$
      .pipe(takeUntil(this.onStop$))
      .subscribe(lifes => {
        if (lifes <= 0) {
          this.navigationService.goToScore();
        }
      });
  }

  stop() {
    this.onStop$.next();
  }

  gameItemDone(gameItemId: number) {
    this.remove(gameItemId);
  }

  gameItemMissed(gameItemId: number) {
    const gameItemData = this.gameItems.find(item => item.id === gameItemId);
    this.remove(gameItemId);

    if (gameItemData && gameItemData.type === GameItemType.gift) {
      this.lifeService.lifesLost(1);
    }
  }

  addRandomItem() {
    const id = Math.floor(Math.random() * gameItems.length);
    const gameItem = gameItems[id];
    const clicksNeeded = Math.ceil(Math.random() * maxClicks);

    this.add({
      clicksNeeded: gameItem.type === GameItemType.enemy ? 1 : clicksNeeded,
      id: this.getNextId(),
      image: gameItem.image,
      score: gameItem.score,
      speed: Math.ceil(Math.random() * 3),
      start: Math.random() * 800,
      type: gameItem.type,
      clickSound: gameItem.clickSound,
      scales: gameItem.type === GameItemType.gift,
    });
  }

  private remove(gameItemId: number) {
    this.gameItems = this.gameItems.filter(item => item.id !== gameItemId);
    this.gameItemsChangedSubject$.next(this.gameItems);
  }

  private add(gameItemData: GameItemData) {
    this.gameItems.push(gameItemData);
    this.gameItemsChangedSubject$.next(this.gameItems);
  }

  private getNextId() {
    return this.nextId++;
  }
}
