import { Injectable } from '@angular/core';
import { GameItemType } from './game.service';
import { BehaviorSubject, Subject } from 'rxjs';

export interface ScoreItem {
  id: number;
  player: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private readonly maxScores = 100;
  private updatedSubject$ = new BehaviorSubject<ScoreItem[]>(this.getScores());
  total = 0;
  stats: Map<GameItemType, number> = new Map();
  updated$ = this.updatedSubject$.asObservable();

  constructor() {
  }

  reset() {
    this.total = 0;
    this.stats = new Map();
  }

  add(type: GameItemType, score: number) {
    const prevScore = this.stats.get(type) || 0;
    this.stats.set(type, prevScore + score);
    this.total += score;
  }

  getRank(newScore: number = null) {
    if (newScore === null) {
      newScore = this.total;
    }

    let scores = this.getScores().map(score => score.score);
    scores.push(newScore);
    scores = this.clip(scores);
    return scores.indexOf(newScore) + 1;
  }

  getScores(): ScoreItem[] {
    const scores: ScoreItem[] = JSON.parse(localStorage.getItem('scores') || '[]');
    return this.sort(scores);
  }

  addNewScore(player: string, score: number) {
    const scores = this.getScores();
    scores.push({ player, score, id: Date.now() });
    const newScores = this.clip(this.sort(scores));
    localStorage.setItem('scores', JSON.stringify(newScores));
    this.updatedSubject$.next(this.getScores());
  }

  delete(score: ScoreItem) {
    const scores = this.getScores().filter(current => current.id !== score.id);
    localStorage.setItem('scores', JSON.stringify(scores));
    this.updatedSubject$.next(this.getScores());
  }

  private sort(scores: ScoreItem[]): ScoreItem[] {
    return scores.sort((a, b) => {
      return a.score - b.score;
    });
  }

  private clip<T>(scores: T[]): T[] {
    return scores.slice(0, this.maxScores);
  }
}
