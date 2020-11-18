import { GamePlayer } from './gamePlayer';
import { Team } from './team';

interface IMarkupProps {
  /**
   * gamePlayers    : 球隊隊員
   * team           : 隊伍
   */
  gamePlayers: [];
  team: Team;
}

export class Markup implements IMarkupProps {
  /* Props & Constructor */
  private _props: IMarkupProps;

  constructor(props: any) {
    this._props = {
      gamePlayers: props.gamePlayers,
      team: props.team,
    };
  }

  /* Getters */
  get gamePlayers(): [] {
    return this._props.gamePlayers;
  }
  get team(): Team {
    return this._props.team;
  }
  get teamQScoresMarkup(): string {
    let quarterScoreMarkup = `
      <tr class="center aligned">
        <td>${this._props.team.profile.name.zh}</td>
        ${this._props.team.score.qScoresMarkup}
      </tr>
    `;
    return quarterScoreMarkup;
  }
  get teamStatMarkup(): string {
    let teamStatMarkup = '';
    for (let i = 0; i < this._props.gamePlayers.length; ++i) {
      let gamePlayer = new GamePlayer(this._props.gamePlayers[i]);
      teamStatMarkup += gamePlayer.statMarkup;
    }
    return teamStatMarkup;
  }

  /* Setters */
  set gamePlayers(gamePlayers: []) {
    this._props.gamePlayers = gamePlayers;
  }
  set team(team: Team) {
    this._props.team = team;
  }

  /* Methods */
}