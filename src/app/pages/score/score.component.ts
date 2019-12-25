import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { ScoreItem, ScoreService } from '../../services/score.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit, OnDestroy {
  name = '';
  scores: ScoreItem[] = [];
  rank: number;
  saved = false;
  sub: Subscription;

  constructor(private navigationService: NavigationService, private scoreService: ScoreService) {
  }

  get currentScore() {
    return this.scoreService.total;
  }

  ngOnInit() {
    this.scores = this.scoreService.getScores()
    this.sub = this.scoreService.updated$.pipe().subscribe(scores => {
      this.scores = scores;
      this.rank = this.scoreService.getRank();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  goToMainMenu() {
    this.navigationService.goToMainMenu();
  }

  submit() {
    if (this.name && !this.saved) {
      this.saved = true;
      this.scoreService.addNewScore(this.name, this.scoreService.total);
    }
  }

  delete(score: ScoreItem) {
    this.scoreService.delete(score);
  }
}
