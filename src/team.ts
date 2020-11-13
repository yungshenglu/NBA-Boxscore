import { Profile } from './profile';
import { Matchup } from './matchup';
import { Score } from './score';

interface ITeamProps {
  /**
   * profile        : 隊伍資訊
   * matchup        : 對戰紀錄
   * score          : 比分資訊
   */
  profile: Profile
  matchup: Matchup
  score: Score
}

export class Team {
  /* Props & Constructor */
  private _props: ITeamProps;

  constructor(props: any) {
    this._props = {
      profile: new Profile(props.profile),
      matchup: new Matchup(props.matchup),
      score: new Score(props.score)
    };
  }

  /* Getters */
  get profile(): Profile {
    return this._props.profile;
  }
  get matchup(): Matchup {
    return this._props.matchup;
  }
  get score(): Score {
    return this._props.score;
  }
}
