# Marketing Skills Implementation Plan (v2)

> Revised: 2026-05-04
> Supersedes v1. Fixes: wrong Marcus assignment, duplicate shared skill, undefined secondary pattern, missing SKILLS.md step, undefined category folder.

---

## Ground Rules (read before implementing)

| Rule | Detail |
|------|--------|
| **File location** | All new skills land in `agent-department/Marketing/[agent]/skills/[category]/[skill-name]/SKILL.md` |
| **New category folder** | Prompt Systems skills → `prompt-systems/` (new subfolder in each agent's skills/) |
| **Workflow skills** | Workflow Building skills → `workflow/` (new subfolder) |
| **Secondary agent** = Load Trigger only | No duplicate skill files. Secondary agents add one row to their `SKILLS.md` Load Triggers table pointing to the primary agent's file path. |
| **Every new skill** → update `SKILLS.md` | After placing each skill file, add a Load Trigger row in the owning agent's `SKILLS.md`. This is mandatory. |
| **Shared skill** | `Brand Guidelines Extraction` already exists at `agent-department/shared/BrandGuidelinesExtraction.md`. Do NOT create a duplicate. Lena and Atlas reference it via Load Trigger only. |

---

## Skills Map

### Category 1 — Brand Intelligence

#### Brand Guidelines Extraction
| Field | Value |
|-------|-------|
| File | `agent-department/shared/BrandGuidelinesExtraction.md` ← **already exists, do not recreate** |
| Primary agent | `lena-brand` — add Load Trigger pointing to shared file |
| Secondary agent | `atlas-art-director` — add Load Trigger pointing to shared file |
| Load trigger condition (Lena) | Extracting voice, tone, or style rules from brand materials |
| Load trigger condition (Atlas) | Extracting visual brand guidelines for art direction |

---

#### Brand Analyst
| Field | Value |
|-------|-------|
| File | `agent-department/Marketing/kai/skills/prompt-systems/brand-analyst/SKILL.md` |
| Primary agent | `kai-analyst` |
| Secondary agent | `nate-growth` — Load Trigger only (growth opportunity + funnel analysis) |
| Load trigger condition (Kai) | Analyzing market gaps, competitor positioning, YVON health score |
| Load trigger condition (Nate) | Identifying brand-level growth opportunities from competitive data |

---

### Category 2 — Prompt Systems

#### Image Prompt Enhancer
| Field | Value |
|-------|-------|
| File | `agent-department/Marketing/atlas/skills/prompt-systems/image-prompt-enhancer/SKILL.md` |
| Primary agent | `atlas-art-director` |
| Secondary agent | `rio-ads` — Load Trigger only (carousel + static ad visuals) |
| Load trigger condition (Atlas) | Refining and optimising image prompts for AI generation |
| Load trigger condition (Rio) | Enhancing visual prompts for static carousel ad creative |

---

#### JSON Image Prompter
| Field | Value |
|-------|-------|
| File | `agent-department/Marketing/pixel/skills/prompt-systems/json-image-prompter/SKILL.md` |
| Primary agent | `pixel-production` |
| Load trigger condition | Generating structured, repeatable JSON prompts for batch image production |

---

#### JSON Prompter Video
| Field | Value |
|-------|-------|
| File | `agent-department/Marketing/rio/skills/prompt-systems/json-prompter-video/SKILL.md` |
| Primary agent | `rio-ads` |
| Load trigger condition | Standardising video ad specs (duration, format, hooks) for Meta/TikTok |

---

#### Kling 3.0 Prompter
| Field | Value |
|-------|-------|
| File | `agent-department/Marketing/atlas/skills/prompt-systems/kling-3-prompter/SKILL.md` |
| Primary agent | `atlas-art-director` |
| Load trigger condition | Writing optimised prompts for Kling 3.0 AI video generation |

---

#### Nano-banana Prompter
| Field | Value |
|-------|-------|
| File | `agent-department/Marketing/pixel/skills/prompt-systems/nano-banana-prompter/SKILL.md` |
| Primary agent | `pixel-production` |
| Load trigger condition | Optimising prompts for Stable Diffusion (nano-banana) batch generation |

---

#### Static Ads Prompter
| Field | Value |
|-------|-------|
| File | `agent-department/Marketing/rio/skills/prompt-systems/static-ads-prompter/SKILL.md` |
| Primary agent | `rio-ads` |
| Load trigger condition | Generating prompts for static ad creative (Meta, Instagram, TikTok) |

---

#### UGC Prompter
| Field | Value |
|-------|-------|
| File | `agent-department/Marketing/lena/skills/prompt-systems/ugc-prompter/SKILL.md` |
| Primary agent | `lena-brand` |
| Secondary agent | `nate-growth` — Load Trigger only (UGC as growth/conversion lever) |
| Load trigger condition (Lena) | Creating realistic, conversational UGC-style ad scripts and prompts |
| Load trigger condition (Nate) | Using UGC prompts for funnel conversion experiments |

---

#### Video Prompt Enhancer
| Field | Value |
|-------|-------|
| File | `agent-department/Marketing/rio/skills/prompt-systems/video-prompt-enhancer/SKILL.md` |
| Primary agent | `rio-ads` |
| Load trigger condition | Enhancing video prompts for higher-converting ad performance |

---

### Category 3 — Workflow Building

#### Nodes Overview
| Field | Value |
|-------|-------|
| File | `agent-department/COO/diana/skills/workflow/nodes-overview/SKILL.md` |
| Primary agent | `diana-coo` ← **moved from marcus-ceo** |
| Why | Diana owns workflow and process design. Nodes are workflow building blocks — operational, not strategic. Marcus has no business loading a workflow tool. |
| Load trigger condition | Architecting or documenting a multi-step creative production workflow |

---

#### Pletor Agent
| Field | Value |
|-------|-------|
| File | `agent-department/COO/diana/skills/workflow/pletor-agent/SKILL.md` |
| Primary agent | `diana-coo` |
| Load trigger condition | Orchestrating multi-step creative production tasks across agents |

---

#### Advanced Nodes
| Field | Value |
|-------|-------|
| File | `agent-department/Marketing/pixel/skills/workflow/advanced-nodes/SKILL.md` |
| Primary agent | `pixel-production` |
| Load trigger condition | Configuring complex batch image/video generation workflows with QC loops |

---

#### Model Selection
| Field | Value |
|-------|-------|
| File | `agent-department/Marketing/atlas/skills/workflow/model-selection/SKILL.md` |
| Primary agent | `atlas-art-director` |
| Load trigger condition | Choosing optimal AI model for a creative task (Midjourney vs SDXL vs Kling) |

---

## Agent Skill Summary

| Agent | New Skill Files | Secondary (Load Trigger only) |
|-------|----------------|-------------------------------|
| **lena-brand** | UGC Prompter | Brand Guidelines Extraction (shared) |
| **kai-analyst** | Brand Analyst | — |
| **rio-ads** | JSON Prompter Video, Static Ads Prompter, Video Prompt Enhancer | Image Prompt Enhancer (atlas) |
| **atlas-art-director** | Image Prompt Enhancer, Kling 3.0 Prompter, Model Selection | Brand Guidelines Extraction (shared) |
| **pixel-production** | JSON Image Prompter, Nano-banana Prompter, Advanced Nodes | — |
| **nate-growth** | — | Brand Analyst (kai), UGC Prompter (lena) |
| **diana-coo** | Nodes Overview, Pletor Agent | — |
| **marcus-ceo** | — | — |

**Total new skill files: 12** (Brand Guidelines Extraction already exists — no file needed)

---

## Implementation Steps (per skill)

For every skill file you hand me:

1. Place file at the path listed above
2. Add Load Trigger row to primary agent's `SKILLS.md`
3. If secondary agent exists: add Load Trigger row to their `SKILLS.md` pointing to primary agent's file
4. No other files need changing

---

## Implementation Phases

### Phase 1 — Brand Foundation + Core Prompts
| Skill | Agent | Impact |
|-------|-------|--------|
| Brand Guidelines Extraction | lena + atlas (Load Trigger) | Shared — zero file cost |
| Brand Analyst | kai-analyst | Strategic positioning baseline |
| Image Prompt Enhancer | atlas-art-director | Visual quality across all campaigns |
| UGC Prompter | lena-brand | Conversion copy |
| Static Ads Prompter | rio-ads | Direct ROAS |

### Phase 2 — Video + Batch Production
| Skill | Agent | Impact |
|-------|-------|--------|
| JSON Image Prompter | pixel-production | Scale |
| JSON Prompter Video | rio-ads | Standardised ad specs |
| Video Prompt Enhancer | rio-ads | Video ad performance |
| Nano-banana Prompter | pixel-production | Batch creative |
| Kling 3.0 Prompter | atlas-art-director | AI video direction |

### Phase 3 — Workflow Infrastructure
| Skill | Agent | Impact |
|-------|-------|--------|
| Nodes Overview | diana-coo | Workflow architecture |
| Pletor Agent | diana-coo | Campaign orchestration |
| Advanced Nodes | pixel-production | Production automation |
| Model Selection | atlas-art-director | Model strategy |
