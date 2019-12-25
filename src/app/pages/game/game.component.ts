import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { GameItemData, GameService } from '../../services/game.service';
import { ScoreService } from '../../services/score.service';
import { LifeService } from '../../services/life.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  gameItems: GameItemData[] = [];
  private audio: HTMLAudioElement;

  constructor(
    private navigationService: NavigationService,
    public gameService: GameService,
    private scoreService: ScoreService,
    public lifeService: LifeService,
  ) {
    this.audio = new Audio('assets/music.mp3');
    this.audio.volume = 0.1;
    this.audio.play();
  }

  get currentScore() {
    return this.scoreService.total;
  }

  ngOnInit() {
    this.gameService.gameItemsChanged$.subscribe((items) => {
      this.gameItems = items;
    });
    this.gameService.start();
  }

  ngOnDestroy(): void {
    this.gameService.stop();
    this.audio.pause();
    this.audio.remove();
  }

  cancelGame() {
    this.navigationService.goToMainMenu();
  }

  trackByFn(index, item: GameItemData) {
    return item.id;
  }
}
