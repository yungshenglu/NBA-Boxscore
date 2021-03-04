import localize from './localize';
import { MATCH_STATUS } from './utils/hardcode';

interface IScoreProps {
  /**
   * homeScore      : 主場球隊總分
   * awayScore      : 客場球隊總分
   * gameLength     : 該場賽事時間長度
   * period         : 該場賽事該節
   * periodClock    : 該場賽事該節時間
   * status         : 該場賽事狀態
   * statusDesc     : 該場賽事狀態文字
   * statusColor    : 該場賽事狀態文字顏色
   * ties           : 該場賽事平手 (NOT SUPPORT)
   * timeEt         : 該場賽事時間
   */
  homeScore: number;
  awayScore: number;
  gameLength: string;
  period: string;
  periodClock: string;
  status: string;
  statusDesc: string;
  statusColor: string;
  ties: string;
  timeEt: string;
}

export class Score implements IScoreProps {
  /* Props & Constructor */
  private _props: IScoreProps;

  constructor(props: any, dateTimeEt: string) {
    this._props = {
      homeScore: props.homeScore,
      awayScore: props.awayScore,
      gameLength: props.gameLength,
      period: props.period || '',
      periodClock: props.periodClock || '',
      status: props.status,
      statusDesc: '',
      statusColor: '',
      ties: props.ties,
      timeEt: `${dateTimeEt.split('T')[1]} ET`
    };

    this._props.statusDesc = this.mapMatchStatusDesc(props.statusDesc);
    this._props.statusColor = this.mapMatchStatusColor(props.statusDesc);
  }

  /* Getters */
  get homeScore(): number {
    return this._props.homeScore;
  }
  get awayScore(): number {
    return this._props.awayScore;
  }
  get gameLength(): string {
    return this._props.gameLength;
  }
  get period(): string {
    return this._props.period;
  }
  get periodClock(): string {
    return this._props.periodClock;
  }
  get status(): string {
    return this._props.status;
  }
  get statusDesc(): string {
    return this._props.statusDesc;
  }
  get statusColor(): string {
    return this._props.statusColor;
  }
  get ties(): string {
    return this._props.ties;
  }
  get timeEt(): string {
    return this._props.timeEt;
  }

  /* Methods */
  private mapMatchStatusDesc(originalDesc: string): string {
    switch (this._props.status) {
      case '1':
        return originalDesc !== '延期'
          ? this._props.timeEt
          : localize('extension.Postpone');
      case '2': {
        if (this._props.periodClock === '0.0') {
          if (this._props.period === '2') {
            return localize('extension.HalfTime');
          } else {
            return localize(`extension.Quarter${this._props.period}End`);
          }
        } else {
          return localize(`extension.Quarter${this._props.period}`);
        }
      }
      case '3':
        return localize('extension.MatchEnd');
      case '4':
        return localize('extension.Postpone');
      default:
        return '';
    }
  }
  private mapMatchStatusColor(originalDesc: string): string {
    if (originalDesc === '延期') {
      return MATCH_STATUS[3].color;
    }

    let currStatus = MATCH_STATUS.find(item => item.value === this._props.status);
    return currStatus?.color || '';
  }
}
