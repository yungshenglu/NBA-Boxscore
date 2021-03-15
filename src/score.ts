interface IScoreProps {
  /**
   * qScores      : 每節比分
   * score        : 總比分
   * fg           : 投籃 [fgm-fga-fgp]
   * tp           : 三分 [tpm-tpa-tpp]
   * ft           : 罰球 [ftm-fta-ftp]
   */
  qScores: number[];
  finalScore: number;
  fg: string;
  tp: string;
  ft: string;
}

export class Score implements IScoreProps {
  /* Props & Constructor */
  private _props: IScoreProps;

  constructor(data: any) {
    this._props = {
      qScores: [
        data.q1Score,
        data.q2Score,
        data.q3Score,
        data.q4Score
      ],
      finalScore: data.score,
      fg: this.makeStatText(data.fgm, data.fga, data.fgpct),
      tp: this.makeStatText(data.tpm, data.tpa, data.tppct),
      ft: this.makeStatText(data.ftm, data.fta, data.ftpct),
    };
  }

  /* Getters */
  get qScores(): number[] {
    return this._props.qScores;
  }
  get finalScore(): number {
    return this._props.finalScore;
  }
  get qScoresMarkup(): string {
    let qScores = '';
    this._props.qScores.forEach(value => {
      qScores += `
        <td>
          ${value}
        </td>
      `;
    });
    return qScores;
  }
  get fg(): string {
    return this._props.fg;
  }
  get tp(): string {
    return this._props.tp;
  }
  get ft(): string {
    return this._props.ft;
  }

  /* Methods */
  private makeStatText(made: number, attemped: number, pct: number): string {
    return `${made || 0}-${attemped || 0} (${pct || 0}%)`;
  }
}
