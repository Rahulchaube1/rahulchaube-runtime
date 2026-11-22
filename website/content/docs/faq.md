## The shell cannot find rc

Open a new terminal after installing. On Linux or macOS, try `~/.rc-runtime/bin/rc --version`. On Windows, try `& "$HOME/.rc-runtime/bin/rc.exe" --version` in PowerShell. If that works, add the installation’s `bin` directory to PATH. A custom `RC_INSTALL_DIR` requires its own PATH entry.

## A module cannot be resolved

Check the import spelling and nearest `rc.json`. For a pinned dependency, run `rc install` from the project directory. For a package that imports `node:fs` or another host-specific API, choose a compatible implementation. [Module installation](/docs/package-manager) · [Compatibility](/docs/compatibility)

## A digest or offline install fails

Compare the manifest digest with the intended published file. If the URL now serves different bytes, review the change before updating the digest. Run an online install once to populate the current user’s cache. `rc install --offline` requires verified bytes for the requested digest.

## A listener cannot bind

Stop the process already using the port or pick another port in `app.listen`. In a test that needs a real socket, use port `0` and read the assigned value from `server.port`. Close the listener when finished.

## Tests are missing or hanging

Use a name such as `app.test.ts` and register tests with `test` from `rc:test`. Run `rc test app.test.ts` to select the file explicitly. Keep listener startup out of test imports. A live listener keeps the context running. [Testing guide](/docs/testing)
