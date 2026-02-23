const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Expo config plugin to ensure the reverse client ID intent filter is added to AndroidManifest
 * This ensures the app can catch OAuth redirects from Google
 */
module.exports = function withAndroidOAuthIntentFilter(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainActivity = androidManifest.manifest.application[0].activity?.find(
      (activity) => activity.$['android:name'] === '.MainActivity'
    );

    if (!mainActivity) {
      console.warn('MainActivity not found in AndroidManifest');
      return config;
    }

    // Ensure intent-filter array exists
    if (!mainActivity['intent-filter']) {
      mainActivity['intent-filter'] = [];
    }

    // Check if the reverse client ID intent filter already exists
    const reverseClientIdScheme = 'com.googleusercontent.apps.973669949194-claasjhgvpu9v9ops7iesps06t57f203';
    const existingFilter = mainActivity['intent-filter'].find((filter) => {
      const data = filter.data;
      if (!data || !Array.isArray(data)) return false;
      return data.some((d) => d.$['android:scheme'] === reverseClientIdScheme);
    });

    // Add intent filter if it doesn't exist
    if (!existingFilter) {
      mainActivity['intent-filter'].push({
        action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
        category: [
          { $: { 'android:name': 'android.intent.category.DEFAULT' } },
          { $: { 'android:name': 'android.intent.category.BROWSABLE' } },
        ],
        data: [
          {
            $: {
              'android:scheme': reverseClientIdScheme,
            },
          },
        ],
      });
      console.log('✅ Added reverse client ID intent filter to AndroidManifest');
    } else {
      console.log('✅ Reverse client ID intent filter already exists in AndroidManifest');
    }

    return config;
  });
};

