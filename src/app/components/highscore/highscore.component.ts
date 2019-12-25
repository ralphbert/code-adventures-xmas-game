import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScoreItem, ScoreService } from '../../services/score.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-highscore',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.scss']
})
export class HighscoreComponent implements OnInit, OnDestroy {
  scores: ScoreItem[];
  sub: Subscription;

  constructor(private scoreService: ScoreService) {
    this.sub = this.scoreService.updated$.subscribe(scores => this.scores = scores.reverse());
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
