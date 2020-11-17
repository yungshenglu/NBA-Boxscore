const fs = require('fs');
const path = require('path');
const crawler = require('crawler');

import * as vscode from 'vscode';
import { Markup } from './markup';
import { Match } from './match';

// REFACT
interface ISnapshotProps {
  /**
   * match                : 該場賽事資訊
   * matchDate            : 該場賽事日期
   * matchScore           : 該場賽事當下比分
   * snapshotUrl          : 該場賽事詳細資訊 API 連結
   * snapshotHtml         : 該場賽事的 HTML
   * snapshotCrawler      : 該場賽事爬蟲
   * panel                : 該場賽事的分頁
   * panelId              : 該場賽事的分頁 ID
   * timer                : 時間 (NOT SUPPORTED)
   * isDisposed           : 分頁是否被開啟
   * homeTeamTitleMarkup  : 主隊隊徽 Markup HTML
   * awayTeamTitleMarkup  : 客隊隊徽 Markup HTML
   * homeTeamNameMarkup   : 主隊隊名 Markup HTML
   * awayTeamNameMarkup   : 客隊隊名 Markup HTML
   */
  match: Match;
  matchDate: string;
  matchScore: string;
  snapshotUrl: string;
  snapshotHtml: string;
  snapshotCrawler: typeof crawler;
  panel: any;
  panelId: string;
  timer: any;
  isDisposed: Boolean;
  homeTeamTitleMarkup: string;
  awayTeamTitleMarkup: string;
  homeTeamNameMarkup: string;
  awayTeamNameMarkup: string;
}

export class Snapshot implements ISnapshotProps {
  /* Props & Constructor */
  private _props: ISnapshotProps;

  constructor(props: any) {
    this._props = {
      match: props.match,
      matchDate: props.matchDate,
      matchScore: props.matchScore,
      snapshotUrl: `https://tw.global.nba.com/stats2/game/snapshot.json?countryCode=TW&gameId=${props.match.gameId}&locale=zh_TW&tz=%2B8`,
      snapshotHtml: '',
      snapshotCrawler: new crawler(),
      panel: '',
      panelId: props.match.gameId,
      timer: '',  // NOT SUPPORT
      isDisposed: false,
      homeTeamTitleMarkup: '',
      awayTeamTitleMarkup: '',
      homeTeamNameMarkup: '',
      awayTeamNameMarkup: ''
    };
  }

  /* Getters */

  /* Setters */
  set match(match: Match) {
    this._props.match = match;
  }
  set matchDate(matchDate: string) {
    this._props.matchDate = matchDate;
  }
  set matchScore(matchScore: string) {
    this._props.matchScore = matchScore;
  }
  set snapshotUrl(snapshotUrl: string) {
    this._props.snapshotUrl = snapshotUrl;
  }
  set snapshotHtml(snapshotHtml: string) {
    this._props.snapshotHtml = snapshotHtml;
  }
  set snapshotCrawler(snapshotCrawler: typeof crawler) {
    this._props.snapshotCrawler = snapshotCrawler;
  }
  set panel(panel: any) {
    this._props.panel = panel;
  }
  set panelId(panelId: string) {
    this._props.panelId = panelId;
  }
  set timer(timer: any) {
    this._props.timer = timer;
  }
  set isDisposed(isDisposed: Boolean) {
    this._props.isDisposed = isDisposed;
  }
  set homeTeamTitleMarkup(homeTeamTitleMarkup: any) {
    this._props.homeTeamTitleMarkup = homeTeamTitleMarkup;
  }
  set awayTeamTitleMarkup(awayTeamTitleMarkup: any) {
    this._props.awayTeamTitleMarkup = awayTeamTitleMarkup;
  }
  set homeTeamNameMarkup(homeTeamNameMarkup: any) {
    this._props.homeTeamNameMarkup = homeTeamNameMarkup;
  }
  set awayTeamNameMarkup(awayTeamNameMarkup: any) {
    this._props.awayTeamNameMarkup = awayTeamNameMarkup;
  }

  /* Methods */
  public getSnapshot() {
    const existedPanel: any = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (this._props.panel && !this._props.isDisposed) {
      // If we already have a panel, show it in the target column
      this._props.panel.reveal(existedPanel);
    } else {
      this._props.isDisposed = false;
      this._props.panel = vscode.window.createWebviewPanel(
        this._props.panelId,
        this._props.match.label,
        existedPanel,
        {
          // Enable JavaScript in the Web-view
          enableScripts: true
          // And restrict the webview to only loading content from our extension's `media` directory.
          // localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'media'))]
        }
      );
      this._props.panel.onDidDispose(() => {
        this._props.isDisposed = true;
        clearTimeout(this._props.timer);
      });
      this._props.panel.onDidChangeViewState((e: any) => {
        const panel = e.webviewPanel;
        panel.title = `${this._props.matchDate} | ${this._props.matchScore}`;
      });
    }
    this.setMarkupData();
  }

  private setMarkupData() {
    this._props.snapshotCrawler.queue([
      {
        url: this._props.snapshotUrl,
        callback: (err: Error, res: any, done: Function) => {
          try {
            if (!err) {
              let matchSnapshot = JSON.parse(res.body).payload;
              let matchSnapshotData = {
                homeTeam: matchSnapshot.homeTeam.gamePlayers,
                awayTeam: matchSnapshot.awayTeam.gamePlayers
              };

              // REFACT
              const homeTeamStatMarkup = new Markup(matchSnapshotData.homeTeam, this._props.match.homeTeam);
              const awayTeamStatMarkup = new Markup(matchSnapshotData.awayTeam, this._props.match.awayTeam);

              this._props.homeTeamTitleMarkup = homeTeamStatMarkup.teamTitleMarkup;
              this._props.awayTeamTitleMarkup = awayTeamStatMarkup.teamTitleMarkup;

              this._props.homeTeamNameMarkup = homeTeamStatMarkup.teamNameMarkup;
              this._props.awayTeamNameMarkup = awayTeamStatMarkup.teamNameMarkup;

              this._props.panel.webview.html = this.generatePanel(
                homeTeamStatMarkup.statMarkup,
                awayTeamStatMarkup.statMarkup
              );
              // this.timer = setTimeout(() => {
              //     this.setPanelHtml()
              // }, 3000)
            }
            done();
          } catch (err) {
            console.log('[ERROR] ', err);
          }
        }
      }
    ]);
  }

  // REFACT
  private generatePanel(homeTeamStat: string, awayTeamStat: string): string {
    const template = fs.readFileSync(path.join(__dirname, '../template/snapshot.html'));
    let resHtml = template.toString().replace('${homeTeamTitle}', this._props.homeTeamTitleMarkup);
    resHtml = resHtml.toString().replace('${awayTeamTitle}', this._props.awayTeamTitleMarkup);
    resHtml = resHtml.toString().replace('${homeTeamName}', this._props.homeTeamNameMarkup);
    resHtml = resHtml.toString().replace('${awayTeamName}', this._props.awayTeamNameMarkup);
    resHtml = resHtml.toString().replace('${homeTeamStat}', homeTeamStat);
    resHtml = resHtml.toString().replace('${awayTeamStat}', awayTeamStat);
    return resHtml;
  }
};