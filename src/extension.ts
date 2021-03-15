import * as vscode from 'vscode';
import localize from './localize';
import { DailyMatches } from './dailyMatches';
import { Match } from './match';
import { Snapshot } from './snapshot';
import { validateDateFormat } from './utils';

export function activate({ subscriptions }: vscode.ExtensionContext) {
	const today = new Date().toISOString().substring(0, 10);
	let snapshots: any = {};
	let dailyMatches: any = {};
	let historyMatches: any = {};
	let currMatchIndex = 0; // NOT SUPPORT
	let isSearchHistory = false;

	const defaultMenu = [{
		label: localize('extension.SearchHistory'),
		code: 'history'
	}, {
		label: localize('extension.Exit'),
		code: 'exit'
	}];

	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBarItem.command = 'nba-boxscore.showMenu';
	statusBarItem.tooltip = localize('extension.ClickShowMatches');

	// Generate snapshots for all matches
	function generateSnapshots(matchesList: []) {
		snapshots = {};
		if (matchesList.length > 0 && Object.keys(snapshots).length === 0) {
			matchesList.map((match: Match) => {
				snapshots[match.code] = new Snapshot(match);
			});
		}
	}

	/**
	 * Activate extension
	 * Commnd: nba-boxscore.activate
	 */
	const activate = vscode.commands.registerCommand('nba-boxscore.activate', () => {
		vscode.window.showInformationMessage(localize('extension.Welcome'));
		statusBarItem.show();

		dailyMatches = new DailyMatches({
			matchesDate: today,
			currMatchIndex: currMatchIndex
		});
		dailyMatches.parseMatches((text: string) => {
			statusBarItem.text = `${'$(hubot)'} ${text}`;
		});

		isSearchHistory = false;
	});

	/**
	 * Get daily menu with all matches
	 * Command: nba-boxscore.showMenu
	 */
	const showMenu = vscode.commands.registerCommand('nba-boxscore.showMenu', () => {
		const matchesList = isSearchHistory
			? historyMatches.matchesList
			: dailyMatches.matchesList;


		vscode.window.showQuickPick([...matchesList, ...defaultMenu]).then((pickedMatch) => {
			generateSnapshots(matchesList);

			// Without picking any match
			if (!pickedMatch) {
				return;
			} else {
				switch (pickedMatch.code) {
					case 'history':
						vscode.commands.executeCommand('nba-boxscore.searchHistory');
						break;
					case 'exit':
						vscode.commands.executeCommand('nba-boxscore.exit');
						return;
					default:
						snapshots[pickedMatch.code].getSnapshot();
						return;
				}
			}
		});
	});

	/**
	 * Show the date input for the detail of matches in the past
	 * Command: nba-boxscore.searchHistory
	 */
	const searchHistory = vscode.commands.registerCommand('nba-boxscore.searchHistory', () => {
		const yesterday = new Date(new Date()
			.setDate(new Date().getDate() - 1))
			.toISOString()
			.substring(0, 10);

		vscode.window.showInputBox({
			value: yesterday,
			prompt: localize('extension.DatePrompt'),
			placeHolder: localize('extension.DatePrompt'),
			validateInput: (value: string) => {
				const isValid = validateDateFormat(value);
				return isValid
					? undefined
					: localize('extension.IncorrectDateFormat');
			},
			password: false
		}).then(async (value) => {
			// FIXME: 無法即時同步到選單
			historyMatches = new DailyMatches({
				matchesDate: value,
				currMatchIndex: currMatchIndex
			});
			historyMatches.parseMatches((text: string) => {
				statusBarItem.text = `${'$(hubot)'} ${text}`;
			});

			isSearchHistory = true;
		});
	});

	/**
	 * Exit extension 
	 * Command: nba-boxscore.exit
	 */
	const exit = vscode.commands.registerCommand('nba-boxscore.exit', () => {
		// Display a message box to the user
		vscode.window.showInformationMessage(localize('extension.Exit'));

		// TEST
		// clearInterval(getTimer());
		// this.getLivePage = {};
		statusBarItem.text = '';
	});

	// Subscribe commands
	subscriptions.push(activate);
	subscriptions.push(showMenu);
	subscriptions.push(searchHistory);
	subscriptions.push(exit);
}

// This method is called when your extension is deactivated
export function deactivate() { }
