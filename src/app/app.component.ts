import { Component } from '@angular/core';
import { GameState, NavigationService } from './services/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  gameState = GameState;

  constructor(public navigationService: NavigationService) {
  }
}
