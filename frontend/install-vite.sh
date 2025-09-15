#!/bin/bash

# Install Vite and related dependencies
echo "Installing Vite and related dependencies..."

# Add Vite dependencies
yarn add vite @vitejs/plugin-react @types/node --dev

# Remove Create React App dependencies (optional - you can keep them for testing)
# yarn remove react-scripts

echo "Vite installation complete!"
echo "You can now run:"
echo "  yarn dev    - Start development server"
echo "  yarn build  - Build for production"
echo "  yarn preview - Preview production build"
