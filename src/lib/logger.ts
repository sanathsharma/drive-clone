import { type } from "arktype";
import log from "loglevel";
import prefix from "loglevel-plugin-prefix";

export const LogLevel = type('"TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "SILENT"');

prefix.reg(log);
prefix.apply(log, {
	levelFormatter: (level) => level.toUpperCase().padStart(6),
	template: "[%t] %l",
});

const logger = log.getLogger("drive-clone");

if (process.env.LOG_LEVEL) {
	const result = LogLevel(process.env.LOG_LEVEL);
	if (result instanceof type.errors) {
		throw new Error(`Invalid LOG_LEVEL: ${result.summary}`);
	}
	logger.setLevel(result);
}
export default logger;