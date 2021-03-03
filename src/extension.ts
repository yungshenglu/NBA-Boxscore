import * as vscode from 'vscode';
import localize from './localize';
import { DailyMatches } from './dailyMatches';
import { Match } from './match';
import { Snapshot } from './snapshot';

const crawler = require('crawler');
const today: string = new Date().toISOString().substring(0, 10);
const matchesUrl = `https://tw.global.nba.com/stats2/scores/daily.json?countryCode=TW&gameDate=${today}&locale=zh_TW`;

console.log('matchesUrl: ', matchesUrl);
console.log('lang: ', vscode.env.language);

// Commands
let currMatchIndex = 0;
const dailyMatches = new DailyMatches({
	matchesUrl: matchesUrl,
	matchesDate: today,
	matchesCrawler: new crawler,
	currMatchIndex: currMatchIndex
});
let snapshots: any = {};

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBarItem.command = 'nba-boxscore.showMenu';
	statusBarItem.tooltip = localize('extension.ClickShowMatches');

	/**
	 * Get NBA real-time score (nba-boxscore.showMatches)
	 */
	context.subscriptions.push(vscode.commands.registerCommand('nba-boxscore.showMatches', () => {
		// Display a message box to the user
		vscode.window.showInformationMessage(localize('extension.Welcome'));

		statusBarItem.show();
		dailyMatches.crawlMatches((text: string) => {
			statusBarItem.text = `${'$(hubot)'} ${text}`;
		});
	}));

	/**
	 * Get a live text list (nba-boxscore.showMenu)
	 */
	context.subscriptions.push(vscode.commands.registerCommand('nba-boxscore.showMenu', () => {
		let matchesList = dailyMatches.matchesList;
		if (matchesList.length > 0 && Object.keys(snapshots).length === 0) {
			matchesList.map((match: Match, id: number) => {
				snapshots[match.gameId] = new Snapshot(
					{
						match: match,
						matchDate: dailyMatches.matchesDate,
						matchScore: dailyMatches.matchesScoreList[id]
					});
			});
		}

		vscode.window.showQuickPick([...matchesList, { label: localize('extension.Exit'), code: 'exit' }]).then((pickedMatch: any) => {
			// Without picking any match
			if (!pickedMatch) { return; }

			if (pickedMatch && pickedMatch.code === 'exit') {
				vscode.commands.executeCommand('nba-boxscore.exit');
				return;
			}
			snapshots[pickedMatch.gameId].getSnapshot();
		});
	}));

	/**
	 * Exit NBA real-time score (nba-boxscore.exit)
	 */
	context.subscriptions.push(vscode.commands.registerCommand('nba-boxscore.exit', () => {
		// Display a message box to the user
		vscode.window.showInformationMessage(localize('extension.Exit'));

		// TEST
		// clearInterval(getTimer());
		// this.getLivePage = {};
		statusBarItem.text = '';
	}));
}

// This method is called when your extension is deactivated
export function deactivate() { }
