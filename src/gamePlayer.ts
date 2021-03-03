import localize from './localize';
import { PLAYER_POSITION } from './utils/hardcode';

export interface IGamePlayerProps {
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

export class GamePlayer implements IGamePlayerProps {
  /* Props & Constructor */
  private _props: IGamePlayerProps;

  constructor(props: any) {
    let playerPositon = this.mapPlayerPosition(props.boxscore.position);

    this._props = {
      player: props.profile.displayNameEn,
      position: playerPositon ? localize(`extension.Position${playerPositon}`) : '',
      playingTime: this.makePlayingTime(props) || '-',
      points: props.statTotal.points || 0,
      rebs: props.statTotal.rebs || 0,
      assists: props.statTotal.assists || 0,
      steals: props.statTotal.steals || 0,
      blocks: props.statTotal.blocks || 0,
      fg: this.makeStatText(props.statTotal.fgm, props.statTotal.fga, props.statTotal.fgpct),
      tp: this.makeStatText(props.statTotal.tpm, props.statTotal.tpa, props.statTotal.tppct),
      ft: this.makeStatText(props.statTotal.ftm, props.statTotal.fta, props.statTotal.ftpct),
      offRebs: props.statTotal.offRebs || 0,
      defRebs: props.statTotal.defRebs || 0,
      turnovers: props.statTotal.turnovers || 0,
      fouls: props.statTotal.fouls || 0,
      plusMinus: props.boxscore.plusMinus || '-',
    };
  }

  /* Getters */
  get statMarkup(): string {
    let playerStat = '';
    let propsKey: keyof IGamePlayerProps;
    // console.log('this._props: ', this._props);

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

  /* Setters */
  set player(player: string) {
    this._props.player = player;
  }
  set position(position: string) {
    this._props.position = position;
  }
  set playingTime(playingTime: string) {
    this._props.playingTime = playingTime || '-';
  }
  set points(points: number) {
    this._props.points = points || 0;
  }
  set rebs(rebs: number) {
    this._props.rebs = rebs || 0;
  }
  set assists(assists: number) {
    this._props.assists = assists || 0;
  }
  set steals(steals: number) {
    this._props.steals = steals || 0;
  }
  set blocks(blocks: number) {
    this._props.blocks = blocks || 0;
  }
  set fg(fg: string) {
    this._props.fg = fg || '-';
  }
  set tp(tp: string) {
    this._props.tp = tp || '-';
  }
  set ft(ft: string) {
    this._props.ft = ft || '-';
  }
  set offRebs(offRebs: number) {
    this._props.offRebs = offRebs || 0;
  }
  set defRebs(defRebs: number) {
    this._props.defRebs = defRebs || 0;
  }
  set turnovers(turnovers: number) {
    this._props.turnovers = turnovers || 0;
  }
  set fouls(fouls: number) {
    this._props.fouls = fouls || 0;
  }
  set plusMinus(plusMinus: string) {
    this._props.plusMinus = plusMinus || '-';
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