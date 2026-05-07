const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, 'packages');
const packages = fs.readdirSync(packagesDir);

const bumps = {
  'input': '1.1.0',
  'notify': '2.1.0',
  'axios': '2.0.1',
  'modal': '2.0.2',
  'store': '2.0.1',
  'chart': '1.0.1',
  'confirm': '2.0.1',
  'dashboard': '2.0.1',
  'form': '2.0.1',
  'map': '1.0.1',
  'route': '2.0.1',
  'table': '2.0.1',
  'ui': '1.0.1'
};

packages.forEach(pkg => {
  const pkgPath = path.join(packagesDir, pkg, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const content = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (bumps[pkg]) {
      console.log(`Bumping ${pkg}: ${content.version} -> ${bumps[pkg]}`);
      content.version = bumps[pkg];
      fs.writeFileSync(pkgPath, JSON.stringify(content, null, 2) + '\n');
    }
  }
});
