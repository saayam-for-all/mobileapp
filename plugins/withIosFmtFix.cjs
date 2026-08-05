/**
 * withIosFmtFix.cjs
 *
 * Newer Xcode/Clang (consteval detected via __cpp_consteval) breaks the
 * `fmt` pod (pulled in transitively by react-native 0.76.x) at compile time:
 *   "call to consteval function ... is not a constant expression"
 *
 * fmt/include/fmt/base.h decides FMT_USE_CONSTEVAL itself via an
 * unconditional #define chain (no #ifndef guard), so passing
 * -DFMT_USE_CONSTEVAL=0 as a compiler flag is silently overridden by that
 * header. The only reliable fix is to patch the header's `#define
 * FMT_USE_CONSTEVAL 1` lines to 0 directly after CocoaPods extracts the
 * pod source, which is done here in the generated Podfile's post_install
 * hook (expo-build-properties has no option for this).
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const ANCHOR = 'react_native_post_install(';
const FIX = `
    fmt_header = File.join(installer.sandbox.pod_dir('fmt').to_s, 'include', 'fmt', 'base.h')
    if File.exist?(fmt_header)
      contents = File.read(fmt_header)
      patched = contents.gsub(/#\\s*define FMT_USE_CONSTEVAL 1/, '#define FMT_USE_CONSTEVAL 0')
      File.write(fmt_header, patched) if patched != contents
    end
`;

module.exports = (config) => withDangerousMod(config, [
  'ios',
  (config) => {
    const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
    let contents = fs.readFileSync(podfilePath, 'utf8');

    if (!contents.includes('FMT_USE_CONSTEVAL')) {
      const anchorIndex = contents.indexOf(ANCHOR);
      const closeIndex = contents.indexOf(')', anchorIndex) + 1;
      const insertAt = contents.indexOf('\n', closeIndex) + 1;
      contents = contents.slice(0, insertAt) + FIX + contents.slice(insertAt);
      fs.writeFileSync(podfilePath, contents);
    }

    return config;
  },
]);
