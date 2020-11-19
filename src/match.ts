import { GameProfile } from './GameProfile';
import { Boxscore } from './Boxscore';
import { Team } from './team';

interface IMatchProps {
  /**
   * gameProfile  : 該場賽事資訊
   * boxscore     : 該場賽事計分
   * homeTeam     : 主場隊伍
   * awayTeam     : 客場隊伍
   * label        : 該場賽事標籤
   */
  gameProfile: GameProfile;
  boxscore: Boxscore;
  homeTeam: Team;
  awayTeam: Team;
  label: string;
}
export class Match implements IMatchProps {
  /* Props & Constructor */
  private _props: IMatchProps;

  constructor(props: any) {
    this._props = {
      gameProfile: new GameProfile(props.profile),
      boxscore: new Boxscore(props.boxscore),
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
  get boxscore(): Boxscore {
    return this._props.boxscore;
  }
  get label(): string {
    return this._props.label;
  }
  get gameProfile(): GameProfile {
    return this._props.gameProfile;
  }
  get matchStatusText(): string {
    return `${this._props.awayTeam.profile.abbr.zh}  ${this._props.awayTeam.score.finalScore} : ${this._props.homeTeam.score.finalScore}  ${this._props.homeTeam.profile.abbr.zh}`;
  }

  /* Setters */

  /* Methods */
  public setMatchLabel() {
    this._props.label = `${this._props.awayTeam.profile.abbr.zh} - ${this._props.homeTeam.profile.abbr.zh}`;
  }
}
