import axios from 'axios';
import localize from './localize';
import { Match } from './match';
import { API_URL, MATCH_STATUS } from './utils/hardcode';

interface IDailyMatchesProps {
	/**
	 * matchesDate					: 當日賽事日期
	 * matchesList 					: 當日所有賽事
	 * matchesScoreList			: 當日所有賽事的比分
	 * isAllMatchesFinish		: 是否當日所有賽事已結束
	 * timer								: 時間 (NOT SUPPORT)
	 * currMatchIndex				:
	 */
	matchesDate: string;
	matchesList: Match[];
	matchesScoreList: string[];
	isAllMatchesFinish: Boolean;
	timer: any;
	currMatchIndex: number
}

export class DailyMatches implements IDailyMatchesProps {
	/* Props & Constructor */
	private _props: IDailyMatchesProps;

	constructor(props: any) {
		this._props = {
			matchesDate: props.matchesDate,
			matchesList: [],
			matchesScoreList: [],
			isAllMatchesFinish: true,
			timer: '',	// NOT SUPPORT
			currMatchIndex: props.currMatchIndex
		};
	}

	/* Getters */
	get matchesDate(): string {
		return this._props.matchesDate;
	}
	get matchesList(): Match[] {
		return this._props.matchesList;
	}
	get matchesScoreList(): string[] {
		return this._props.matchesScoreList;
	}
	get isAllMatchesFinish(): Boolean {
		return this._props.isAllMatchesFinish;
	}
	get currMatchIndex(): number {
		return this._props.currMatchIndex;
	}
	// NOT SUPPORT
	get timer(): any {
		return this._props.timer;
	}

	/* Methods */
	private mapMatchesurl(gameDate: string): string {
		let apiUrl = API_URL.find(item => item.name === 'matches')?.url || '';
		let matchesUrl = apiUrl !== ''
			? apiUrl.replace('{gameDate}', gameDate)
			: apiUrl;
		return matchesUrl;
	}

	public parseMatches(cb: Function) {
		let url = this.mapMatchesurl(this._props.matchesDate);
		axios.get(url).then((res) => {
			let dailyMatches = res.data.payload.date;
			let dailyMatchesCount = dailyMatches ? dailyMatches.games.length : 0;
			this._props.matchesScoreList = [];
			this._props.matchesList = [];

			if (dailyMatchesCount === 0) {
				cb(localize('extension.NoGameToday'));
				return;
			} else {
				for (let i = 0; i < dailyMatchesCount; ++i) {
					let match = new Match(dailyMatches.games[i]);
					this._props.matchesList.push(match);
					this._props.matchesScoreList.push(match.matchStatusText);
					// TODO: need to check the status code
					if (match.score.status === MATCH_STATUS[2].key) {
						this._props.isAllMatchesFinish = false;
					};
				}
				cb(this._props.matchesScoreList[this.currMatchIndex] + (this._props.matchesScoreList.length > 1 ? ' ...' : ''));
			}

			// Stop crawling when all matches finished
			if (!this._props.isAllMatchesFinish) {
				this._props.timer = setTimeout(() => {
					this.parseMatches(cb);
				}, 3000);
			}
		}).catch((err) => {
			console.log('[ERROR] ', err);
		});
	}
}
