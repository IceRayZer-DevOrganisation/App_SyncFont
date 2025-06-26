#!/usr/bin/env python3
"""
Scanner de polices système pour App_SyncFont
Scanne les polices installées sur le système et les synchronise avec Supabase
"""

import os
import json
import platform
from pathlib import Path
from typing import List, Dict, Any
# import fonttools  # <-- supprimé car inutile
from fonttools.ttLib import TTFont
import requests
from datetime import datetime

class FontScanner:
    def __init__(self, supabase_url: str = None, supabase_key: str = None):
        self.supabase_url = supabase_url
        self.supabase_key = supabase_key
        self.system = platform.system()
        
    def get_system_font_directories(self) -> List[str]:
        """Retourne les répertoires de polices selon le système d'exploitation"""
        if self.system == "Windows":
            return [
                os.path.expanduser("~\\AppData\\Local\\Microsoft\\Windows\\Fonts"),
                "C:\\Windows\\Fonts"
            ]
        elif self.system == "Darwin":  # macOS
            return [
                "/System/Library/Fonts",
                "/Library/Fonts",
                os.path.expanduser("~/Library/Fonts")
            ]
        else:  # Linux
            return [
                "/usr/share/fonts",
                "/usr/local/share/fonts",
                os.path.expanduser("~/.fonts")
            ]
    
    def scan_fonts(self) -> List[Dict[str, Any]]:
        """Scanne toutes les polices système et retourne leurs métadonnées"""
        fonts = []
        font_dirs = self.get_system_font_directories()
        
        for font_dir in font_dirs:
            if os.path.exists(font_dir):
                for root, dirs, files in os.walk(font_dir):
                    for file in files:
                        if file.lower().endswith(('.ttf', '.otf', '.woff', '.woff2')):
                            font_path = os.path.join(root, file)
                            try:
                                font_info = self.extract_font_info(font_path)
                                if font_info:
                                    fonts.append(font_info)
                            except Exception as e:
                                print(f"Erreur lors du scan de {font_path}: {e}")
        
        return fonts
    
    def extract_font_info(self, font_path: str) -> Dict[str, Any]:
        """Extrait les métadonnées d'une police"""
        try:
            font = TTFont(font_path)
            name_table = font['name']
            
            # Extraction des noms de police
            family_name = self.get_font_name(name_table, 1) or self.get_font_name(name_table, 16)
            subfamily_name = self.get_font_name(name_table, 2) or self.get_font_name(name_table, 17)
            
            # Informations de base
            font_info = {
                "name": family_name or os.path.splitext(os.path.basename(font_path))[0],
                "family": family_name,
                "style": subfamily_name or "Regular",
                "path": font_path,
                "filename": os.path.basename(font_path),
                "size": os.path.getsize(font_path),
                "format": os.path.splitext(font_path)[1].lower().replace('.', ''),
                "category": self.determine_category(family_name),
                "scanned_at": datetime.now().isoformat(),
                "source": "system"
            }
            
            # Ajout d'informations supplémentaires si disponibles
            if 'OS/2' in font:
                os2_table = font['OS/2']
                font_info["weight"] = os2_table.usWeightClass
                font_info["width"] = os2_table.usWidthClass
            
            return font_info
            
        except Exception as e:
            print(f"Erreur lors de l'extraction des infos de {font_path}: {e}")
            return None
    
    def get_font_name(self, name_table, name_id: int) -> str:
        """Récupère un nom spécifique de la table des noms"""
        try:
            for record in name_table.names:
                if record.nameID == name_id:
                    return record.toUnicode()
        except:
            pass
        return None
    
    def determine_category(self, family_name: str) -> str:
        """Détermine la catégorie de la police basée sur son nom"""
        if not family_name:
            return "other"
        
        family_lower = family_name.lower()
        
        # Catégories basées sur des mots-clés courants
        if any(word in family_lower for word in ['serif', 'times', 'georgia', 'garamond']):
            return "serif"
        elif any(word in family_lower for word in ['sans', 'arial', 'helvetica', 'futura']):
            return "sans-serif"
        elif any(word in family_lower for word in ['script', 'cursive', 'handwriting']):
            return "script"
        elif any(word in family_lower for word in ['display', 'decorative', 'ornamental']):
            return "display"
        elif any(word in family_lower for word in ['mono', 'courier', 'consolas']):
            return "monospace"
        else:
            return "other"
    
    def sync_to_supabase(self, fonts: List[Dict[str, Any]], user_id: str) -> bool:
        """Synchronise les polices scannées avec Supabase"""
        if not self.supabase_url or not self.supabase_key:
            print("Configuration Supabase manquante")
            return False
        
        headers = {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }
        
        try:
            for font in fonts:
                font_data = {
                    "name": font["name"],
                    "family": font["family"],
                    "style": font["style"],
                    "path": font["path"],
                    "filename": font["filename"],
                    "size": font["size"],
                    "format": font["format"],
                    "category": font["category"],
                    "source": font["source"],
                    "user_id": user_id
                }
                
                response = requests.post(
                    f"{self.supabase_url}/rest/v1/fonts",
                    headers=headers,
                    json=font_data
                )
                
                if response.status_code not in [200, 201]:
                    print(f"Erreur lors de la synchronisation de {font['name']}: {response.text}")
                
        except Exception as e:
            print(f"Erreur lors de la synchronisation: {e}")
            return False
        
        return True

def main():
    """Fonction principale pour tester le scanner"""
    scanner = FontScanner()
    print("Scan des polices système en cours...")
    
    fonts = scanner.scan_fonts()
    print(f"Nombre de polices trouvées: {len(fonts)}")
    
    # Affichage des premières polices trouvées
    for i, font in enumerate(fonts[:5]):
        print(f"{i+1}. {font['name']} ({font['family']}) - {font['category']}")
    
    # Sauvegarde en JSON pour debug
    with open("scanned_fonts.json", "w", encoding="utf-8") as f:
        json.dump(fonts, f, indent=2, ensure_ascii=False)
    
    print(f"Résultats sauvegardés dans scanned_fonts.json")

if __name__ == "__main__":
    main() 