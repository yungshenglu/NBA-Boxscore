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
  abbr: Lang
  city: Lang;
  code: string;
  conference: Lang; // Note: use ENUM to show
  division: string; // Note: use ENUM to show
  name: Lang;
}

export class Profile {
  /* Props & Constructor */
  private _props: IProfileProps;

  constructor(props: any) {
    this._props = {
      abbr: new Lang({
        zh: props.displayAbbr,
        en: props.abbr
      }),
      city: new Lang({
        zh: props.city,
        en: props.cityEn
      }),
      code: props.code,
      conference: new Lang({
        zh: props.displayConference,
        en: props.conference
      }),
      division: props.division,
      name: new Lang({
        zh: props.name,
        en: props.nameEn
      })
    };
  }

  /* Getters */
  get abbr(): Lang {
    return this._props.abbr;
  }
  get city(): Lang {
    return this._props.city;
  }
  get code(): string {
    return this._props.code;
  }
  get conference(): Lang {
    return this._props.conference;
  }
  get division(): string {
    return this._props.division;
  }
  get name(): Lang {
    return this._props.name;
  }

  /* Setters */
  set code(code: string) {
    this._props.code = code;
  }
  set division(division: string) {
    this._props.division = division;
  }
}