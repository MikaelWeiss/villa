# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application called "Villa" built with Create React App. It's deployed to Fly.io at https://villa.fly.dev.

## Development Commands

### Local Development
- `npm start` - Start development server on http://localhost:3000 with hot reload
- `npm test` - Run tests in interactive watch mode
- `npm run build` - Create production build in `build/` folder

### Testing
- `npm test` - Run all tests
- `npm test -- --watchAll=false` - Run tests once without watch mode

## Architecture

- **Framework**: React 19.1.1 with Create React App
- **Testing**: Jest with React Testing Library
- **Deployment**: Fly.io with Docker containerization
- **Structure**: Standard CRA structure with `src/` containing main application code

## Deployment

The app is containerized using Docker and deployed to Fly.io:
- Production builds are served on port 3000
- Deployed to primary region: San Jose (sjc)
- Auto-scaling configured with 0 minimum machines
- Uses Node.js 24.8.0 runtime

## Key Files

- `src/App.js` - Main application component
- `public/index.html` - HTML template
- `fly.toml` - Fly.io deployment configuration
- `Dockerfile` - Multi-stage Docker build for production deployment