# Deployment Instructions

## Environment Variables Setup

This app requires the `VITE_API_KEY` environment variable to be set in your deployment platform.

### For Netlify:

1. Go to your Netlify dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Add the following:
   - **Key**: `VITE_API_KEY`
   - **Value**: `AIzaSyADzHn9oS48NUsaLIJLElSrtz-c5O-spLs`
5. Click **Save**
6. **Redeploy** your site (go to **Deploys** tab and click **Trigger deploy** → **Clear cache and deploy site**)

### For Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Key**: `VITE_API_KEY`
   - **Value**: `AIzaSyADzHn9oS48NUsaLIJLElSrtz-c5O-spLs`
   - **Environment**: Production, Preview, Development (select all)
5. Click **Save**
6. Redeploy your site

### For Other Platforms:

Set the environment variable `VITE_API_KEY` with the value `AIzaSyADzHn9oS48NUsaLIJLElSrtz-c5O-spLs` in your platform's environment variable settings.

## Important Notes:

- The `.env.local` file is **NOT** deployed to production (it's gitignored for security)
- Environment variables must be set in your deployment platform's dashboard
- After setting environment variables, you **must redeploy** for changes to take effect
- Vite requires the `VITE_` prefix for environment variables to be exposed to client-side code

