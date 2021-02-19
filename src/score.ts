interface IScoreProps {
  /**
   * homeScore      : 主場球隊總分
   * awayScore      : 客場球隊總分
   * gameLength     : 該場賽事時間長度
   * period         : 該場賽事該節
   * periodClock    : 該場賽事該節時間
   * status         : 該場賽事狀態
   * statusDesc     : 該場賽事狀態文字
   * ties           : 該場賽事平手
   */
  homeScore: number;
  awayScore: number;
  gameLength: string;
  period: number;
  periodClock: string;
  status: number;
  statusDesc: string;
  ties: number;
}

export class Score implements IScoreProps {
  /* Props & Constructor */
  private _props: IScoreProps;

  constructor(props: any) {
    console.log('gameStatus: ', props);

    this._props = {
      homeScore: props.homeScore,
      awayScore: props.awayScore,
      gameLength: props.gameLength,
      period: props.period,
      periodClock: props.periodClock,
      status: props.status,
      statusDesc: props.statusDesc,
      ties: props.ties
    };
  }

  /* Getters */
  get period(): number {
    return this._props.period;
  }
  get periodClock(): string {
    return this._props.periodClock;
  }
  get status(): number {
    return this._props.status;
  }
  get statusDesc(): string {
    return this._props.statusDesc;
  }

  /* Setters */
  set homeScore(homeScore: number) {
    this._props.homeScore = homeScore;
  }
  set awayScore(awayScore: number) {
    this._props.awayScore = awayScore;
  }
  set gameLength(gameLength: string) {
    this._props.gameLength = gameLength;
  }
  set ties(ties: number) {
    this._props.ties = ties;
  }
}
