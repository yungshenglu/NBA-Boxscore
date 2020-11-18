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
  gamrId: string;
  awayTeamId: string;
  homeTeamId: string;
}

export class GameProfile implements IGameProfile {
  /* Props & Constructor */
  private _props: IGameProfile;

  constructor(props: any) {
    this._props = {
      arenaLocation: props.arenaLocation,
      arenaName: props.arenaName,
      gamrId: props.gamrId,
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
  get gamrId(): string {
    return this._props.gamrId;
  }
  get awayTeamId(): string {
    return this._props.awayTeamId;
  }
  get homeTeamId(): string {
    return this._props.homeTeamId;
  }

  /* Setters */
  set arenaLocation(arenaLocation: string) {
    this._props.arenaLocation = arenaLocation;
  }
  set arenaName(arenaName: string) {
    this._props.arenaName = arenaName;
  }
  set gamrId(gamrId: string) {
    this._props.gamrId = gamrId;
  }
  set awayTeamId(awayTeamId: string) {
    this._props.awayTeamId = awayTeamId;
  }
  set homeTeamId(homeTeamId: string) {
    this._props.homeTeamId = homeTeamId;
  }

  /* Methods */
}