import * as vscode from 'vscode';
import { GamePlayer } from './gamePlayer';
import { Team } from './team';
import { RenderStatTable } from './renderStatTable';
import { Lang } from './lang';

interface IMarkupProps {
  /**
   * gamePlayers    : 球隊隊員
   * team           : 隊伍
   */
  gamePlayers: GamePlayer[];
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
  get gamePlayers(): GamePlayer[] {
    return this._props.gamePlayers;
  }
  get team(): Team {
    return this._props.team;
  }
  get teamQScoresMarkup(): string {
    type LangKey = keyof Lang;
    let currLang = vscode.env.language.substr(0, 2) === 'zh' ? vscode.env.language.split('-')[1] : vscode.env.language;

    let quarterScoreMarkup = `
      <tr class="center aligned">
        <td>
          ${this._props.team.profile.code}
        </td>
        ${this._props.team.boxscore.qScoresMarkup}
      </tr>
    `;
    return quarterScoreMarkup;
  }
  get teamStatTableHeader(): string {
    let statTable = new RenderStatTable();
    return statTable.tableHeader;
  }
  get teamStatMarkup(): string {
    let teamStatMarkup = '';
    let isDataExist = this._props.gamePlayers.length > 0;
    if (isDataExist) {
      for (let i = 0; i < this._props.gamePlayers.length; ++i) {
        let gamePlayer = new GamePlayer(this._props.gamePlayers[i]);
        teamStatMarkup += gamePlayer.statMarkup;
      }
    } else {
      teamStatMarkup = `
        <tr class="center aligned">
          <td colspan="16">
            <h3 class="ui icon inverted header">
              <i class="folder icon"></i>
              <div class="content">
                No data
              </div>
            </h3>
          </td>
        </tr>
      `;
    }

    return teamStatMarkup;
  }

  /* Setters */
  set gamePlayers(gamePlayers: GamePlayer[]) {
    this._props.gamePlayers = gamePlayers;
  }
  set team(team: Team) {
    this._props.team = team;
  }

  /* Methods */
}