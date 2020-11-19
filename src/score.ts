interface IScoreProps {
  /**
   * qScores      : 每節比分
   * score        : 總比分
   */
  qScores: number[];
  finalScore: number;
}

export class Score implements IScoreProps {
  /* Props & Constructor */
  private _props: IScoreProps;

  constructor(props: any) {
    this._props = {
      qScores: [
        props.q1Score,
        props.q2Score,
        props.q3Score,
        props.q4Score
      ],
      finalScore: props.score
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

  /* Setters */
  set qScores(qScores: number[]) {
    this._props.qScores = qScores;
  }
  set finalScore(finalScore: number) {
    this._props.finalScore = finalScore;
  }

  /* Methods */
}