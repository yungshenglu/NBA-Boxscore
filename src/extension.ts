// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// import localize from './localize';
import { DailyMatches } from './dailyMatches';
import { Match } from './match';
import { Snapshot } from './snapshot';

// TEST
const dailyMatches = new DailyMatches();
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
		dailyMatches.getDailyMatches((text: string) => {
			statusBarItem.text = text;
		});
	}));

	/**
	 * Get a live text list (nba-boxscore.showMenu)
	 */
	context.subscriptions.push(vscode.commands.registerCommand('nba-boxscore.showMenu', () => {
		let matchesList = dailyMatches.matchesList;
		if (matchesList.length > 0 && Object.keys(snapshots).length === 0) {
			matchesList.map((match: Match) => {
				snapshots[match.matchLabel] = new Snapshot(match);
			});
		}
		console.log(snapshots);

		vscode.window.showQuickPick([...matchesList, { label: 'Exit extension', code: 'exit' }]).then((pickedMatch: any) => {
			// Without picking any match
			if (!pickedMatch) { return; };

			if (pickedMatch && pickedMatch.code === 'exit') {
				vscode.commands.executeCommand('nba-boxscore.exit');
				return;
			}

			snapshots[pickedMatch.matchLabel].getSnapshot();
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
