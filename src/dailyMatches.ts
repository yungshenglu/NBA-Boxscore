const crawler = require('crawler');

import { Match } from './match';

let matchesList: any = [];
let timer: any = null;

interface IDailyMatchesProps {
	/**
	 * dailyMatchesUrl			: 當日所有賽事的 API 連結
	 * matchesCrawler				: 賽事資訊爬蟲 
	 * matchesList 					: 當日所有賽事
	 * isAllMatchesFinish		: 是否當日所有賽事已結束
	 * timer								: 時間 (NOT SUPPORT)
	 */
	dailyMatchesUrl: string
	matchesCrawler: typeof crawler,
	matchesList: [],
	isAllMatchesFinish: Boolean
	timer: any
}


export class DailyMatches {
	/* Props & Constructor */
	private _props: IDailyMatchesProps;

	constructor() {
		this._props = {
			dailyMatchesUrl: 'https://tw.global.nba.com/stats2/scores/daily.json?countryCode=TW&gameDate=2020-08-07&locale=zh_TW',
			matchesCrawler: new crawler(),
			matchesList: [],
			isAllMatchesFinish: false,
			timer: null	// NOT SUPPORT
		};
	}

	/* Getters */
	get matchesList(): [] {
		return this._props.matchesList;
	}

	get isAllMatchesFinish(): Boolean {
		return this._props.isAllMatchesFinish;
	}

	/* Setters */

	/* Methods */
	public getDailyMatches(callback: Function) {
		// Crawling
		this.crawling(callback);
	}

	private crawling(callback: Function) {
		this._props.matchesCrawler.queue([
			{
				url: this._props.dailyMatchesUrl,
				callback: (err: Error, res: any, done: Function) => {
					try {
						if (!err) {
							let dailyMatches = JSON.parse(res.body).payload.date.games;
							let dailyMatchesCount = dailyMatches.length;
							let matchesScoreList = [];

							if (dailyMatchesCount === 0) {
								callback('No Matches');
								done();
								return;
							} else {
								for (let i = 0; i < dailyMatchesCount; ++i) {
									let match = new Match(dailyMatches[i]);
									this._props.matchesList.push(match);
									matchesScoreList.push(match.getMatchStatusText());
								}
								callback(matchesScoreList[0] + (matchesScoreList.length > 1 ? ' ...' : ''));
							}
						}
						done();
					} catch (err) {
						console.log('[ERROR] ', err);
					}

					// Stop query when all matches finished
					if (!this._props.isAllMatchesFinish) {
						timer = setTimeout(() => {
							this.crawling(callback);
						}, 3000);
					}
				}
			}
		]);
	}
}
