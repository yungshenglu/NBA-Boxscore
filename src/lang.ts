import * as vscode from 'vscode';
interface ILangProps {
  /**
   * systemLang   : VSCode 系統語言
   */
  systemLang: string
}

export class Lang implements ILangProps {
  /* Props & Constructor */
  private _props: ILangProps;

  constructor() {
    this._props = {
      systemLang: this.getSystemLang()
    };
  }

  /* Getters */
  get systemLang(): string {
    return this._props.systemLang;
  }

  /* Methods */
  private getSystemLang(): string {
    return vscode.env.language.substr(0, 2) === 'zh'
      ? vscode.env.language.split('-')[1]
      : vscode.env.language;
  }
}