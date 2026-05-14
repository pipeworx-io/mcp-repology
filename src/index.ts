interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Repology MCP — cross-distro package version aggregator.
 *
 * Auth: none. Docs: https://repology.org/api
 * UA policy: must identify caller.
 */


const BASE = 'https://repology.org/api/v1';
// Repology sits behind Cloudflare and is unfriendly to CF-Workers shared
// egress IPs. A browser-like UA + Accept-Language seems to get through.
const UA =
  'Mozilla/5.0 (compatible; pipeworx-mcp-repology/1.0; +https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'project',
    description: 'All packages (per-repo) for one project name (e.g. "firefox").',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
    },
  },
  {
    name: 'problems',
    description: 'Outstanding maintenance problems for a project.',
    inputSchema: {
      type: 'object',
      properties: { project: { type: 'string' } },
      required: ['project'],
    },
  },
  {
    name: 'repositories',
    description: 'List every repo Repology indexes (stats + status).',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'maintainer',
    description: 'Maintainer summary by canonical maintainer id (often email).',
    inputSchema: {
      type: 'object',
      properties: { maintainer: { type: 'string' } },
      required: ['maintainer'],
    },
  },
  {
    name: 'projects_search',
    description: 'Paginate over projects with filters.',
    inputSchema: {
      type: 'object',
      properties: {
        start_name: { type: 'string', description: 'Pagination cursor — project name to start at.' },
        end_name: { type: 'string', description: 'Pagination cursor — project name to end at (reverse).' },
        search: { type: 'string', description: 'Substring match on project name.' },
        maintainer: { type: 'string' },
        category: { type: 'string' },
        in_repo: { type: 'string', description: 'Restrict to one repo, e.g. "alpine_edge".' },
        not_in_repo: { type: 'string', description: 'Exclude one repo.' },
        count: { type: 'number', description: '1-200 (default 50).' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'project':
      return rpGet(`/project/${encodeURIComponent(reqStr(args, 'name', '"firefox"'))}`);
    case 'problems':
      return rpGet(`/project/${encodeURIComponent(reqStr(args, 'project', '"firefox"'))}/problems`);
    case 'repositories':
      return rpGet(`/repositories`);
    case 'maintainer':
      return rpGet(`/maintainer/${encodeURIComponent(reqStr(args, 'maintainer', '"foo@example.com"'))}`);
    case 'projects_search': {
      const parts: string[] = [];
      let endpoint = '/projects/';
      if (args.start_name) endpoint = `/projects/${encodeURIComponent(String(args.start_name))}/`;
      if (args.end_name) endpoint = `/projects/..${encodeURIComponent(String(args.end_name))}/`;
      for (const k of ['search', 'maintainer', 'category', 'in_repo', 'not_in_repo'] as const) {
        if (args[k]) parts.push(`${k}=${encodeURIComponent(String(args[k]))}`);
      }
      parts.push(`count=${Math.min(200, Math.max(1, (args.count as number) ?? 50))}`);
      return rpGet(`${endpoint}?${parts.join('&')}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function rpGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': UA,
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  if (res.status === 404) throw new Error('Repology: not found');
  if (res.status === 429) throw new Error('Repology: rate-limit (HTTP 429)');
  if (res.status === 522) throw new Error('Repology: 522 — upstream timeout, often transient.');
  if (!res.ok) throw new Error(`Repology: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
