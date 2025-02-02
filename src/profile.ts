import localize from './localize';
import { API_URL, DIVISION } from './utils/hardcode';

interface IProfileProps {
  /**
   * abbr         : 中英文隊伍縮寫
   * city         : 中英文城市名稱
   * code         : 英文隊名代號
   * conference   : 英文聯盟名稱
   * division     : 中文分區名稱
   * name         : 中英文隊伍名稱
   * logoUrl      : 隊徽網址
   */
  abbr: string
  city: string;
  code: string;
  conference: string;
  division: string;
  name: string;
  logoUrl: string;
}

export class Profile implements IProfileProps {
  /* Props & Constructor */
  private _props: IProfileProps;

  constructor(data: any, isAllStarGame: boolean) {
    this._props = {
      abbr: isAllStarGame
        ? `Team ${data.nameEn}`
        : localize(`extension.TeamAbbr${data.abbr}`),
      city: localize(`extension.City${data.abbr}`),
      code: data.abbr,
      conference: localize(`extension.Conf${data.conference}`),
      division: localize(`extension.Div${this.mapDivison(data.division)}`),
      name: isAllStarGame
        ? `Team ${data.nameEn}`
        : localize(`extension.TeamAbbr${data.abbr}`),
      logoUrl: this.mapLogoUrl(data.abbr)
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
  get conference(): string {
    return this._props.conference;
  }
  get division(): string {
    return this._props.division;
  }
  get name(): string {
    return this._props.name;
  }
  get logoUrl(): string {
    return this._props.logoUrl;
  }

  /* Methods */
  private mapDivison(data: string): string {
    return DIVISION.find(item => item.name === data)?.key || '';
  }

  private mapLogoUrl(teamCode: string): string {
    let apiUrl = API_URL.find(item => item.name === 'logo')?.url || '';
    let logoUrl = apiUrl !== ''
      ? apiUrl.replace('{teamCode}', teamCode)
      : apiUrl;
    return logoUrl;
  }
}