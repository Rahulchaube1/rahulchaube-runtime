## Release metadata

Public GET requests to `https://www.rahulchaube.space` serve the current release without authentication.

| Path | Response |
| --- | --- |
| `/api/health` | Status, deployed commit, service name, timestamp and runtime release. |
| `/api/version` | Release version, channel, asset URLs, sizes and digests. |
| `/api/releases` | Latest release and its target filenames. |
| `/api/checksum` | SHA-256 digests keyed by archive filename. |
| `/api/install?platform=linux-x64` | One tab-separated line with the version, digest and HTTPS archive URL. |
| `/api/download?platform=linux-x64` | Redirect to the archive for the selected target. |
| `/api/templates` | Available starter templates. |
| `/api/plugins` | The published catalog and its compatibility scope. |

## Request an archive

Use the platform keys `linux-x64`, `linux-arm64`, `darwin-x64`, `darwin-arm64` or `win-x64`. An unknown target returns HTTP 404. The download endpoint also accepts the current version as a `version` query parameter.

```sh
curl -fsSL 'https://www.rahulchaube.space/api/install?platform=linux-x64'
```

Fetch the returned URL, hash the downloaded file and compare it with the supplied digest before extracting. The official installers perform these steps. [Live release manifest](/api/version) · [OpenAPI specification](/api/openapi.json)
