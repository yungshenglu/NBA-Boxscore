import localize from './localize';
import { IGamePlayerProps } from './gamePlayer';

export class RenderStatTable {
  /* Props & Constructor */
  private _props: IGamePlayerProps;

  constructor() {
    this._props = {
      player: localize('extension.Player'),
      position: localize('extension.Position'),
      playingTime: localize('extension.PlayingTime'),
      points: localize('extension.Points'),
      rebs: localize('extension.Rebs'),
      assists: localize('extension.Assists'),
      steals: localize('extension.Steals'),
      blocks: localize('extension.Blocks'),
      fg: localize('extension.FG'),
      tp: localize('extension.TP'),
      ft: localize('extension.FT'),
      offRebs: localize('extension.OffRebs'),
      defRebs: localize('extension.DefRebs'),
      turnovers: localize('extension.Turnovers'),
      fouls: localize('extension.Fouls'),
      plusMinus: localize('extension.PlusMinus'),
    };
  }

  /* Getters */
  get tableHeader(): string {
    let tableHeader = '';
    let propsKey: keyof IGamePlayerProps;
    for (propsKey in this._props) {
      tableHeader = tableHeader + ((propsKey === 'player') ? `
        <th data-field="${propsKey}" class="two wide">
          ${this._props[propsKey]}
        </th>
      ` : `
        <th data-field="${propsKey}">
          ${this._props[propsKey]}
        </th>
      `);
    }
    return `
      <tr class="center aligned">
        ${tableHeader}
      </tr>
    `;
  }
}
