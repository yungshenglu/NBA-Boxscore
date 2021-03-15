import localize from './localize';
import { SCHEDULE } from './utils/hardcode';

interface IGameProfile {
  /**
   * arenaLocation    : 該場賽事地點
   * arenaName        : 該場賽事球場
   * gameId           : 該場賽事 ID
   * gameDateTime     : 該場賽事日期時間
   * gameType         : 該場賽事類型
   * awayTeamId       : 主場隊伍 ID
   * homeTeamId       : 客場隊伍 ID
   */
  arenaLocation: string;
  arenaName: string;
  gameId: string;
  gameDateTime: string;
  gameType: string;
  awayTeamId: string;
  homeTeamId: string;
}

export class GameProfile implements IGameProfile {
  /* Props & Constructor */
  private _props: IGameProfile;

  constructor(props: any, homeTeamCode: string, isAllStarGame: boolean) {
    this._props = {
      arenaLocation: isAllStarGame
        ? localize(`extension.ArenaLocation${SCHEDULE.find(item => item.key === '2')?.arena}`)
        : localize(`extension.ArenaLocation${homeTeamCode}`),
      arenaName: isAllStarGame
        ? localize(`extension.ArenaName${SCHEDULE.find(item => item.key === '2')?.arena}`)
        : localize(`extension.ArenaName${homeTeamCode}`),
      gameId: props.gameId,
      gameDateTime: this.mapGameDateTimeFormat(props.dateTimeEt),
      gameType: localize(`extension.${this.mapGameType(props.dateTimeEt)}`),
      awayTeamId: props.awayTeamId,
      homeTeamId: props.homeTeamId
    };
  }

  /* Getters */
  get arenaLocation(): string {
    return this._props.arenaLocation;
  }
  get arenaName(): string {
    return this._props.arenaName;
  }
  get gameId(): string {
    return this._props.gameId;
  }
  get gameDateTime(): string {
    return this._props.gameDateTime;
  }
  get gameType(): string {
    return this._props.gameType;
  }
  get awayTeamId(): string {
    return this._props.awayTeamId;
  }
  get homeTeamId(): string {
    return this._props.homeTeamId;
  }

  /* Methods */
  private mapGameDateTimeFormat(dateTimeEt: string): string {
    return dateTimeEt.replace('T', ' ');
  }

  private mapGameType(dateTimeEt: string): string {
    let gameDate = dateTimeEt.split('T')[0];
    let gameType = SCHEDULE.find(item =>
      (gameDate === item.start && gameDate === item.end)
    )?.name || '';
    gameType = gameType === ''
      ? SCHEDULE.find(item =>
        (gameDate >= item.start && gameDate <= item.end)
      )?.name || ''
      : gameType;
    return gameType;
  }
}