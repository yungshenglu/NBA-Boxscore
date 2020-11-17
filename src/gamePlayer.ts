interface IGamePlayerProps {
  /**
   * name         : 姓名
   * position     : 位置
   * playingTime  : 上場時間 [mins:secs]
   * points       : 得分
   * rebs         : 籃板
   * assists      : 助攻
   * steals       : 抄截
   * blocks       : 阻攻
   * fg           : 投籃 [fgm-fga]
   * fgpct        : 投籃%
   * tp           : 三分 [tpm-tpa]
   * tppct        : 三分%
   * ft           : 罰球 [ftm-fta]
   * ftpct        : 罰球%
   * offRebs      : 進攻籃板
   * defRebs      : 防守籃板
   * turnovers    : 失誤
   * fouls        : 犯規
   * plusMinus    : +/-
   */
  name: string;
  position: string;
  playingTime: string;
  points: number;
  rebs: number;
  assists: number;
  steals: number;
  blocks: number;
  fgStat: string;
  tpStat: string;
  ftStat: string;
  offRebs: number;
  defRebs: number;
  turnovers: number;
  fouls: number;
  plusMinus: string;
}

export class GamePlayer implements IGamePlayerProps {
  /* Props & Constructor */
  private _props: IGamePlayerProps;

  constructor(props: any) {
    this._props = {
      name: props.profile.displayNameEn,
      position: props.boxscore.position || '',
      playingTime: this.makePlayingTime(props),
      points: props.statTotal.points,
      rebs: props.statTotal.rebs,
      assists: props.statTotal.assists,
      steals: props.statTotal.steals,
      blocks: props.statTotal.blocks,
      fgStat: this.makeStatText(props.statTotal.fgm, props.statTotal.fga, props.statTotal.fgpct),
      tpStat: this.makeStatText(props.statTotal.tpm, props.statTotal.tpa, props.statTotal.tppct),
      ftStat: this.makeStatText(props.statTotal.ftm, props.statTotal.fta, props.statTotal.ftpct),
      offRebs: props.statTotal.offRebs,
      defRebs: props.statTotal.defRebs,
      turnovers: props.statTotal.turnovers,
      fouls: props.statTotal.fouls,
      plusMinus: props.boxscore.plusMinus,
    };
  }

  /* Getters */
  get statMarkup(): string {
    let playerStat = '';
    Object.keys(this._props).forEach((key: any) => {
      playerStat += `
        <td>${this._props[key]}</td>
      `;
    });

    return `
      <tr class="center aligned">
        ${playerStat}
      </tr>
    `;
  }

  /* Setters */
  set name(name: string) {
    this._props.name = name;
  }
  set position(position: string) {
    this._props.position = position;
  }
  set playingTime(playingTime: string) {
    this._props.playingTime = playingTime;
  }
  set points(points: number) {
    this._props.points = points;
  }
  set rebs(rebs: number) {
    this._props.rebs = rebs;
  }
  set assists(assists: number) {
    this._props.assists = assists;
  }
  set steals(steals: number) {
    this._props.steals = steals;
  }
  set blocks(blocks: number) {
    this._props.blocks = blocks;
  }
  set fgStat(fgStat: string) {
    this._props.fgStat = fgStat;
  }
  set tpStat(tpStat: string) {
    this._props.tpStat = tpStat;
  }
  set ftStat(ftStat: string) {
    this._props.ftStat = ftStat;
  }
  set offRebs(offRebs: number) {
    this._props.offRebs = offRebs;
  }
  set defRebs(defRebs: number) {
    this._props.defRebs = defRebs;
  }
  set turnovers(turnovers: number) {
    this._props.turnovers = turnovers;
  }
  set fouls(fouls: number) {
    this._props.fouls = fouls;
  }
  set plusMinus(plusMinus: string) {
    this._props.plusMinus = plusMinus;
  }

  /* Methods */
  private makePlayingTime(props: any): string {
    let secs = props.statTotal.secs < 10 ? '0' + props.statTotal.secs : props.statTotal.secs;
    return `${props.statTotal.mins}:${secs}`;
  }
  private makeStatText(made: number, attemped: number, pct: number): string {
    return `${made}-${attemped}\n(${pct}%)`;
  }
}