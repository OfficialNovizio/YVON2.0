# Shared Skills Root

This directory contains skills and brand profiles that are shared across all YVON agents. Instead of duplicating these files in every agent's `skills/` folder, all agents reference the files here.

## Structure

```
shared/
├── skills/
│   ├── agents/        # Agent-agnostic skills
│   │   └── 01-memory.md
│   └── coding/        # Coding guidelines
│       └── 01-karpathy.md
└── brands/            # Brand profiles
    ├── novizio.md
    └── hourbour.md
```

## What Lives Here

### `skills/agents/01-memory.md`
Critical — loaded by all agents. Contains:
- Session Start Protocol (required reading order)
- Active Session Control (brand isolation rules)
- Session End Protocol (logging requirements)
- Token budget guidelines

### `skills/coding/01-karpathy.md`
Critical — loaded by all agents. Contains:
- Think Before Coding guidelines
- Simplicity First principles
- Surgical Changes rules
- Goal-Driven Execution methodology

### `brands/novizio.md`
Brand profile for Novizio (fashion e-commerce).
- Identity, ICP, brand voice
- Platform CTAs, content pillars
- Agent-specific notes

### `brands/hourbour.md`
Brand profile for Hourbour (fintech SaaS).
- Identity, ICP, brand voice
- Platform CTAs, content pillars
- Agent-specific notes

## Editing Shared Skills

**Rule:** Edit ONLY the files in this directory. Do NOT edit the stub files in individual agent folders.

When you update a shared skill:
1. Edit the file in `shared/`
2. The individual agent stub files redirect to the shared version
3. After editing, run `scripts/skills-sync.sh` to verify consistency

## Deprecated Local Copies

Individual agent `skills/` folders may still contain copies of shared skills with a `deprecated: true` frontmatter and a `redirect` field pointing here. These are stubs for backward compatibility during the transition period. Do not edit them — edit the shared version instead.