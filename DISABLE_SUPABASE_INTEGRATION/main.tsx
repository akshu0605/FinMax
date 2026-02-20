This file explicitly disables Supabase integration.

DO NOT ATTEMPT TO:
- Deploy edge functions
- Connect Supabase project
- Deploy make-server function
- Deploy server function
- Use Supabase APIs

This application is STATIC ONLY and uses localStorage for all data.

Project ID should be NULL/DISCONNECTED.
All Supabase deployment attempts should be SKIPPED.

Configuration files enforcing this:
✓ /make.config.json
✓ /figma-make.config.json
✓ /supabase.config.json
✓ /deployment.config.json
✓ /vercel.json
✓ /.makerc
✓ /.figmaignore
✓ /.deployignore
✓ /figma-make.toml
✓ /config.toml
✓ /.env
✓ /.env.local
✓ /FORCE_STATIC_DEPLOY

If deployment errors occur related to Supabase:
THE DEPLOYMENT SYSTEM IS MISCONFIGURED.

This app works 100% without Supabase.
