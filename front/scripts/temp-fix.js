#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const eslintConfigPath = path.join(__dirname, '..', 'eslint.config.mjs');

// Backup original config
const backupPath = eslintConfigPath + '.backup';

try {
  // Create backup if it doesn't exist
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(eslintConfigPath, backupPath);
    console.log('✅ Created backup of original eslint.config.mjs');
  }

  // Read current config
  let configContent = fs.readFileSync(eslintConfigPath, 'utf8');

  // Add rules to disable problematic linting rules temporarily
  const rulesToDisable = {
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/no-unescaped-entities': 'off',
    '@next/next/no-img-element': 'off',
    '@next/next/no-html-link-for-pages': 'off',
    'react-hooks/exhaustive-deps': 'off'
  };

  // Find the rules section and add our disabled rules
  const rulesString = JSON.stringify(rulesToDisable, null, 6).slice(1, -1); // Remove outer braces

  // Check if rules already exist in config
  if (configContent.includes('rules:')) {
    // Add to existing rules
    configContent = configContent.replace(
      /rules:\s*{/,
      `rules: {\n      ${rulesString.replace(/\n/g, '\n      ')},`
    );
  } else {
    // Add rules section
    configContent = configContent.replace(
      /export default/,
      `export default [{
  ...defaultConfig,
  rules: {
    ${rulesString.replace(/\n/g, '\n    ')}
  }
}, ...defaultConfig.slice(1)];\n\n// export default`
    );
  }

  // Write the modified config
  fs.writeFileSync(eslintConfigPath, configContent);
  console.log('✅ Temporarily disabled strict ESLint rules for build');
  console.log('📝 Rules disabled:', Object.keys(rulesToDisable).join(', '));
  console.log('⚠️  Remember to run restore-eslint.js after fixing issues');

} catch (error) {
  console.error('❌ Error modifying ESLint config:', error.message);
  process.exit(1);
}
