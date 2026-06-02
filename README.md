# mcp-repology

Repology MCP — cross-distro package version aggregator.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `project` | All packages (per-repo) for one project name (e.g. "firefox"). |
| `problems` | Outstanding maintenance problems for a project. |
| `repositories` | List every repo Repology indexes (stats + status). |
| `maintainer` | Maintainer summary by canonical maintainer id (often email). |
| `projects_search` | Paginate over projects with filters. |

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

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
