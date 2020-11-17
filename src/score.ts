interface IScoreProps {
  /**
   * q1Score      : 第一節比分
   * q2Score      : 第二節比分
   * q3Score      : 第三節比分
   * q4Score      : 第四節比分
   * score        : 總比分
   */
  q1Score: number;
  q2Score: number;
  q3Score: number;
  q4Score: number;
  finalScore: number;
}

export class Score implements IScoreProps {
  /* Props & Constructor */
  private _props: IScoreProps;

  constructor(props: any) {
    this._props = {
      q1Score: props.q1Score,
      q2Score: props.q2Score,
      q3Score: props.q3Score,
      q4Score: props.q4Score,
      finalScore: props.score
    };
  }

  /* Getters */
  get q1Score(): number {
    return this._props.q1Score;
  }
  get q2Score(): number {
    return this._props.q2Score;
  }
  get q3Score(): number {
    return this._props.q3Score;
  }
  get q4Score(): number {
    return this._props.q4Score;
  }
  get finalScore(): number {
    return this._props.finalScore;
  }

  /* Setters */
  set q1Score(q1Score: number) {
    this._props.q1Score = q1Score;
  }
  set q2Score(q2Score: number) {
    this._props.q2Score = q2Score;
  }
  set q3Score(q3Score: number) {
    this._props.q3Score = q3Score;
  }
  set q4Score(q4Score: number) {
    this._props.q4Score = q4Score;
  }
  set finalScore(finalScore: number) {
    this._props.finalScore = finalScore;
  }
}