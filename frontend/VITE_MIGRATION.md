# Vite Migration Guide

This project has been configured to use Vite instead of Create React App.

## What's Changed

1. **Vite Configuration**: Added `vite.config.ts` with React plugin
2. **HTML Template**: Moved `index.html` to root and updated for Vite
3. **TypeScript Config**: Updated `tsconfig.json` for Vite compatibility
4. **Package Scripts**: Updated to use Vite commands
5. **Path Aliases**: Added `@` alias for `src` directory

## Installation

Run the installation script when your network connection is stable:

```bash
./install-vite.sh
```

Or manually install dependencies:

```bash
yarn add vite @vitejs/plugin-react @types/node --dev
```

## Available Scripts

- `yarn dev` or `yarn start` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn test` - Run tests (still using react-scripts)

## Benefits of Vite

- ⚡ **Faster Development**: Hot Module Replacement (HMR) is much faster
- 🚀 **Faster Builds**: Uses esbuild for bundling
- 📦 **Smaller Bundle**: Better tree-shaking and optimization
- 🔧 **Better DX**: Faster startup and better error messages

## Environment Variables

Vite uses `VITE_` prefix for environment variables instead of `REACT_APP_`:

```bash
# Old (CRA)
REACT_APP_API_URL=http://localhost:3001

# New (Vite)
VITE_API_URL=http://localhost:3001
```

## Path Aliases

You can now use the `@` alias to import from the src directory:

```typescript
// Instead of
import Component from '../../../components/Component'

// You can use
import Component from '@/components/Component'
```

## Next Steps

1. Install dependencies when network is stable
2. Test the development server: `yarn dev`
3. Update any environment variables to use `VITE_` prefix
4. Consider removing `react-scripts` if no longer needed for testing
