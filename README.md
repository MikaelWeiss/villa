# Villa

**Public URL:** https://villa.fly.dev

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Supabase Setup

### Prerequisites
- A Supabase account and project
- Node.js and npm installed

### 1. Environment Configuration

Create a `.env` file in the project root with your Supabase credentials:

```
REACT_APP_SUPABASE_URL=your_project_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

Get these values from:
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key

### 2. Database Schema

This app uses the following tables:

**reports** - Maintenance/damage reports
- `id` (uuid, primary key)
- `tenant_id` (uuid, foreign key to auth.users)
- `tenant_name` (text)
- `unit` (text)
- `description` (text)
- `status` (text) - 'open', 'in-progress', or 'resolved'
- `created_at` (timestamp)
- `updated_at` (timestamp)

**managers** - Manager role assignments
- `id` (uuid, primary key)
- `email` (text, unique)
- `created_at` (timestamp)

**quotes** - Lead generation from website
- `id` (uuid, primary key)
- `name` (text)
- `email` (text)
- `phone` (text)
- `portfolio_size` (text)
- `message` (text)
- `status` (text)
- `source` (text)
- `created_at` (timestamp)

### 3. RPC Functions

Create the `is_manager` function in your Supabase SQL Editor:

```sql
CREATE OR REPLACE FUNCTION is_manager(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM managers WHERE email = user_email
  );
END;
$$;
```

### 4. Row Level Security (RLS)

Enable RLS on your tables and add appropriate policies:

**reports table:**
```sql
-- Tenants can read their own reports
CREATE POLICY "Tenants can view own reports"
  ON reports FOR SELECT
  USING (auth.uid() = tenant_id);

-- Tenants can insert their own reports
CREATE POLICY "Tenants can create own reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = tenant_id);

-- Managers can view all reports
CREATE POLICY "Managers can view all reports"
  ON reports FOR SELECT
  USING (is_manager((SELECT email FROM auth.users WHERE id = auth.uid())));

-- Managers can update all reports
CREATE POLICY "Managers can update all reports"
  ON reports FOR UPDATE
  USING (is_manager((SELECT email FROM auth.users WHERE id = auth.uid())));
```

### 5. Authentication

Enable Google OAuth in Supabase:
1. Go to Authentication > Providers in your Supabase dashboard
2. Enable Google provider
3. Configure your Google OAuth credentials
4. Add authorized redirect URLs

### 6. Running Locally

```bash
npm install
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### 7. Application Structure

- `src/authentication/supabase.js` - Supabase client initialization
- `src/authentication/index.js` - Auth context provider with Google OAuth
- `src/reports/Reports.js` - Tenant dashboard for damage reports
- `src/pages/manager/` - Manager dashboard pages
- `src/utils/managerUtils.js` - Manager role management utilities

### 8. Enable Custom Access Token Hook

To enable role-based authentication via JWT claims:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Hooks**
3. Enable the **"Custom Access Token"** hook
4. Select the function: `custom_access_token_hook`
5. Save changes

This eliminates an extra database call on every auth state change by embedding the user role directly in the JWT token.

## Deploying to Fly.io

This is a React single-page app served as static files.

### Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage - serve static files
FROM pierrezemb/gostatic
COPY --from=build /app/build /srv/http
```

### Deploy Steps

1. Create `fly.toml` with static port 80 exposure
2. Launch the app:
```bash
flyctl launch
```

3. Set environment variables:
```bash
flyctl secrets set \
  REACT_APP_SUPABASE_URL=your_project_url \
  REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

**Note**: CRA reads `REACT_APP_*` at build time. If building locally, ensure your `.env.production` has the correct values before running `npm run build`.
