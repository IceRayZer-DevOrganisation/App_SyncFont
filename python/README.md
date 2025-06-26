# Module Python - App_SyncFont

Ce module Python gère le scan des polices système et la synchronisation avec Supabase.

## Installation

### 1. Installer Python

**Windows :**
- Via Microsoft Store : Recherchez "Python" et installez la version 3.11 ou 3.12
- Ou téléchargez depuis [python.org](https://www.python.org/downloads/)

**Vérification :**
```bash
python --version
# ou
python3 --version
```

### 2. Créer un environnement virtuel (recommandé)

```bash
# Dans le dossier python/
python -m venv venv

# Activer l'environnement
# Windows :
venv\Scripts\activate
# macOS/Linux :
source venv/bin/activate
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

## Utilisation

### Scanner les polices système

```bash
python font_scanner.py
```

Cela va :
- Scanner tous les répertoires de polices système
- Extraire les métadonnées (nom, famille, style, etc.)
- Sauvegarder les résultats dans `scanned_fonts.json`

### Intégration avec Electron

Le scanner peut être appelé depuis l'application Electron pour :
- Scanner automatiquement les polices système
- Synchroniser avec Supabase
- Mettre à jour l'interface utilisateur

## Structure des fichiers

```
python/
├── requirements.txt      # Dépendances Python
├── font_scanner.py      # Scanner principal
├── README.md           # Ce fichier
└── venv/               # Environnement virtuel (créé automatiquement)
```

## Configuration

Pour utiliser la synchronisation Supabase, configurez les variables d'environnement :

```bash
# Dans un fichier .env ou via les variables système
SUPABASE_URL=votre_url_supabase
SUPABASE_KEY=votre_clé_supabase
```

## Fonctionnalités

- **Scan multi-plateforme** : Windows, macOS, Linux
- **Extraction de métadonnées** : nom, famille, style, poids, etc.
- **Catégorisation automatique** : serif, sans-serif, script, etc.
- **Synchronisation Supabase** : upload des polices scannées
- **Gestion d'erreurs** : robuste face aux polices corrompues

## Dépendances principales

- `fonttools` : Analyse des fichiers de polices
- `Pillow` : Traitement d'images (prévisualisation)
- `requests` : Communication avec Supabase
- `flask` : API locale pour Electron (futur) 