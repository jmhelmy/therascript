const fs = require('fs-extra');
const path = require('path');

async function copyStaticAssets() {
  const sourceDir = path.join(__dirname, '..', '.next', 'static');
  const targetDir = path.join(__dirname, 'standalone', '.next', 'static');
  const routesManifestSource = path.join(__dirname, '..', '.next', 'routes-manifest.json');
  const routesManifestTarget = path.join(__dirname, 'standalone', 'routes-manifest.json');

  try {
    // Ensure the target directory exists
    await fs.ensureDir(targetDir);
    
    // Copy static assets
    await fs.copy(sourceDir, targetDir, {
      overwrite: true,
      errorOnExist: false
    });

    // Copy routes-manifest.json
    if (await fs.pathExists(routesManifestSource)) {
      await fs.copy(routesManifestSource, routesManifestTarget, {
        overwrite: true,
        errorOnExist: false
      });
      console.log('✅ routes-manifest.json copied successfully!');
    } else {
      console.warn('⚠️ routes-manifest.json not found in source directory');
    }
    
    console.log('✅ Static assets copied successfully!');
  } catch (error) {
    console.error('❌ Error copying files:', error);
    process.exit(1);
  }
}

copyStaticAssets(); 