#!/bin/bash
echo "=== ACTOR AI - Project Verification ==="
echo ""
ERRORS=0

check_dir() {
  if [ -d "$1" ]; then echo "  DIR  $1"; else echo "  MISS  $1"; ERRORS=$((ERRORS+1)); fi
}

check_file() {
  if [ -f "$1" ]; then echo "  FILE $1 ($(wc -l < "$1") lines)"; else echo "  MISS $1"; ERRORS=$((ERRORS+1)); fi
}

echo "📁 Directory Structure:"
check_dir "src/app"
check_dir "src/app/dashboard"
check_dir "src/app/library"
check_dir "src/app/read"
check_dir "src/app/knowledge-graph"
check_dir "src/app/review"
check_dir "src/app/achievements"
check_dir "src/app/search"
check_dir "src/app/analytics"
check_dir "src/app/settings"
check_dir "src/app/api/mission"
check_dir "src/app/api/reflection"
check_dir "src/app/api/quiz"
check_dir "src/app/api/search"
check_dir "src/app/api/dashboard"
check_dir "src/app/api/profile"
check_dir "src/components/ui"
check_dir "src/components/layout"
check_dir "src/lib"
check_dir "src/types"
check_dir "src/prompts"
check_dir "database"

echo ""
echo "📄 Core Files:"
check_file "src/app/layout.tsx"
check_file "src/app/page.tsx"
check_file "src/app/globals.css"
check_file "src/app/dashboard/page.tsx"
check_file "src/app/library/page.tsx"
check_file "src/app/read/page.tsx"
check_file "src/lib/supabase.ts"
check_file "src/lib/openai.ts"
check_file "src/lib/utils.ts"
check_file "src/types/index.ts"
check_file "src/prompts/index.ts"
check_file "database/schema.sql"
check_file ".env.example"
check_file "tailwind.config.ts"

echo ""
echo "🔧 API Routes:"
check_file "src/app/api/mission/route.ts"
check_file "src/app/api/reflection/route.ts"
check_file "src/app/api/quiz/route.ts"
check_file "src/app/api/search/route.ts"
check_file "src/app/api/dashboard/route.ts"
check_file "src/app/api/profile/route.ts"

echo ""
echo "📦 Dependencies: $(node -e "console.log(Object.keys(require('./package.json').dependencies||{}).length)")"
echo ""
if [ $ERRORS -eq 0 ]; then
  echo "✅ VERIFICATION PASSED - All files present!"
else
  echo "❌ $ERRORS items missing"
fi
