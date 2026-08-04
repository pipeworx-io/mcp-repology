# @pipeworx/repology

[Repology](https://repology.org) MCP — cross-distro package version aggregator. Tracks ~5 M package entries across Linux distributions, BSDs, language ecosystems, and other repos. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Repology data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
