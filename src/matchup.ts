interface IMatchupProps {
  /**
   * confRank     : 聯盟排名
   * divRank      : 分區排名
   * losses       : 敗場數
   * seriesText   : (NOT SUPPORT)
   * wins         : 勝場數
   */
  confRank: number | string;
  divRank: number | string;
  losses: number | string;
  wins: number | string;
}

export class Matchup implements IMatchupProps {
  /* Props & Constructor */
  private _props: IMatchupProps;

  constructor(props: IMatchupProps, isAllStarGame: boolean) {
    this._props = {
      confRank: isAllStarGame ? '' : props.confRank,
      divRank: isAllStarGame ? '' : props.divRank,
      losses: isAllStarGame ? 0 : props.losses,
      wins: isAllStarGame ? 0 : props.wins
    };
  }

  /* Getters */
  get confRank(): number | string {
    return this._props.confRank;
  }
  get divRank(): number | string {
    return this._props.divRank;
  }
  get losses(): number | string {
    return this._props.losses;
  }
  get wins(): number | string {
    return this._props.wins;
  }
}