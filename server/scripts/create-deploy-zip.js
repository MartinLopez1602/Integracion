const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const serverDir = path.join(__dirname, '..');
const tempDir = path.join(__dirname, '../../temp-deploy');
const outputZip = path.join(__dirname, '../../server-deploy.zip');

console.log('📦 Creando ZIP para AWS Elastic Beanstalk...');

try {
  // Limpiar directorio temporal si existe
  if (fs.existsSync(tempDir)) {
    execSync(`rm -rf "${tempDir}"`);
  }
  
  // Crear directorio temporal
  fs.mkdirSync(tempDir, { recursive: true });
  
  // Copiar archivos esenciales a la raíz del temp
  const filesToCopy = [
    'package.json',
    'index.js'
  ];
  
  filesToCopy.forEach(file => {
    const src = path.join(serverDir, file);
    const dest = path.join(tempDir, file);
    if (fs.existsSync(src)) {
      execSync(`cp "${src}" "${dest}"`);
      console.log(`✅ Copiado: ${file}`);
    } else {
      console.log(`⚠️ No encontrado: ${file}`);
    }
  });
  
  // Copiar directorios necesarios
  const dirsToCustom = [
    'config',
    'routes', 
    'images',
    '.ebextensions'
  ];
  
  dirsToCustom.forEach(dir => {
    const src = path.join(serverDir, dir);
    const dest = path.join(tempDir, dir);
    if (fs.existsSync(src)) {
      execSync(`cp -r "${src}" "${dest}"`);
      console.log(`✅ Copiado directorio: ${dir}`);
    } else {
      console.log(`⚠️ No encontrado directorio: ${dir}`);
    }
  });
  
  // Eliminar ZIP anterior si existe
  if (fs.existsSync(outputZip)) {
    fs.unlinkSync(outputZip);
  }
  
  // Crear ZIP desde el directorio temporal
  execSync(`cd "${tempDir}" && zip -r "${outputZip}" . -x "*.DS_Store" "*.log" "node_modules/*"`);
  
  // Limpiar directorio temporal
  execSync(`rm -rf "${tempDir}"`);
  
  console.log('✅ ZIP creado exitosamente!');
  console.log(`📁 Ubicación: ${outputZip}`);
  
  // Mostrar contenido del ZIP
  console.log('🔍 Contenido del ZIP:');
  execSync(`unzip -l "${outputZip}" | head -20`, { stdio: 'inherit' });
  
  // Verificar que los archivos críticos estén incluidos
  console.log('\n🔍 Verificando archivos críticos:');
  try {
    execSync(`unzip -l "${outputZip}" | grep package.json`, { stdio: 'inherit' });
    execSync(`unzip -l "${outputZip}" | grep index.js`, { stdio: 'inherit' });
    execSync(`unzip -l "${outputZip}" | grep .ebextensions`, { stdio: 'inherit' });
  } catch (e) {
    console.log('⚠️ Algunos archivos críticos podrían faltar');
  }
  
} catch (error) {
  console.error('❌ Error al crear ZIP:', error.message);
  process.exit(1);
}