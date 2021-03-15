import { isAllStarGameDate } from './utils';
import { Profile } from './profile';
import { Matchup } from './matchup';
import { Player } from './player';

interface ITeamProps {
  /**
   * profile        : 隊伍資訊
   * matchup        : 對戰紀錄
   * players        : 球員比賽紀錄
   */
  profile: Profile;
  matchup: Matchup;
  gamePlayers: Array<Player>;
}

export class Team implements ITeamProps {
  /* Props & Constructor */
  private _props: ITeamProps;

  constructor(data: any, gameDateTime: string) {
    const isAllStarGame = isAllStarGameDate(gameDateTime);
    this._props = {
      profile: new Profile(data.profile, isAllStarGame),
      matchup: new Matchup(data.matchup, isAllStarGame),
      gamePlayers: []
    };
  }

  /* Getters */
  get profile(): Profile {
    return this._props.profile;
  }
  get matchup(): Matchup {
    return this._props.matchup;
  }
  get gamePlayers(): Array<Player> {
    return this._props.gamePlayers;
  }

  /* Setters */
  set gamePlayers(gamePlayers: Array<Player>) {
    this._props.gamePlayers = gamePlayers;
  }
}
