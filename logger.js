const fs = require('fs');
const path = require('path');

const colors = {
  error: '\x1b[31m',    // Red
  warn: '\x1b[33m',     // Yellow
  info: '\x1b[36m',     // Cyan
  debug: '\x1b[35m',    // Magenta
  reset: '\x1b[0m'      // Reset
};

const icons = {
  error: '❌',
  warn: '⚠️',
  info: 'ℹ️',
  debug: '🔍'
};

const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

const getTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
};

const writeToFile = (level, message, meta = {}) => {
  const timestamp = getTimestamp();
  const date = getCurrentDate();
  
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...meta
  };

  const mainLogFile = path.join(logsDir, `app-${date}.log`);
  const mainLogLine = JSON.stringify(logEntry) + '\n';
  
  try {
    fs.appendFileSync(mainLogFile, mainLogLine);
  } catch (error) {
    console.error('Error writing to log file:', error);
  }

  if (level === 'error') {
    const errorLogFile = path.join(logsDir, `error-${date}.log`);
    try {
      fs.appendFileSync(errorLogFile, mainLogLine);
    } catch (error) {
      console.error('Error writing to error log file:', error);
    }
  }
};

const cleanOldLogs = () => {
  try {
    const files = fs.readdirSync(logsDir);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 14);

    files.forEach(file => {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtime < cutoffDate) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old log file: ${file}`);
      }
    });
  } catch (error) {
    console.error('Error cleaning old logs:', error);
  }
};

const log = (level, message, meta = {}) => {
  const color = colors[level] || colors.info;
  const icon = icons[level] || icons.info;
  const reset = colors.reset;
  const timestamp = getTimestamp();
  
  let consoleMessage = `${color}${timestamp} ${icon} [${level.toUpperCase()}]${reset}: ${message}`;
  
  if (Object.keys(meta).length > 0) {
    consoleMessage += ` ${color}${JSON.stringify(meta, null, 2)}${reset}`;
  }
  
  console.log(consoleMessage);
  
  writeToFile(level, message, meta);
};

const logger = {
  error: (message, meta = {}) => log('error', message, meta),
  warn: (message, meta = {}) => log('warn', message, meta),
  info: (message, meta = {}) => log('info', message, meta),
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      log('debug', message, meta);
    }
  },

  startup: (message, meta = {}) => log('info', `🚀 ${message}`, meta),
  database: (message, meta = {}) => log('info', `🗄️ ${message}`, meta),
  api: (message, meta = {}) => log('info', `🌐 ${message}`, meta),
  auth: (message, meta = {}) => log('info', `🔐 ${message}`, meta),
  payment: (message, meta = {}) => log('info', `💳 ${message}`, meta),
  notification: (message, meta = {}) => log('info', `📱 ${message}`, meta),
  security: (message, meta = {}) => log('warn', `🛡️ ${message}`, meta),
  performance: (message, meta = {}) => log('info', `⚡ ${message}`, meta),

  cleanOldLogs
};

logger.cleanOldLogs();

module.exports = logger;
