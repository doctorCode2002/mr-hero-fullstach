<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1V-BLGOC6ZKPC2-TLJ_dXd8fXki23ev4o

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies: `npm install`
2. Configure env:
   - `.env.local`: set `GEMINI_API_KEY` and `VITE_API_URL` (defaults to `http://localhost:4000/api`).
   - `.env`: database and server settings. A working default is included:  
     `DATABASE_URL=file:c:/temp/palletwholesale-dev.db` (use a path without spaces on Windows), plus `ADMIN_PASSWORD`, `ADMIN_TOKEN`, and `CLIENT_ORIGIN`.
3. Initialize the database: `npm run db:migrate` then `npm run db:seed`.
4. Run both servers: `npm run dev:full` (frontend + API).  
   Or run separately: `npm run server` (API) and `npm run dev` (frontend).
