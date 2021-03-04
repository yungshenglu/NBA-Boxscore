interface IMatchupProps {
  /**
   * confRank     : 聯盟排名
   * divRank      : 分區排名
   * losses       : 敗場數
   * seriesText   : (NOT SUPPORT)
   * wins         : 勝場數
   */
  confRank: number;
  divRank: number;
  losses: number;
  wins: number;
}

export class Matchup implements IMatchupProps {
  /* Props & Constructor */
  private _props: IMatchupProps;

  constructor(props: IMatchupProps) {
    this._props = {
      confRank: props.confRank,
      divRank: props.divRank,
      losses: props.losses,
      wins: props.wins
    };
  }

  /* Getters */
  get confRank(): number {
    return this._props.confRank;
  }
  get divRank(): number {
    return this._props.divRank;
  }
  get losses(): number {
    return this._props.losses;
  }
  get wins(): number {
    return this._props.wins;
  }
}