import { GamePlayer } from './gamePlayer';
import { Team } from './team';

interface IMarkupProps {
  /**
   * statMarkup     : 球員統計資訊 HTML Markup
   * statCount      : 球員個數
   * teamNameMarkup : 隊伍名稱 HTML Markup
   * teamLogoMarkup : 球隊隊徽 HTML Markup
   */
  statMarkup: string;
  statCount: number;
  teamTitleMarkup: string;
  teamNameMarkup: string;
}

export class Markup implements IMarkupProps {
  /* Props & Constructor */
  private _props: IMarkupProps;

  constructor(gamePlayer: [], team: Team) {
    this._props = {
      statMarkup: this.makeStatListMarkup(gamePlayer),
      statCount: gamePlayer.length,
      teamTitleMarkup: team.teamTitleMarkup,
      teamNameMarkup: team.teamNameMarkup
    };
  }

  /* Getters */
  get statMarkup(): string {
    return this._props.statMarkup;
  }
  get statCount(): number {
    return this._props.statCount;
  }
  get teamTitleMarkup(): string {
    return this._props.teamTitleMarkup;
  }
  get teamNameMarkup(): string {
    return this._props.teamNameMarkup;
  }

  /* Setters */

  /* Methods */
  private makeStatListMarkup(data: []): string {
    let statListMarkup = '';
    for (let i = 0; i < data.length; ++i) {
      let gamePlayer = new GamePlayer(data[i]);
      statListMarkup += gamePlayer.statMarkup;
    }
    return statListMarkup;
  }
}