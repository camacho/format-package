function formatError(message) {
  const chalk = require('chalk');
  return [chalk.bgRed.white(' ERROR '), message].join(' ');
}

function logErrorAndExit(err) {
  if (!err) {
    console.error(formatError('Something went wrong!'));
    process.exit(1);
  } else {
    console.error(formatError(err.stderr || err.stdout || err));
    process.exit(err.code || 1);
  }
}

module.exports = logErrorAndExit;
