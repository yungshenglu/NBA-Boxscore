import { isAllStarGameDate } from './utils';
import { GameProfile } from './gameProfile';
import { Boxscore } from './boxscore';
import { Team } from './team';

interface IMatchProps {
  /**
   * gameProfile  : 該場賽事資訊
   * boxscore     : 該場賽事計分
   * homeTeam     : 主場隊伍
   * awayTeam     : 客場隊伍
   * label        : 該場賽事標籤
   * code         : VSCode 選單編號
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

  constructor(data: any) {
    const gameDateTime = data.profile.dateTimeEt;
    const isAllStarGame = isAllStarGameDate(gameDateTime);
    const matchScore = {
      homeTeam: data.homeTeam.score,
      awayTeam: data.awayTeam.score
    };
    this._props = {
      gameProfile: new GameProfile(data.profile, data.homeTeam.profile.abbr, isAllStarGame),
      boxscore: new Boxscore(data.boxscore, matchScore, gameDateTime),
      homeTeam: new Team(data.homeTeam, gameDateTime),
      awayTeam: new Team(data.awayTeam, gameDateTime),
      label: ''
    };

    // Set current match label
    this.setMatchLabel();
  }

  /* Getters */
  get gameProfile(): GameProfile {
    return this._props.gameProfile;
  }
  get boxscore(): Boxscore {
    return this._props.boxscore;
  }
  get homeTeam(): Team {
    return this._props.homeTeam;
  }
  get awayTeam(): Team {
    return this._props.awayTeam;
  }
  get label(): string {
    return this._props.label;
  }
  get code(): string {
    return this._props.gameProfile.gameId;
  }

  /* Methods */
  public setMatchLabel() {
    this._props.label = `${this._props.awayTeam.profile.abbr}  ${this._props.boxscore.awayScore.finalScore} : ${this._props.boxscore.homeScore.finalScore}  ${this._props.homeTeam.profile.abbr}`;
  }
}
