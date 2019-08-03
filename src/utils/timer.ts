import * as convertHrtime from 'convert-hrtime';

type HrtimeResponse = [number, number];

export default class Timer {
  private startTime: HrtimeResponse | undefined;

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
