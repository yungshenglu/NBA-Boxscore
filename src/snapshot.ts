import * as vscode from 'vscode';
import axios from 'axios';
import { Markup } from './markup';
import { Match } from './match';
import { API_URL } from './utils/hardcode';

const fs = require('fs');
const path = require('path');

const templatePath = '../template/snapshot.html';
const template = fs.readFileSync(path.join(__dirname, templatePath));

interface ISnapshotProps {
  /**
   * match                : 該場賽事資訊
   * matchDate            : 該場賽事日期
   * matchScore           : 該場賽事當下比分
   * gameId               : 該場賽事 ID
   * snapshotHtml         : 該場賽事的 HTML
   * panel                : 該場賽事的分頁
   * timer                : 時間 (NOT SUPPORT)
   * isDisposed           : 分頁是否被開啟
   */
  match: Match;
  matchDate: string;
  matchScore: string;
  gameId: string;
  snapshotHtml: string;
  panel: any;
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
      gameId: props.match.gameProfile.gameId,
      snapshotHtml: '',
      panel: '',
      timer: '',  // NOT SUPPORT
      isDisposed: false
    };
  }

  /* Getters */
  get match(): Match {
    return this._props.match;
  }
  get matchDate(): string {
    return this._props.matchDate;
  }
  get matchScore(): string {
    return this._props.matchScore;
  }
  get gameId(): string {
    return this._props.gameId;
  }
  get snapshotHtml(): string {
    return this._props.snapshotHtml;
  }
  get panel(): any {
    return this._props.panel;
  }
  // NOT SUPPORT
  get timer(): any {
    return this._props.timer;
  }
  get isDisposed(): Boolean {
    return this._props.isDisposed;
  }

  /* Methods */
  private mapSnapshotUrl(gameId: string): string {
    let apiUrl = API_URL.find(item => item.name === 'snapshot')?.url || '';
    let snapshotUrl = apiUrl !== ''
      ? apiUrl.replace('{gameId}', gameId)
      : apiUrl;
    return snapshotUrl;
  }

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
        this._props.gameId,
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
    let url = this.mapSnapshotUrl(this._props.gameId);
    axios.get(url).then((res) => {
      console.log('res: ', res);

      let matchSnapshot = res.data.payload;
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
        awayTeamMarkup,
        this._props.match
      );
      this._props.timer = setTimeout(() => {
        console.log(homeTeamMarkup.team.boxscore.finalScore);
        console.log(awayTeamMarkup.team.boxscore.finalScore);
        this.setMarkupData();
      }, 3000);
    }).catch((err) => {
      console.log('[ERROR] ', err);
    });
  }

  private generatePanel(homeTeam: Markup, awayTeam: Markup, match: Match): string {
    let resHtml = template;

    // Replace team name and abbr
    resHtml = this.replaceMarkup(resHtml, '${homeTeamCode}', homeTeam.team.profile.code);
    resHtml = this.replaceMarkup(resHtml, '${homeTeamName}', homeTeam.team.profile.name);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamCode}', awayTeam.team.profile.code);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamName}', awayTeam.team.profile.name);

    // Replace team conference and matchup
    resHtml = this.replaceMarkup(resHtml, '${homeTeamConf}', homeTeam.team.profile.conference);
    resHtml = this.replaceMarkup(resHtml, '${homeTeamConfRank}', homeTeam.team.matchup.confRank);
    resHtml = this.replaceMarkup(resHtml, '${homeTeamWins}', homeTeam.team.matchup.wins);
    resHtml = this.replaceMarkup(resHtml, '${homeTeamLosses}', homeTeam.team.matchup.losses);

    resHtml = this.replaceMarkup(resHtml, '${awayTeamConf}', awayTeam.team.profile.conference);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamConfRank}', awayTeam.team.matchup.confRank);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamWins}', awayTeam.team.matchup.wins);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamLosses}', awayTeam.team.matchup.losses);

    // Replace team logo
    resHtml = this.replaceMarkup(resHtml, '${homeTeamLogoUrl}', homeTeam.team.profile.logoUrl);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamLogoUrl}', awayTeam.team.profile.logoUrl);

    // Replace game period and status
    resHtml = this.replaceMarkup(resHtml, '${statusColor}', match.score.statusColor);
    resHtml = this.replaceMarkup(resHtml, '${statusDesc}', match.score.statusDesc);
    resHtml = this.replaceMarkup(resHtml, '${periodClock}', match.score.periodClock);

    // Replace team score
    resHtml = this.replaceMarkup(resHtml, '${homeTeamFinalScore}', homeTeam.team.boxscore.finalScore);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamFinalScore}', awayTeam.team.boxscore.finalScore);
    resHtml = this.replaceMarkup(resHtml, '${homeTeamQScores}', homeTeam.teamQScoresMarkup);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamQScores}', awayTeam.teamQScoresMarkup);

    // Replace team abbr-name
    resHtml = this.replaceMarkup(resHtml, '${homeTeamAbbrName}', homeTeam.team.profile.abbr);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamAbbrName}', awayTeam.team.profile.abbr);

    // Replace team profile
    resHtml = this.replaceMarkup(resHtml, '${arenaName}', this._props.match.gameProfile.arenaName);
    resHtml = this.replaceMarkup(resHtml, '${arenaLocation}', this._props.match.gameProfile.arenaLocation);

    // Replace game players statistics
    resHtml = this.replaceMarkup(resHtml, '${statTableHeader}', homeTeam.teamStatTableHeader);
    resHtml = this.replaceMarkup(resHtml, '${homeTeamStat}', homeTeam.teamStatMarkup);
    resHtml = this.replaceMarkup(resHtml, '${statTableHeader}', awayTeam.teamStatTableHeader);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamStat}', awayTeam.teamStatMarkup);

    return resHtml;
  }

  private replaceMarkup(result: any, markup: string, target: string | number) {
    return result.toString().replace(markup, target);
  }
};