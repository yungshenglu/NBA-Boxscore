import localize from './localize';
import { Lang } from './lang';

interface IProfileProps {
  /**
   * abbr         : 中英文隊伍縮寫
   * city         : 中英文城市名稱
   * code         : 英文隊名代號
   * conference   : 英文聯盟名稱
   * division     : 中文分區名稱
   * name         : 中英文隊伍名稱
   */
  abbr: string
  city: string;
  code: string;
  conference: Lang; // Note: use ENUM to show
  division: Lang; // Note: use ENUM to show
  name: string;
}

export class Profile implements IProfileProps {
  /* Props & Constructor */
  private _props: IProfileProps;

  constructor(props: any) {
    this._props = {
      abbr: localize(`extension.TeamAbbr${props.abbr}`),
      city: localize(`extension.City${props.abbr}`),
      code: props.abbr,
      conference: new Lang({
        tw: props.displayConference,
        cn: props.displayConference,
        en: props.conference,
        ja: props.conference
      }),
      division: new Lang({
        tw: props.division,
        cn: props.division,
        en: props.division,
        ja: props.division
      }),
      name: localize(`extension.TeamAbbr${props.abbr}`),
    };
  }

  /* Getters */
  get abbr(): string {
    return this._props.abbr;
  }
  get city(): string {
    return this._props.city;
  }
  get code(): string {
    return this._props.code;
  }
  get conference(): Lang {
    return this._props.conference;
  }
  get division(): Lang {
    return this._props.division;
  }
  get name(): string {
    return this._props.name;
  }
  get logoUrl(): string {
    return `https://tw.global.nba.com/media/img/teams/00/logos/${this._props.code}_logo.svg`;
  }

  /* Setters */
  set code(code: string) {
    this._props.code = code;
  }
}