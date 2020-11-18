import * as vscode from 'vscode';
import { Markup } from './markup';
import { Match } from './match';

const fs = require('fs');
const path = require('path');
const crawler = require('crawler');

const templatePath = '../template/snapshot.html';
const template = fs.readFileSync(path.join(__dirname, templatePath));

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
      isDisposed: false
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

              const homeTeamMarkup = new Markup({
                gamePlayers: matchSnapshot.homeTeam.gamePlayers,
                team: this._props.match.homeTeam
              });
              const awayTeamMarkup = new Markup({
                gamePlayers: matchSnapshot.awayTeam.gamePlayers,
                team: this._props.match.awayTeam
              });

              // Render panel
              this._props.panel.webview.html = this.generatePanel(
                homeTeamMarkup,
                awayTeamMarkup
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
  private generatePanel(homeTeam: Markup, awayTeam: Markup): string {
    let resHtml = template;

    // Replace team full-name
    resHtml = this.replaceMarkup(resHtml, '${homeTeamCityName}', homeTeam.team.profile.city.zh);
    resHtml = this.replaceMarkup(resHtml, '${homeTeamName}', homeTeam.team.profile.name.zh);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamCityName}', awayTeam.team.profile.city.zh);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamName}', awayTeam.team.profile.name.zh);

    // Replace team conference and matchup
    resHtml = this.replaceMarkup(resHtml, '${homeTeamConf}', homeTeam.team.profile.conference.zh);
    resHtml = this.replaceMarkup(resHtml, '${homeTeamConfRank}', homeTeam.team.matchup.confRank);
    resHtml = this.replaceMarkup(resHtml, '${homeTeamWins}', homeTeam.team.matchup.wins);
    resHtml = this.replaceMarkup(resHtml, '${homeTeamLosses}', homeTeam.team.matchup.losses);

    resHtml = this.replaceMarkup(resHtml, '${awayTeamConf}', awayTeam.team.profile.conference.zh);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamConfRank}', awayTeam.team.matchup.confRank);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamWins}', awayTeam.team.matchup.wins);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamLosses}', awayTeam.team.matchup.losses);

    // Replace team logo
    resHtml = this.replaceMarkup(resHtml, '${homeTeamLogoUrl}', homeTeam.team.profile.logoUrl);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamLogoUrl}', awayTeam.team.profile.logoUrl);

    // Replace team score
    resHtml = this.replaceMarkup(resHtml, '${homeTeamFinalScore}', homeTeam.team.score.finalScore);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamFinalScore}', awayTeam.team.score.finalScore);
    resHtml = this.replaceMarkup(resHtml, '${homeTeamQScores}', homeTeam.teamQScoresMarkup);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamQScores}', awayTeam.teamQScoresMarkup);

    // Replace team abbr-name
    resHtml = this.replaceMarkup(resHtml, '${homeTeamAbbrName}', homeTeam.team.profile.abbr.zh);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamAbbrName}', awayTeam.team.profile.abbr.zh);

    // Replace team profile
    resHtml = this.replaceMarkup(resHtml, '${arenaName}', this._props.match.gameProfile.arenaName);
    resHtml = this.replaceMarkup(resHtml, '${arenaLocation}', this._props.match.gameProfile.arenaLocation);

    // Replace game players statistics
    resHtml = this.replaceMarkup(resHtml, '${homeTeamStat}', homeTeam.teamStatMarkup);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamStat}', awayTeam.teamStatMarkup);

    return resHtml;
  }
  private replaceMarkup(result: any, markup: string, target: string | number) {
    return result.toString().replace(markup, target);
  }
};