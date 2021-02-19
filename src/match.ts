import * as vscode from 'vscode';
import { GameProfile } from './gameProfile';
import { Score } from './score';
import { Team } from './team';
import { Lang } from './lang';

interface IMatchProps {
  /**
   * gameProfile  : 該場賽事資訊
   * boxscore     : 該場賽事計分
   * homeTeam     : 主場隊伍
   * awayTeam     : 客場隊伍
   * label        : 該場賽事標籤
   */
  gameProfile: GameProfile;
  score: Score;
  homeTeam: Team;
  awayTeam: Team;
  label: string;
}
export class Match implements IMatchProps {
  /* Props & Constructor */
  private _props: IMatchProps;

  constructor(props: any) {
    this._props = {
      gameProfile: new GameProfile(props.profile, props.homeTeam.profile.abbr),
      score: new Score(props.boxscore),
      homeTeam: new Team(props.homeTeam),
      awayTeam: new Team(props.awayTeam),
      label: '',
    };

    // Set current match label
    this.setMatchLabel();
  }

  /* Getters */
  get homeTeam(): Team {
    return this._props.homeTeam;
  }
  get awayTeam(): Team {
    return this._props.awayTeam;
  }
  get score(): Score {
    return this._props.score;
  }
  get label(): string {
    return this._props.label;
  }
  get gameProfile(): GameProfile {
    return this._props.gameProfile;
  }
  get matchStatusText(): string {
    type LangKey = keyof Lang;
    let currLang = vscode.env.language.substr(0, 2) === 'zh' ? vscode.env.language.split('-')[1] : vscode.env.language;
    return `${this._props.awayTeam.profile.abbr}  ${this._props.awayTeam.boxscore.finalScore} : ${this._props.homeTeam.boxscore.finalScore}  ${this._props.homeTeam.profile.abbr}`;
  }

  /* Methods */
  public setMatchLabel() {
    this._props.label = this.matchStatusText;
  }
}
