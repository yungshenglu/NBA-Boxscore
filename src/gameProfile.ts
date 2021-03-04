import localize from './localize';

interface IGameProfile {
  /**
   * arenaLocation    : 該場比賽地點
   * arenaName        : 該場比賽球場
   * gameId           : 該場比賽 ID
   * awayTeamId       : 主場隊伍 ID
   * homeTeamId       : 客場隊伍 ID
   */
  arenaLocation: string;
  arenaName: string;
  gameId: string;
  awayTeamId: string;
  homeTeamId: string;
}

export class GameProfile implements IGameProfile {
  /* Props & Constructor */
  private _props: IGameProfile;

  constructor(props: any, homeTeamCode: string) {
    this._props = {
      arenaLocation: localize(`extension.ArenaLocation${homeTeamCode}`),
      arenaName: localize(`extension.ArenaName${homeTeamCode}`),
      gameId: props.gameId,
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
  get awayTeamId(): string {
    return this._props.awayTeamId;
  }
  get homeTeamId(): string {
    return this._props.homeTeamId;
  }
}