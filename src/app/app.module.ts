import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './pages/game/game.component';
import { MainMenuComponent } from './pages/main-menu/main-menu.component';
import { ScoreComponent } from './pages/score/score.component';
import { GameItemComponent } from './components/game-item/game-item.component';
import { FormsModule } from '@angular/forms';
import { HighscoreComponent } from './components/highscore/highscore.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    MainMenuComponent,
    ScoreComponent,
    GameItemComponent,
    HighscoreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
