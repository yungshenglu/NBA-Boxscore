import { Team } from './team';

interface IMatchProps {
  /**
   * homeTeam     : 主場隊伍
   * awayTeam     : 客場隊伍
   * matchLabel   : 對戰隊伍 (主場隊伍 - 客場隊伍)
   */
  homeTeam: Team
  awayTeam: Team
  label: string
}

export class Match {
  /* Props & Constructor */
  private _props: IMatchProps;

  constructor(props: any) {
    this._props = {
      homeTeam: new Team(props.homeTeam),
      awayTeam: new Team(props.awayTeam),
      label: ''
    };
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

  /* Setters */

  /* Methods */
  public getMatchStatusText(): string {
    return `${this._props.homeTeam.profile.abbr.zh}  ${this._props.homeTeam.score.finalScore} : ${this._props.awayTeam.score.finalScore}  ${this._props.awayTeam.profile.abbr.zh}`;
  }

  public setMatchLabel() {
    this._props.label = `${this._props.homeTeam.profile.abbr.zh} - ${this._props.awayTeam.profile.abbr.zh}`;
  }
}
