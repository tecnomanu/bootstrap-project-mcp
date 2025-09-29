export const logger = {
	info: (...args: any[]) => console.error('[INFO]', ...args),
	debug: (...args: any[]) => console.error('[DEBUG]', ...args),
	error: (...args: any[]) => console.error('[ERROR]', ...args),
	warn: (...args: any[]) => console.error('[WARN]', ...args),
};
