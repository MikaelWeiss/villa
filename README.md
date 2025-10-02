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

## Firebase + Auth + Firestore Setup (Vill)

1) Create Firebase project and web app
- Go to the Firebase console and create a project.
- Add a Web app; copy the config keys.
- Create a `.env.local` file in the project root with:

```
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxxxxx
REACT_APP_FIREBASE_APP_ID=1:xxxx:web:xxxx
```

2) Enable Authentication
- In Firebase console -> Authentication -> Sign-in method -> enable Google.

3) Enable Firestore
- Create a Cloud Firestore database in Production mode.
- Suggested security rules for basic tenant-only access to their own reports (adjust to your needs):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reports/{reportId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.tenantUid;
      allow create: if request.auth != null && request.resource.data.tenantUid == request.auth.uid;
    }
  }
}
```

4) Run locally
- `npm start`

App structure for auth and data:
- `src/firebase.js`: initializes Firebase (Auth, Firestore) from env vars.
- `src/AuthContext.js`: provides user state, Google sign-in, and sign out.
- `src/App.js`: routes between Sign-in and Dashboard.
- `src/Reports.js`: create and list reports for the signed-in user.

## Deploying to Fly.io

This is a React single-page app. Common approaches on Fly.io:
- Build a container that runs a static file server (e.g., `serve`) for the production build.
- Or use Fly Machines/Apps to serve the `build/` directory.

Minimal steps:
1) Add a Dockerfile that builds and serves CRA:

```
# Use node to build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve static files
FROM pierrezemb/gostatic
COPY --from=build /app/build /srv/http
```

2) Create `fly.toml` with static port 80 exposure, then:
- `flyctl launch` (choose yes to set up, no to deploy if you still need to set env)
- Set environment variables in Fly secrets (they become runtime env for the build only if you build on Fly; for static serve, env is not required at runtime):

```
flyctl secrets set \
  REACT_APP_FIREBASE_API_KEY=xxx \
  REACT_APP_FIREBASE_AUTH_DOMAIN=xxx \
  REACT_APP_FIREBASE_PROJECT_ID=xxx \
  REACT_APP_FIREBASE_STORAGE_BUCKET=xxx \
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxx \
  REACT_APP_FIREBASE_APP_ID=xxx
```

Notes:
- CRA reads `REACT_APP_*` at build time. When building inside Fly, set secrets before the build. If you build locally, ensure `.env.production` or your local env has the keys before `npm run build`, and deploy the built files.
- If you need role-based manager access later, add custom claims via Firebase Admin (requires a backend) or store roles in Firestore with rule checks.
