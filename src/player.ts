import localize from './localize';
import { PLAYER_POSITION } from './utils/hardcode';

export interface IPlayerProps {
  /**
   * player         : 姓名
   * position       : 位置
   * playingTime    : 上場時間 [mins:secs]
   * points         : 得分
   * rebs           : 籃板
   * assists        : 助攻
   * steals         : 抄截
   * blocks         : 阻攻
   * fg             : 投籃 [fgm-fga-fgp]
   * tp             : 三分 [tpm-tpa-tpp]
   * ft             : 罰球 [ftm-fta-ftp]
   * offRebs        : 進攻籃板
   * defRebs        : 防守籃板
   * turnovers      : 失誤
   * fouls          : 犯規
   * plusMinus      : +/-
   */
  player: string;
  position: string;
  playingTime: string;
  points: number | string;
  rebs: number | string;
  assists: number | string;
  steals: number | string;
  blocks: number | string;
  fg: string;
  tp: string;
  ft: string;
  offRebs: number | string;
  defRebs: number | string;
  turnovers: number | string;
  fouls: number | string;
  plusMinus: string;
}

export class Player implements IPlayerProps {
  /* Props & Constructor */
  private _props: IPlayerProps;

  constructor(data: any) {
    let playerPositon = this.mapPlayerPosition(data.boxscore.position);

    this._props = {
      player: data.profile.displayNameEn,
      position: playerPositon ? localize(`extension.Position${playerPositon}`) : '',
      playingTime: this.makePlayingTime(data) || '-',
      points: data.statTotal.points || 0,
      rebs: data.statTotal.rebs || 0,
      assists: data.statTotal.assists || 0,
      steals: data.statTotal.steals || 0,
      blocks: data.statTotal.blocks || 0,
      fg: this.makeStatText(data.statTotal.fgm, data.statTotal.fga, data.statTotal.fgpct),
      tp: this.makeStatText(data.statTotal.tpm, data.statTotal.tpa, data.statTotal.tppct),
      ft: this.makeStatText(data.statTotal.ftm, data.statTotal.fta, data.statTotal.ftpct),
      offRebs: data.statTotal.offRebs || 0,
      defRebs: data.statTotal.defRebs || 0,
      turnovers: data.statTotal.turnovers || 0,
      fouls: data.statTotal.fouls || 0,
      plusMinus: data.boxscore.plusMinus || '-',
    };
  }

  /* Getters */
  get statMarkup(): string {
    let playerStat = '';
    let propsKey: keyof IPlayerProps;

    for (propsKey in this._props) {
      if (propsKey === 'position') {
        playerStat = playerStat + (this._props[propsKey]
          ? `<td>
              <div class="ui black horizontal label">
                ${this._props[propsKey]}
              </div>
            </td>`
          : `<td></td>`);
      } else {
        playerStat += `
          <td>
            ${this._props[propsKey]}
          </td>
        `;
      }
    }
    return `
      <tr class="center aligned">
        ${playerStat}
      </tr>
    `;
  }

  /* Getters */
  get player(): string {
    return this._props.player;
  }
  get position(): string {
    return this._props.position;
  }
  get playingTime(): string {
    return this._props.playingTime;
  }
  get points(): string | number {
    return this._props.points;
  }
  get rebs(): string | number {
    return this._props.rebs;
  }
  get assists(): string | number {
    return this._props.assists;
  }
  get steals(): string | number {
    return this._props.steals;
  }
  get blocks(): string | number {
    return this._props.blocks;
  }
  get fg(): string {
    return this._props.fg;
  }
  get tp(): string {
    return this._props.tp;
  }
  get ft(): string {
    return this._props.ft;
  }
  get offRebs(): string | number {
    return this._props.offRebs;
  }
  get defRebs(): string | number {
    return this._props.defRebs;
  }
  get turnovers(): string | number {
    return this._props.turnovers;
  }
  get fouls(): string | number {
    return this._props.fouls;
  }
  get plusMinus(): string {
    return this._props.plusMinus;
  }

  /* Methods */
  private makePlayingTime(props: any): string {
    let secs = props.statTotal.secs < 10 ? '0' + props.statTotal.secs : props.statTotal.secs;
    return `${props.statTotal.mins}:${secs}`;
  }
  private makeStatText(made: number, attemped: number, pct: number): string {
    return `${made || 0}-${attemped || 0} (${pct || 0}%)`;
  }
  private mapPlayerPosition(name: string): string {
    let currPlayerPosition = PLAYER_POSITION.find(item => item.name === name);
    return currPlayerPosition?.value || '';
  }
}