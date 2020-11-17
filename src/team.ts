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

export class Team implements ITeamProps {
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
  get teamNameMarkup(): string {
    let teamName = this._props.profile.city.zh + this._props.profile.name.zh;
    return teamName;
  }
  get teamTitleMarkup(): string {
    let teamAbbr = this._props.profile.abbr.en;
    let teamName = this._props.profile.city.zh + this._props.profile.name.zh;
    let teamLogoUrl = `https://tw.global.nba.com/media/img/teams/00/logos/${teamAbbr}_logo.svg`;
    return `
      <img src="${teamLogoUrl}" class="ui image" />
        <h2 class="ui center aligned header">
        ${teamName}
      </h2>
    `;
  }

  /* Setters */
  /* Methods */
}
