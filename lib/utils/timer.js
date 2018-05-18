module.exports = class Timer {
  constructor(precision = 0) {
    this.precision = precision;
  }

  start() {
    this.startTime = process.hrtime();
    return this.startTime;
  }

  end() {
    const convertHrtime = require('convert-hrtime');
    const elapsed = convertHrtime(process.hrtime(this.startTime));
    this.startTime = undefined;
    return elapsed;
  }
};
