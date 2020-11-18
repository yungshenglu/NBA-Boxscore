import { Team } from './team';
import { GameProfile } from './GameProfile';

interface IMatchProps {
  /**
   * homeTeam     : 主場隊伍
   * awayTeam     : 客場隊伍
   * label        : 該場賽事標籤
   * gameId       : 該場賽事 ID
   * gameProfile  : 該場賽事資訊
   */
  homeTeam: Team;
  awayTeam: Team;
  label: string;
  gameId: string;
  gameProfile: GameProfile;
}

export class Match implements IMatchProps {
  /* Props & Constructor */
  private _props: IMatchProps;

  constructor(props: any) {
    this._props = {
      homeTeam: new Team(props.homeTeam),
      awayTeam: new Team(props.awayTeam),
      label: '',
      gameId: props.profile.gameId,
      gameProfile: new GameProfile(props.profile)
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
  get label(): string {
    return this._props.label;
  }
  get gameId(): string {
    return this._props.gameId;
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
