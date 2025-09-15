/**
 * Font loading utility to ensure consistent font rendering
 * Prevents font swapping during page changes and refreshes
 */

export const fontFamilies = {
  epilogue: {
    regular: 'Epilogue-Regular',
    medium: 'Epilogue-Medium',
    semiBold: 'Epilogue-SemiBold',
    bold: 'Epilogue-Bold',
  },
  clashDisplay: {
    regular: 'ClashDisplay-Regular',
    medium: 'ClashDisplay-Medium',
    semiBold: 'ClashDisplay-Semibold',
    bold: 'ClashDisplay-Bold',
  },
} as const;

export const fontFallbacks = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
];

/**
 * Creates a font family string with fallbacks
 */
export const createFontFamily = (fontName: string): string => {
  return `"${fontName}", ${fontFallbacks.join(', ')}`;
};

/**
 * Preloads fonts to prevent FOUT (Flash of Unstyled Text)
 */
export const preloadFonts = (): Promise<void[]> => {
  const fontUrls = [
    '/src/shared/assets/fonts/Epilogue/static/Epilogue-Medium.ttf',
    '/src/shared/assets/fonts/Epilogue/static/Epilogue-Regular.ttf',
    '/src/shared/assets/fonts/Epilogue/static/Epilogue-SemiBold.ttf',
    '/src/shared/assets/fonts/Epilogue/static/Epilogue-Bold.ttf',
    '/src/shared/assets/fonts/ClashDisplay_Complete/Fonts/WEB/fonts/ClashDisplay-Regular.ttf',
    '/src/shared/assets/fonts/ClashDisplay_Complete/Fonts/WEB/fonts/ClashDisplay-Medium.ttf',
    '/src/shared/assets/fonts/ClashDisplay_Complete/Fonts/WEB/fonts/ClashDisplay-Semibold.ttf',
    '/src/shared/assets/fonts/ClashDisplay_Complete/Fonts/WEB/fonts/ClashDisplay-Bold.ttf',
  ];

  const fontPromises = fontUrls.map((url) => {
    return new Promise<void>((resolve, reject) => {
      const font = new FontFace('CustomFont', `url(${url})`);
      
      font.load()
        .then((loadedFont) => {
          document.fonts.add(loadedFont);
          resolve();
        })
        .catch((error) => {
          console.warn(`Failed to load font: ${url}`, error);
          resolve(); // Don't fail the entire loading process
        });
    });
  });

  return Promise.all(fontPromises);
};

/**
 * Checks if fonts are loaded and ready
 */
export const areFontsLoaded = (): boolean => {
  if (!document.fonts) return true; // Fallback for browsers without Font Loading API
  
  return document.fonts.check('16px "Epilogue-Medium"') &&
         document.fonts.check('16px "Epilogue-Regular"') &&
         document.fonts.check('16px "Epilogue-SemiBold"') &&
         document.fonts.check('16px "Epilogue-Bold"');
};

/**
 * Waits for fonts to be loaded
 */
export const waitForFonts = (): Promise<void> => {
  return new Promise((resolve) => {
    if (areFontsLoaded()) {
      resolve();
      return;
    }

    const checkFonts = () => {
      if (areFontsLoaded()) {
        resolve();
      } else {
        setTimeout(checkFonts, 100);
      }
    };

    checkFonts();
  });
};

/**
 * Initialize font loading
 */
export const initializeFonts = async (): Promise<void> => {
  try {
    await preloadFonts();
    await waitForFonts();
    console.log('Fonts loaded successfully');
  } catch (error) {
    console.warn('Font loading failed, using fallbacks:', error);
  }
};
