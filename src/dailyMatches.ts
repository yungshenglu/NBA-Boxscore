import { Match } from './match';

interface IDailyMatchesProps {
	/**
	 * matchesUrl						: 當日所有賽事的 API 連結
	 * matchesDate					: 當日賽事日期
	 * matchesCrawler				: 賽事資訊爬蟲 
	 * matchesList 					: 當日所有賽事
	 * matchesScoreList			: 當日所有賽事的比分
	 * isAllMatchesFinish		: 是否當日所有賽事已結束
	 * timer								: 時間 (NOT SUPPORT)
	 */
	matchesUrl: string;
	matchesDate: string;
	matchesCrawler: any;
	matchesList: [];
	matchesScoreList: [];
	isAllMatchesFinish: Boolean;
	timer: any;
}

export class DailyMatches implements IDailyMatchesProps {
	/* Props & Constructor */
	private _props: IDailyMatchesProps;

	constructor(props: any) {
		this._props = {
			matchesUrl: props.matchesUrl,
			matchesDate: props.matchesDate,
			matchesCrawler: props.matchesCrawler,
			matchesList: [],
			matchesScoreList: [],
			isAllMatchesFinish: false,
			timer: ''	// NOT SUPPORT
		};
	}

	/* Getters */
	get matchesDate(): string {
		return this._props.matchesDate;
	}
	get matchesList(): [] {
		return this._props.matchesList;
	}
	get matchesScoreList(): [] {
		return this._props.matchesScoreList;
	}
	get isAllMatchesFinish(): Boolean {
		return this._props.isAllMatchesFinish;
	}

	/* Setters */
	set matchesUrl(matchesUrl: string) {
		this._props.matchesUrl = matchesUrl;
	}
	set matchesCrawler(matchesCrawler: any) {
		this._props.matchesCrawler = matchesCrawler;
	}
	set timer(timer: any) {
		this._props.timer = timer;
	}

	/* Methods */
	public crawlMatches(callback: Function) {
		this._props.matchesCrawler.queue([
			{
				url: this._props.matchesUrl,
				callback: (err: Error, res: any, done: Function) => {
					try {
						if (!err) {
							let dailyMatches = JSON.parse(res.body).payload.date;
							let dailyMatchesCount = dailyMatches ? dailyMatches.games.length : 0;
							this._props.matchesScoreList = [];
							this._props.matchesList = [];

							if (dailyMatchesCount === 0) {
								callback('No Matches');
								done();
								return;
							} else {
								for (let i = 0; i < dailyMatchesCount; ++i) {
									let match = new Match(dailyMatches.games[i]);
									this._props.matchesList.push(match);
									this._props.matchesScoreList.push(match.matchStatusText);
								}
								callback(this._props.matchesScoreList[0] + (this._props.matchesScoreList.length > 1 ? ' ...' : ''));
							}
						}
						done();
					} catch (err) {
						console.log('[ERROR] ', err);
					}

					// Stop crawling when all matches finished
					if (!this._props.isAllMatchesFinish) {
						this._props.timer = setTimeout(() => {
							this.crawlMatches(callback);
						}, 3000);
					}
				}
			}
		]);
	}
}
