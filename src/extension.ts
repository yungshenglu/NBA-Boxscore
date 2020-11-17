import * as vscode from 'vscode';
// import localize from './localize';
import { DailyMatches } from './dailyMatches';
import { Match } from './match';
import { Snapshot } from './snapshot';

const crawler = require('crawler');

// TEST
let today: string = '2020-08-07';// new Date().toISOString().substring(0, 10);
const matchesUrl = `https://tw.global.nba.com/stats2/scores/daily.json?countryCode=TW&gameDate=${today}&locale=zh_TW`;

// Commands
const dailyMatches = new DailyMatches({
	matchesUrl: matchesUrl,
	matchesDate: today,
	matchesCrawler: new crawler
});
let snapshots: any = {};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "nba-boxscore" is now active!');

	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBarItem.command = 'nba-boxscore.showMenu';
	statusBarItem.tooltip = 'Click';

	/**
	 * Get NBA real-time score (nba-boxscore.showMatches)
	 */
	context.subscriptions.push(vscode.commands.registerCommand('nba-boxscore.showMatches', () => {
		// Display a message box to the user
		vscode.window.showInformationMessage('Welcome NBA-BoxScore!');
		// vscode.window.showInformationMessage(localize("extension.Welcome"));

		statusBarItem.show();
		dailyMatches.crawlMatches((text: string) => {
			statusBarItem.text = text;
		});
	}));

	/**
	 * Get a live text list (nba-boxscore.showMenu)
	 */
	context.subscriptions.push(vscode.commands.registerCommand('nba-boxscore.showMenu', () => {
		let matchesList = dailyMatches.matchesList;
		if (matchesList.length > 0 && Object.keys(snapshots).length === 0) {
			matchesList.map((match: Match, id: number) => {
				snapshots[match.label] = new Snapshot(
					{
						match: match,
						matchDate: dailyMatches.matchesDate,
						matchScore: dailyMatches.matchesScoreList[id]
					});
			});
		}

		vscode.window.showQuickPick([...matchesList, { label: 'Exit extension', code: 'exit' }]).then((pickedMatch: any) => {
			// Without picking any match
			if (!pickedMatch) { return; }

			if (pickedMatch && pickedMatch.code === 'exit') {
				vscode.commands.executeCommand('nba-boxscore.exit');
				return;
			}

			snapshots[pickedMatch.label].getSnapshot();
		});
	}));

	/**
	 * Exit NBA real-time score (nba-boxscore.exit)
	 */
	context.subscriptions.push(vscode.commands.registerCommand('nba-boxscore.exit', () => {
		// Display a message box to the user
		vscode.window.showInformationMessage('Exit NBA-BoxScore.');

		// TEST
		// clearInterval(getTimer());
		// this.getLivePage = {};
		statusBarItem.text = '';
	}));
}

// this method is called when your extension is deactivated
export function deactivate() { }
