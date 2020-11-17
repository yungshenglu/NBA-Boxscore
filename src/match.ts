import { Team } from './team';

interface IMatchProps {
  /**
   * homeTeam     : 主場隊伍
   * awayTeam     : 客場隊伍
   * label        : 對戰標籤文字
   * gameId       : 對戰 ID
   */
  homeTeam: Team;
  awayTeam: Team;
  label: string;
  gameId: string;
}

export class Match implements IMatchProps {
  /* Props & Constructor */
  private _props: IMatchProps;

  constructor(props: any) {
    this._props = {
      homeTeam: new Team(props.homeTeam),
      awayTeam: new Team(props.awayTeam),
      label: '',
      gameId: props.profile.gameId
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
  get matchStatusText(): string {
    return `${this._props.homeTeam.profile.abbr.zh}  ${this._props.homeTeam.score.finalScore} : ${this._props.awayTeam.score.finalScore}  ${this._props.awayTeam.profile.abbr.zh}`;
  }

  /* Setters */

  /* Methods */
  public setMatchLabel() {
    this._props.label = `${this._props.homeTeam.profile.abbr.zh} - ${this._props.awayTeam.profile.abbr.zh}`;
  }
}
