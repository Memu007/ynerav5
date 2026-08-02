# Publicar en Railway

La web es estática y no necesita compilación, servidor propio ni variables de entorno. Railway ofrece despliegue estático automático desde GitHub.

1. En Railway, elegir **New Project → Deploy from GitHub repo**.
2. Seleccionar `Memu007/ynerav5` y la rama `main`.
3. Railway detectará y publicará los archivos estáticos sin configuración adicional.
4. Generar un dominio desde **Settings → Networking** o conectar el dominio definitivo.
5. Antes de conectar otro dominio, reemplazar `https://ynera.com/` en `index.html`, `robots.txt` y `sitemap.xml` si no será la URL pública real.

No agregar un servidor Node, Python o Docker mientras Railway mantenga el hosting estático: sumaría dependencias y consumo sin aportar funcionalidad.
