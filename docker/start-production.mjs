import { spawn } from "node:child_process";

const shutdownTimeoutMs = 10_000;

function run(command, args) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, { stdio: "inherit" });

		child.on("error", reject);
		child.on("exit", (code, signal) => {
			if (code === 0) {
				resolve();
				return;
			}

			reject(
				new Error(
					`${command} ${args.join(" ")} failed with ${signal ?? `exit code ${code}`}`,
				),
			);
		});
	});
}

function start(command, args) {
	return spawn(command, args, { stdio: "inherit" });
}

await run("pnpm", ["--filter", "backend", "db:migrate:deploy"]);

const services = [
	start("pnpm", ["--filter", "backend", "start"]),
	start("node", ["frontend/.output/server/index.mjs"]),
];

let isShuttingDown = false;

function stopServices(exitCode) {
	if (isShuttingDown) {
		return;
	}

	isShuttingDown = true;

	const forceKillTimer = setTimeout(() => {
		for (const service of services) {
			if (!service.killed) {
				service.kill("SIGKILL");
			}
		}
	}, shutdownTimeoutMs);

	forceKillTimer.unref();

	for (const service of services) {
		if (!service.killed) {
			service.kill("SIGTERM");
		}
	}

	let closedServices = 0;

	for (const service of services) {
		service.once("close", () => {
			closedServices += 1;

			if (closedServices === services.length) {
				clearTimeout(forceKillTimer);
				process.exit(exitCode);
			}
		});
	}
}

for (const service of services) {
	service.on("exit", (code, signal) => {
		if (isShuttingDown) {
			return;
		}

		console.error(
			`service exited with ${signal ?? `exit code ${code ?? 1}`}; stopping container`,
		);
		stopServices(code ?? 1);
	});
}

process.on("SIGINT", () => stopServices(0));
process.on("SIGTERM", () => stopServices(0));
