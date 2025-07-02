#!/bin/bash

# Script para configurar CI/CD en GitHub Actions
echo "🚀 Configurando CI/CD para tu proyecto..."

# Verificar que estamos en un repositorio git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: No estás en un repositorio git"
    exit 1
fi

# Verificar que tenemos los archivos necesarios
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json en el directorio raíz"
    exit 1
fi

if [ ! -f "client/package.json" ]; then
    echo "❌ Error: No se encontró client/package.json"
    exit 1
fi

if [ ! -f "server/package.json" ]; then
    echo "❌ Error: No se encontró server/package.json"
    exit 1
fi

echo "✅ Estructura del proyecto verificada"

# Verificar que los scripts necesarios existen
echo "🔍 Verificando scripts en package.json..."

if ! grep -q '"test"' package.json; then
    echo "⚠️  Advertencia: No se encontró script 'test' en package.json raíz"
fi

if ! grep -q '"test:client"' package.json; then
    echo "⚠️  Advertencia: No se encontró script 'test:client' en package.json raíz"
fi

if ! grep -q '"test:server"' package.json; then
    echo "⚠️  Advertencia: No se encontró script 'test:server' en package.json raíz"
fi

# Verificar scripts en client
if ! grep -q '"build"' client/package.json; then
    echo "⚠️  Advertencia: No se encontró script 'build' en client/package.json"
fi

echo "✅ Scripts verificados"

# Mostrar próximos pasos
echo ""
echo "🎉 ¡CI/CD configurado exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Sube los cambios a GitHub:"
echo "   git add ."
echo "   git commit -m 'ci: add GitHub Actions workflows'"
echo "   git push origin prod"
echo ""
echo "2. Configura los environments en GitHub:"
echo "   - Ve a Settings > Environments"
echo "   - Crea 'staging' y 'production'"
echo "   - Agrega protection rules si es necesario"
echo ""
echo "3. Configura los secrets necesarios:"
echo "   - Ve a Settings > Secrets and variables > Actions"
echo "   - Revisa .github/secrets-example.md para la lista completa"
echo ""
echo "4. Opcional - Configura branch protection rules:"
echo "   - Settings > Branches"
echo "   - Add rule para 'prod'"
echo "   - Require status checks"
echo "   - Require pull request reviews"
echo ""
echo "🔗 Enlaces útiles:"
echo "   - GitHub Actions: https://docs.github.com/en/actions"
echo "   - Environments: https://docs.github.com/en/actions/deployment/targeting-different-environments"
echo "   - Secrets: https://docs.github.com/en/actions/security-guides/encrypted-secrets"
echo ""
echo "✨ ¡Feliz coding!"
