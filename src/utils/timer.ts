type HrtimeResponse = [number, number];
import * as convertHrtime from 'convert-hrtime';

export default class Timer {
  private readonly precision: number;
  private startTime: HrtimeResponse | undefined;

  constructor(precision: number = 0) {
    this.precision = precision;
  }

  public start(): HrtimeResponse {
    this.startTime = process.hrtime() as HrtimeResponse;
    return this.startTime;
  }

  public end(): convertHrtime.HRTime {
    const elapsed = convertHrtime(process.hrtime(this.startTime));
    this.startTime = undefined;
    return elapsed;
  }
}
