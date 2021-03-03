import { Profile } from './profile';
import { Matchup } from './matchup';
import { Boxscore } from './boxscore';

interface ITeamProps {
  /**
   * profile        : 隊伍資訊
   * matchup        : 對戰紀錄
   * score          : 比分資訊
   */
  profile: Profile
  matchup: Matchup
  boxscore: Boxscore
}

export class Team implements ITeamProps {
  /* Props & Constructor */
  private _props: ITeamProps;

  constructor(props: any) {
    this._props = {
      profile: new Profile(props.profile),
      matchup: new Matchup(props.matchup),
      boxscore: new Boxscore(props.score)
    };
  }

  /* Getters */
  get profile(): Profile {
    return this._props.profile;
  }
  get matchup(): Matchup {
    return this._props.matchup;
  }
  get boxscore(): Boxscore {
    return this._props.boxscore;
  }
}
