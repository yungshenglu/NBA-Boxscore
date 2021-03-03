interface ILangProps {
  /**
   * tw     : 繁體中文
   * cn     : 簡體中文
   * en     : 英文
   * ja     : 日文
   */
  tw: string;
  cn: string;
  en: string;
  ja: string;
}

export class Lang implements ILangProps {
  /* Props & Constructor */
  private _props: ILangProps;

  constructor(props: any) {
    this._props = {
      tw: props.tw,
      cn: props.cn,
      en: props.en,
      ja: props.ja
    };
  }

  /* Getters */
  get tw(): string {
    return this._props.tw;
  }
  get cn(): string {
    return this._props.cn;
  }
  get en(): string {
    return this._props.en;
  }
  get ja(): string {
    return this._props.ja;
  }

  /* Setters */
  set tw(tw: string) {
    this._props.tw = tw;
  }
  set cn(cn: string) {
    this._props.cn = cn;
  }
  set en(en: string) {
    this._props.en = en;
  }
  set ja(ja: string) {
    this._props.ja = ja;
  }
}