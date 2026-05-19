# Commits para subir AEROTURS a GitHub

Repositorio remoto:

```bash
https://github.com/Vmanu-29/AEROTURS.git
```

Rama usada:

```bash
perf-accessibility-highlight
```

Commit creado para esta version:

```text
2426eb35 chore: prepare Aeroturs project for deployment
```

## Comandos para hacerlo manualmente

Desde la carpeta del proyecto:

```bash
git add .env.example README.md backend/db.js backend/server.js package.json package-lock.json vite.config.ts git-patches
git commit -m "chore: prepare Aeroturs project for deployment"
git push -u origin perf-accessibility-highlight
```

## Si quieres subirlo a main

```bash
git checkout main
git merge perf-accessibility-highlight
git push origin main
```

