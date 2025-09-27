#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const eslintConfigPath = path.join(__dirname, '..', 'eslint.config.mjs');
const backupPath = eslintConfigPath + '.backup';

try {
  // Check if backup exists
  if (!fs.existsSync(backupPath)) {
    console.log('❌ No backup file found. Nothing to restore.');
    process.exit(1);
  }

  // Restore original config
  fs.copyFileSync(backupPath, eslintConfigPath);
  console.log('✅ Restored original ESLint configuration');

  // Optionally remove backup
  const removeBackup = process.argv.includes('--remove-backup');
  if (removeBackup) {
    fs.unlinkSync(backupPath);
    console.log('🗑️  Removed backup file');
  } else {
    console.log('📁 Backup file preserved at:', backupPath);
    console.log('💡 Run with --remove-backup flag to delete backup');
  }

} catch (error) {
  console.error('❌ Error restoring ESLint config:', error.message);
  process.exit(1);
}
