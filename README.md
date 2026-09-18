# @pipeworx/repology

[Repology](https://repology.org) MCP — cross-distro package version aggregator. Tracks ~5 M package entries across Linux distributions, BSDs, language ecosystems, and other repos. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Tools

- `project(name)` — every package across all repos for a project name
- `problems(project)` — outstanding maintenance problems for a project
- `repositories()` — list every repo Repology indexes (stats + status)
- `maintainer(maintainer)` — maintainer summary (e.g. `john@example.com`)
- `projects_search(start_name?, end_name?, search?, maintainer?, category?, in_repo?, not_in_repo?, count?)` — paginate over projects

## Data source

`https://repology.org/api/v1/`

## Known issue

When invoked through the hosted Pipeworx gateway, repology often returns
HTTP 522. The Cloudflare-Workers shared egress IPs appear to be throttled
at repology.org's Cloudflare edge. Direct browser/CLI calls to the same
endpoint succeed. If you self-host this pack on a different egress (your
own server, your laptop), the API is fully usable.

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "repology": {
      "url": "https://gateway.pipeworx.io/repology/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/repology/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Repology data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/repology_project \
  -H 'Content-Type: application/json' \
  -d '{"name":"firefox"}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/repology_project`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.
