import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, delay, filter, scan, tap } from 'rxjs/operators';
import { GameItemData, GameItemType, GameService } from '../../services/game.service';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-game-item',
  templateUrl: './game-item.component.html',
  styleUrls: ['./game-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameItemComponent implements OnInit, OnDestroy {
  @Input() gameItemData: GameItemData;
  private clickObservable$ = new Subject<number>();
  private classObservable$ = new Subject<number>();
  private clicksLeft = 0;
  private clickSoundPlayer: HTMLAudioElement;
  private top = 0;
  private isDead = false;
  clicked = false;

  get left() {
    return this.gameItemData && this.gameItemData.start || 0;
  }

  get size() {
    if (this.gameItemData.scales) {
      return 2 + (this.clicksLeft || 1) * 0.5;
    } else {
      return 2 * 1.5;
    }
  }

  get currentScore() {
    return this.gameItemData.score * (1 / this.clicksLeft);
  }

  get currentStyle() {
    const styleProps: any = {};

    const size = this.size;
    styleProps.height = `1em`;
    styleProps.width = `1em`;
    styleProps.transform = `scale(${size})`;
    styleProps.top = `${this.top}px`;
    styleProps.left = `${this.left}px`;

    return styleProps;
  }

  constructor(
    private gameService: GameService,
    private scoreService: ScoreService,
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.clicksLeft = this.gameItemData.clicksNeeded;
    this.clickSoundPlayer = new Audio(this.gameItemData.clickSound);

    this.classObservable$.pipe(
      tap(() => {
        this.clicked = false;
        this.changeDetectorRef.markForCheck();
      }),
      delay(1),
      tap(() => {
        this.clicked = true;
        this.changeDetectorRef.markForCheck();
      }),
      debounceTime(100),
      tap(() => {
        this.clicked = false;
        this.changeDetectorRef.markForCheck();
      }),
    ).subscribe();

    this.clickObservable$.pipe(
      tap(() => {
        this.scoreService.add(this.gameItemData.type, this.currentScore);
        this.classObservable$.next();
        this.clicksLeft -= 1;
        this.clickSoundPlayer.play();
        this.changeDetectorRef.markForCheck();
      }),
      scan((prev, current) => {
        console.log(prev, current);
        return prev + current;
      }),
      filter(clicks => clicks >= this.gameItemData.clicksNeeded),
    ).subscribe(prev => {
      console.log('done', prev);
      this.gameService.gameItemDone(this.gameItemData.id);
    });

    this.gameService.update$.subscribe(onUpdate => {
      this.top += 2 + (1 / this.clicksLeft) * (onUpdate / 10);
      this.changeDetectorRef.markForCheck();

      if (this.top > 600 + this.elementRef.nativeElement.offsetHeight && !this.isDead) {
        this.gameService.gameItemMissed(this.gameItemData.id);
        this.isDead = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.clickObservable$.complete();
    this.clickSoundPlayer.remove();
  }

  @HostListener('click')
  onClick() {
    console.log('click');
    this.clickObservable$.next(1);
  }
}
