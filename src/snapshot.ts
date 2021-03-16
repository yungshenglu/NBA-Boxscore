import * as vscode from 'vscode';
import axios from 'axios';
import { Match } from './match';
import { Player } from './player';
import { Markup } from './markup';
import { API_URL } from './utils/hardcode';

const fs = require('fs');
const path = require('path');

const templatePath = '../template/snapshot.html';
const template = fs.readFileSync(path.join(__dirname, templatePath));

interface ISnapshotProps {
  /**
   * match                : 該場賽事
   * gameId               : 該場賽事 ID (DEPRECATED)
   * snapshotHtml         : 該場賽事的 HTML
   * panel                : 該場賽事的分頁
   * timer                : 更新時間
   * isDisposed           : 分頁是否被開啟
   */
  match: Match;
  gameId: string; // DEPRECATED
  snapshotHtml: string;
  panel: any;
  timer: any;
  isDisposed: Boolean;
}

export class Snapshot implements ISnapshotProps {
  /* Props & Constructor */
  private _props: ISnapshotProps;

  constructor(match: Match) {
    this._props = {
      match: match,
      gameId: match.gameProfile.gameId,
      snapshotHtml: '',
      panel: '',
      timer: null,
      isDisposed: false
    };
  }

  /* Getters */
  get match(): Match {
    return this._props.match;
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
  get timer(): any {
    return this._props.timer;
  }
  get isDisposed(): Boolean {
    return this._props.isDisposed;
  }

  /* Methods */
  private mapSnapshotUrl(gameId: string): string {
    let apiUrl = API_URL.find(item => item.name === 'snapshot')?.url || '';
    const snapshotUrl = apiUrl !== ''
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
      return;
    } else {
      this._props.isDisposed = false;
      this._props.panel = vscode.window.createWebviewPanel(
        this._props.gameId,
        '',
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
        const matchDate = this._props.match.gameProfile.gameDateTime.split(' ')[0];
        const matchScore = this._props.match.label;
        panel.title = `${matchDate} ET | ${matchScore}`;
      });
    }
    this.setMarkupData();
  }

  public setMarkupData() {
    const url = this.mapSnapshotUrl(this._props.gameId);
    axios.get(url).then((res) => {
      const dataPayload = res.data.payload;
      const homePlayers = dataPayload.homeTeam.gamePlayers;
      const awayPlayers = dataPayload.awayTeam.gamePlayers;

      let homeTeam = this._props.match.homeTeam;
      let awayTeam = this._props.match.awayTeam;

      homeTeam.gamePlayers = [];
      for (let i = 0; i < homePlayers.length; ++i) {
        homeTeam.gamePlayers.push(new Player(homePlayers[i]));
      }
      awayTeam.gamePlayers = [];
      for (let i = 0; i < awayPlayers.length; ++i) {
        awayTeam.gamePlayers.push(new Player(awayPlayers[i]));
      }

      this.updateTeamScore(dataPayload.homeTeam.score, dataPayload.awayTeam.score);

      const homeTeamMarkup = new Markup({
        score: this._props.match.boxscore.homeScore,
        team: homeTeam
      });
      const awayTeamMarkup = new Markup({
        score: this._props.match.boxscore.awayScore,
        team: awayTeam
      });

      // Render panel
      this._props.panel.webview.html = this.generatePanel(
        homeTeamMarkup,
        awayTeamMarkup
      );

      this._props.timer = setTimeout(() => {
        this.setMarkupData();
      }, 3000);
    }).catch((err) => {
      console.log('[ERROR] ', err);
    });
  }

  private updateTeamScore(homeScore: any, awayScore: any) {
    console.log('homeScore: ', homeScore);
    // Update final score
    this._props.match.boxscore.homeScore.finalScore = homeScore.score;
    this._props.match.boxscore.awayScore.finalScore = awayScore.score;

    // Update team score for each quarter
    this._props.match.boxscore.homeScore.qScores = [
      homeScore.q1Score,
      homeScore.q2Score,
      homeScore.q3Score,
      homeScore.q4Score
    ];
    this._props.match.boxscore.awayScore.qScores = [
      awayScore.q1Score,
      awayScore.q2Score,
      awayScore.q3Score,
      awayScore.q4Score
    ];
  }

  private generatePanel(homeTeam: Markup, awayTeam: Markup): string {
    const gameProfile = this._props.match.gameProfile;
    const boxScore = this._props.match.boxscore;
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
    resHtml = this.replaceMarkup(resHtml, '${statusColor}', boxScore.statusColor);
    resHtml = this.replaceMarkup(resHtml, '${statusDesc}', boxScore.statusDesc);
    resHtml = this.replaceMarkup(resHtml, '${periodClock}', boxScore.periodClock);

    // Replace team score
    resHtml = this.replaceMarkup(resHtml, '${homeTeamFinalScore}', boxScore.homeScore.finalScore);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamFinalScore}', boxScore.awayScore.finalScore);
    resHtml = this.replaceMarkup(resHtml, '${homeTeamQScores}', homeTeam.teamQScoresMarkup);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamQScores}', awayTeam.teamQScoresMarkup);

    // Replace team abbr-name
    resHtml = this.replaceMarkup(resHtml, '${homeTeamAbbrName}', homeTeam.team.profile.abbr);
    resHtml = this.replaceMarkup(resHtml, '${awayTeamAbbrName}', awayTeam.team.profile.abbr);

    // Replace date and type of game
    resHtml = this.replaceMarkup(resHtml, '${gameDateTime}', gameProfile.gameDateTime);
    resHtml = this.replaceMarkup(resHtml, '${gameType}', gameProfile.gameType);

    // Replace team profile
    resHtml = this.replaceMarkup(resHtml, '${arenaName}', gameProfile.arenaName);
    resHtml = this.replaceMarkup(resHtml, '${arenaLocation}', gameProfile.arenaLocation);

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