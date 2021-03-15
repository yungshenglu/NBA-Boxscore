import localize from './localize';
import { Score } from './score';
import { Team } from './team';
import { RenderStatTable } from './renderStatTable';

interface IMarkupProps {
  /**
   * score          : 賽事分數統計
   * team           : 賽事隊伍
   */
  score: Score
  team: Team;
}

export class Markup implements IMarkupProps {
  /* Props & Constructor */
  private _props: IMarkupProps;

  constructor(props: any) {
    this._props = {
      score: props.score,
      team: props.team
    };
  }

  /* Getters */
  get score(): Score {
    return this._props.score;
  }
  get team(): Team {
    return this._props.team;
  }
  get teamQScoresMarkup(): string {
    let quarterScoreMarkup = `
      <tr class="center aligned">
        <td>
          ${this._props.team.profile.code}
        </td>
        ${this._props.score.qScoresMarkup}
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
    let isDataExist = this._props.team.gamePlayers.length > 0;
    if (isDataExist) {
      const gamePlayers = this._props.team.gamePlayers;
      for (let i = 0; i < gamePlayers.length; ++i) {
        teamStatMarkup += gamePlayers[i].statMarkup;
      }
    } else {
      teamStatMarkup = `
        <tr class="center aligned">
          <td colspan="16">
            <h3 class="ui icon inverted header">
              <i class="folder icon"></i>
              <div class="content">
                ${localize('extension.NoData')}
              </div>
            </h3>
          </td>
        </tr>
      `;
    }

    return teamStatMarkup;
  }
}