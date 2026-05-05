#\!/bin/bash
# skills-sync.sh — Re-copy all skills from Global Skills source to project and agent folders
# Run after ANY edit to D:\Global Skills\yvon-skills\
# Usage: bash scripts/skills-sync.sh

set -e

SKILLS_SOURCE="D:/Global Skills/yvon-skills"
PROJ_DIR="$(dirname "$0")/.."
AGENT_DIR="$PROJ_DIR/agent-department"

echo "🔄 Syncing skills from $SKILLS_SOURCE..."

# ── Agents ──
echo "  → marcus"
cp "$SKILLS_SOURCE/coding/01-karpathy.md" "$AGENT_DIR/marcus/skills/coding/"
cp "$SKILLS_SOURCE/agents/01-memory.md"   "$AGENT_DIR/marcus/skills/agents/"
cp "$SKILLS_SOURCE/agents/03-prompting.md" "$AGENT_DIR/marcus/skills/agents/"

echo "  → dev"
cp "$SKILLS_SOURCE/coding/01-karpathy.md" "$AGENT_DIR/dev/skills/coding/"
cp "$SKILLS_SOURCE/coding/02-general.md"  "$AGENT_DIR/dev/skills/coding/"
cp "$SKILLS_SOURCE/agents/01-memory.md"   "$AGENT_DIR/dev/skills/agents/"
cp "$SKILLS_SOURCE/code-review/01-review-changes.md" "$AGENT_DIR/dev/skills/code-review/"
cp "$SKILLS_SOURCE/code-review/02-review-pr.md"       "$AGENT_DIR/dev/skills/code-review/"
cp "$SKILLS_SOURCE/code-review/03-build-graph.md"     "$AGENT_DIR/dev/skills/code-review/"

echo "  → raj"
cp "$SKILLS_SOURCE/coding/01-karpathy.md" "$AGENT_DIR/raj/skills/coding/"
cp "$SKILLS_SOURCE/coding/02-general.md"  "$AGENT_DIR/raj/skills/coding/"
cp "$SKILLS_SOURCE/coding/03-nextjs.md"   "$AGENT_DIR/raj/skills/coding/"
cp "$SKILLS_SOURCE/agents/01-memory.md"   "$AGENT_DIR/raj/skills/agents/"

echo "  → priya"
cp "$SKILLS_SOURCE/coding/01-karpathy.md" "$AGENT_DIR/priya/skills/coding/"
cp "$SKILLS_SOURCE/agents/01-memory.md"   "$AGENT_DIR/priya/skills/agents/"
cp "$SKILLS_SOURCE/ui/01-design.md"       "$AGENT_DIR/priya/skills/ui/"
cp "$SKILLS_SOURCE/ui/02-tailwind.md"     "$AGENT_DIR/priya/skills/ui/"
cp "$SKILLS_SOURCE/ui/03-components.md"   "$AGENT_DIR/priya/skills/ui/"

echo "  → quinn"
cp "$SKILLS_SOURCE/agents/01-memory.md"    "$AGENT_DIR/quinn/skills/agents/"
cp "$SKILLS_SOURCE/agents/02-openrouter.md" "$AGENT_DIR/quinn/skills/agents/"

# ── Brands ──
echo "  → novizio"
cp "$SKILLS_SOURCE/coding/01-karpathy.md" "$PROJ_DIR/brands/novizio/skills/"
cp "$SKILLS_SOURCE/agents/01-memory.md"   "$PROJ_DIR/brands/novizio/skills/"
cp "$SKILLS_SOURCE/brands/novizio.md"     "$PROJ_DIR/brands/novizio/skills/"

echo "  → hourbour"
cp "$SKILLS_SOURCE/coding/01-karpathy.md" "$PROJ_DIR/brands/hourbour/skills/"
cp "$SKILLS_SOURCE/agents/01-memory.md"   "$PROJ_DIR/brands/hourbour/skills/"
cp "$SKILLS_SOURCE/brands/hourbour.md"    "$PROJ_DIR/brands/hourbour/skills/"

echo ""
echo "✅ Skills sync complete — $(date '+%Y-%m-%d %H:%M')"
