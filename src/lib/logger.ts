/**
 * Custom logger configuration for development
 * Format: HH:MM:SS AM/PM | LEVEL : [Message] key:"value"
 */

const COLORS = {
  reset: '\x1b[0m',
  debug: '\x1b[94m',    // Blue
  info: '\x1b[92m',     // Green
  warn: '\x1b[93m',     // Yellow
  error: '\x1b[91m',    // Red
};

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const formatTime = (): string => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes}:${seconds} ${ampm}`;
};

const formatContext = (context?: Record<string, unknown>): string => {
  if (!context || Object.keys(context).length === 0) return '';
  
  return Object.entries(context)
    .map(([key, value]) => {
      const formattedValue = typeof value === 'string' ? `"${value}"` : JSON.stringify(value);
      return `${key}:${formattedValue}`;
    })
    .join(' ');
};

const formatLog = (level: LogLevel, message: string, context?: Record<string, unknown>): string => {
  const time = formatTime();
  const contextStr = formatContext(context);
  const contextPart = contextStr ? ` ${contextStr}` : '';
  return `${time} | ${level} : [${message}]${contextPart}`;
};

const printLog = (level: LogLevel, message: string, context?: Record<string, unknown>): void => {
  if (!__DEV__) {
    // In production, only log errors
    if (level !== 'ERROR') return;
  }

  const colorKey = level.toLowerCase() as keyof typeof COLORS;
  const color = COLORS[colorKey] || COLORS.reset;
  const formattedMessage = formatLog(level, message, context);
  
  console.log(`${color}${formattedMessage}${COLORS.reset}`);
};

// Export convenience methods with context support
export const log = {
  debug: (message: string, context?: Record<string, unknown>) => {
    printLog('DEBUG', message, context);
  },
  
  info: (message: string, context?: Record<string, unknown>) => {
    printLog('INFO', message, context);
  },
  
  warn: (message: string, context?: Record<string, unknown>) => {
    printLog('WARN', message, context);
  },
  
  error: (message: string, error?: Error | unknown, context?: Record<string, unknown>) => {
    const errorContext: Record<string, unknown> = { ...context };
    
    if (error instanceof Error) {
      errorContext.errorMessage = error.message;
    } else if (error) {
      errorContext.error = error;
    }
    
    printLog('ERROR', message, errorContext);
  },
};
