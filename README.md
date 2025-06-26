# App SyncFont

Application de gestion de polices avec synchronisation cloud via Supabase.

## Structure du projet

```
App_SyncFont/
├── _web/                 # Application web React/Vite
│   ├── src/            # Code source React
│   ├── dist/           # Build de production
│   ├── package.json    # Dépendances web
│   └── ...
├── _electron/           # Application native Electron
│   ├── src/           # Code source Electron
│   ├── package.json   # Dépendances Electron
│   └── ...
├── package.json        # Scripts globaux
└── README.md
```

## Installation

### Prérequis
- Node.js (version 18+)
- Python 3.11+ (pour font-scanner dans Electron)

### Installation de Python
1. Télécharge Python depuis https://www.python.org/downloads/
2. **IMPORTANT** : Coche "Add Python to PATH" pendant l'installation
3. Vérifie avec : `python --version`

### Installation des dépendances
```bash
# Installation globale
npm run install:all

# Ou installation séparée
npm install                    # Dépendances racine
cd _web && npm install         # Dépendances web
cd ../_electron && npm install # Dépendances Electron
```

## Développement

### Web (React)
```bash
npm run web:dev      # Démarre le serveur de développement
npm run web:build    # Build de production
npm run web:preview  # Prévisualise le build
```

### Electron (Application native)
```bash
npm run electron:dev   # Démarre l'app Electron en mode dev
npm run electron:build # Build de l'app native
```

### Développement simultané
```bash
npm run dev  # Lance web + electron en même temps
```

## Fonctionnalités

### Web
- Interface de gestion des polices
- Authentification Supabase
- Collections de polices
- Synchronisation cloud

### Electron
- Scan automatique des polices locales
- Synchronisation avec Supabase
- Interface native pour Windows/Mac/Linux

## Déploiement

### Web
- Déployé sur Vercel
- Variables d'environnement configurées

### Electron
- Builds disponibles pour Windows, Mac, Linux
- Distribution via GitHub Releases 