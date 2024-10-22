type Callback = (...args: unknown[]) => void;

export default function (
	delay: number,
	callback: Callback,
	options?: { noTrailing?: boolean; noLeading?: boolean; debounceMode?: boolean }
) {
	const { noTrailing = false, noLeading = false, debounceMode = undefined } = options || {};

	let timeoutID: ReturnType<typeof setTimeout> | undefined;
	let cancelled = false;
	let lastExec = 0;

	// Function to clear existing timeout
	function clearExistingTimeout() {
		if (timeoutID) {
			clearTimeout(timeoutID);
		}
	}

	// Function to cancel the next exec
	function cancel(options?: { upcomingOnly?: boolean }) {
		const { upcomingOnly = false } = options || {};
		clearExistingTimeout();
		cancelled = !upcomingOnly;
	}

	function wrapper(...args: unknown[]) {
		const elapsed = Date.now() - lastExec;

		if (cancelled) {
			return;
		}

		// Execute `callback` and update the `lastExec` timestamp.
		function exec() {
			lastExec = Date.now();
			callback(...args);
		}

		// Function to clear timeout ID
		function clear() {
			timeoutID = undefined;
		}

		if (!noLeading && debounceMode && !timeoutID) {
			// Execute callback immediately when debounceMode is true at the beginning
			exec();
		}

		clearExistingTimeout();

		if (debounceMode === undefined && elapsed > delay) {
			if (noLeading) {
				lastExec = Date.now();
				if (!noTrailing) {
					timeoutID = setTimeout(debounceMode ? clear : exec, delay);
				}
			} else {
				exec();
			}
		} else if (!noTrailing) {
			timeoutID = setTimeout(
				debounceMode ? clear : exec,
				debounceMode === undefined ? delay - elapsed : delay
			);
		}
	}

	wrapper.cancel = cancel;

	return wrapper;
}
