const fs = require('fs');
const path = require('path');

/**
 * sync-versions.js
 * Synchronizes the root @alisdev/fe-kit dependencies with individual package versions.
 */

const rootPath = path.resolve(__dirname, '../package.json');
const packagesDir = path.resolve(__dirname, '../packages');

function sync() {
  const rootPkg = JSON.parse(fs.readFileSync(rootPath, 'utf8'));
  const packages = fs.readdirSync(packagesDir);
  
  let updatedCount = 0;
  console.log('--- Syncing Package Versions ---');

  packages.forEach(pkgName => {
    const pkgPath = path.join(packagesDir, pkgName, 'package.json');
    if (!fs.existsSync(pkgPath)) return;

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const name = pkg.name;
    const version = pkg.version;

    if (rootPkg.dependencies && rootPkg.dependencies[name]) {
      const oldVersion = rootPkg.dependencies[name];
      const newVersion = `workspace:^${version}`;
      
      if (oldVersion !== newVersion) {
        rootPkg.dependencies[name] = newVersion;
        console.log(`✓ Updated ${name}: ${oldVersion} → ${newVersion}`);
        updatedCount++;
      }
    }
  });

  if (updatedCount > 0) {
    fs.writeFileSync(rootPath, JSON.stringify(rootPkg, null, 2) + '\n');
    console.log(`\nSuccess! ${updatedCount} versions synchronized in root package.json.`);
  } else {
    console.log('\nAll versions are already synchronized.');
  }
}

sync();
