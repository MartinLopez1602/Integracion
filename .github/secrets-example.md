# Ejemplo de configuración de secrets y variables de entorno
# Este archivo es solo informativo - los secrets se configuran en GitHub

# Secrets necesarios para los workflows:

## Para deployment:
# VERCEL_TOKEN - Token de Vercel (si usas Vercel)
# NETLIFY_AUTH_TOKEN - Token de Netlify (si usas Netlify)
# AWS_ACCESS_KEY_ID - Para AWS (si usas AWS)
# AWS_SECRET_ACCESS_KEY - Para AWS (si usas AWS)

## Para SSH deployment:
# HOST - IP o dominio del servidor
# USERNAME - Usuario SSH
# KEY - Clave privada SSH

## Para notificaciones:
# SLACK_WEBHOOK_URL - Webhook de Slack
# DISCORD_WEBHOOK_URL - Webhook de Discord

## Para análisis de seguridad:
# SNYK_TOKEN - Token de Snyk
# CODECOV_TOKEN - Token de Codecov

## Variables de entorno por environment:

### Staging (rama dev)
# REACT_APP_API_URL=https://api-staging.tudominio.com
# NODE_ENV=staging
# DATABASE_URL=postgresql://...

### Production (rama prod)
# REACT_APP_API_URL=https://api.tudominio.com
# NODE_ENV=production
# DATABASE_URL=postgresql://...

## Como configurar los secrets:
# 1. Ve a tu repositorio en GitHub
# 2. Settings > Secrets and variables > Actions
# 3. Agrega los secrets necesarios
# 4. Para environments específicos:
#    - Settings > Environments
#    - Crea 'staging' y 'production'
#    - Agrega secrets específicos por environment
