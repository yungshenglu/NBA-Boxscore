const crawler = require('crawler');

import * as vscode from 'vscode';
import { Match } from './match';

interface ISnapshotProps {
  /**
   * match              : 該場賽事資訊
   * snapshotUrl        : 該場賽事詳細資訊 API 連結
   * snapshotHtml       : 該場賽事的 HTML
   * snapshotCrawler    : 該場賽事爬蟲
   * currentPanel       : 該場賽事的分頁
   * isDisposed         :
   */
  match: Match,
  snapshotUrl: string,
  snapshotHtml: string,
  snapshotCrawler: typeof crawler
  currentPanel: any,
  currentPanelId: string,
  timer: any
  isDisposed: Boolean
}

export class Snapshot {
  /* Props & Constructor */
  private _props: ISnapshotProps;

  constructor(currentMatch: Match) {
    this._props = {
      match: currentMatch,
      snapshotUrl: 'https://tw.global.nba.com/stats2/game/snapshot.json?countryCode=TW&gameId=0021901268&locale=zh_TW&tz=%2B8',
      snapshotHtml: '',
      snapshotCrawler: new crawler(),
      currentPanel: null,
      currentPanelId: '0021901268',
      timer: null,
      isDisposed: false
    };
  }

  /* Methods */
  public getSnapshot() {
    const showIn: any = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (this._props.currentPanel && !this._props.isDisposed) {
      // If we already have a panel, show it in the target column
      this._props.currentPanel.reveal(showIn);
    } else {
      this._props.isDisposed = false;
      this._props.currentPanel = vscode.window.createWebviewPanel(
        this._props.currentPanelId,
        this._props.match.matchLabel,
        showIn,
        {
          // Enable JavaScript in the Web-view
          enableScripts: true
          // And restrict the webview to only loading content from our extension's `media` directory.
          // localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'media'))]
        }
      );
      this._props.currentPanel.onDidDispose(() => {
        this._props.isDisposed = true;
        clearTimeout(this._props.timer);
      });
      this._props.currentPanel.onDidChangeViewState((e: any) => {
        const panel = e.webviewPanel;
        // panel.title = panel.visible ? this.match.label : temptList[Math.floor(Math.random() * 10 - 1)] || '...'
        panel.title = 'README.md';
      });
    }
    this.setPanelHtml();
  }

  private setPanelHtml() {
    this._props.snapshotCrawler.queue([
      {
        url: this._props.snapshotUrl,
        callback: (err: Error, res: any, done: Function) => {
          try {
            if (!err) {
              let matchSnapshot = JSON.parse(res.body);
              console.log(matchSnapshot);
            }
          } catch (err) {
            console.log('[ERROR] ', err);
          }
        }
      }
    ]);
  }
};