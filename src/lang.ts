interface ILangProps {
  /**
   * zh     : 繁體中文
   * en     : 英文
   */
  zh: string,
  en: string
}

export class Lang {
  /* Props & Constructor */
  private _props: ILangProps;

  constructor(props: any) {
    this._props = {
      zh: props.zh,
      en: props.en
    };
  }

  /* Getters */
  get zh(): string {
    return this._props.zh;
  }
  get en(): string {
    return this._props.en;
  }

  /* Setters */
  set zh(zh: string) {
    this._props.zh = zh;
  }
  set en(en: string) {
    this._props.en = en;
  }
}