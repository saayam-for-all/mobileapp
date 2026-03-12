/**
 * withAndroidFix.cjs
 *
 * Applies Android build fixes that would normally be handled by
 * expo-build-properties, which appears to not apply correctly in this project.
 *
 * Fixes:
 * 1. enableJetifier — resolves com.android.support vs androidx conflicts
 * 2. jvmArgs — increases JVM memory to 4GB for Android builds
 */
const { withGradleProperties } = require('@expo/config-plugins');

module.exports = (config) => withGradleProperties(config, (config) => {
  const props = config.modResults;

  // Remove existing entries to avoid duplicates
  config.modResults = props.filter(
    (p) => p.key !== 'android.enableJetifier' && p.key !== 'org.gradle.jvmargs'
  );

  config.modResults.push(
    { type: 'property', key: 'android.enableJetifier', value: 'true' },
    { type: 'property', key: 'org.gradle.jvmargs', value: '-Xmx4096m -XX:MaxMetaspaceSize=512m' }
  );

  return config;
});