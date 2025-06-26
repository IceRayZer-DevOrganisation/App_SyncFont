import { Font, Collection, FontStats } from '../types';
import { mockFonts } from '../data/mockFonts';

class FontService {
  private readonly STORAGE_KEYS = {
    FONTS: 'fonts',
    COLLECTIONS: 'collections',
    LAST_SCAN: 'lastScan'
  };

  async scanFonts(): Promise<Font[]> {
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real Electron app, this would use font-scanner or font-manager
    // For now, we'll return mock data and store in localStorage
    const fonts = mockFonts;
    localStorage.setItem(this.STORAGE_KEYS.FONTS, JSON.stringify(fonts));
    localStorage.setItem(this.STORAGE_KEYS.LAST_SCAN, new Date().toISOString());
    
    return fonts;
  }

  getFonts(): Font[] {
    const stored = localStorage.getItem(this.STORAGE_KEYS.FONTS);
    return stored ? JSON.parse(stored) : [];
  }

  getFont(id: string): Font | undefined {
    const fonts = this.getFonts();
    return fonts.find(font => font.id === id);
  }

  searchFonts(query: string, filters: {
    category?: string;
    license?: string;
    format?: string;
  } = {}): Font[] {
    let fonts = this.getFonts();

    if (query) {
      fonts = fonts.filter(font => 
        font.name.toLowerCase().includes(query.toLowerCase()) ||
        font.family.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filters.category) {
      fonts = fonts.filter(font => font.category === filters.category);
    }

    if (filters.license) {
      fonts = fonts.filter(font => font.license === filters.license);
    }

    if (filters.format) {
      fonts = fonts.filter(font => font.format === filters.format);
    }

    return fonts;
  }

  getFontStats(): FontStats {
    const fonts = this.getFonts();
    const total = fonts.length;
    
    const byCategory = fonts.reduce((acc, font) => {
      acc[font.category] = (acc[font.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byLicense = fonts.reduce((acc, font) => {
      acc[font.license] = (acc[font.license] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentlyAdded = fonts.filter(font => 
      new Date(font.dateInstalled) > thirtyDaysAgo
    ).length;

    return {
      total,
      byCategory,
      byLicense,
      recentlyAdded
    };
  }

  getCollections(): Collection[] {
    const stored = localStorage.getItem(this.STORAGE_KEYS.COLLECTIONS);
    return stored ? JSON.parse(stored) : [];
  }

  createCollection(name: string, description: string): Collection {
    const collections = this.getCollections();
    const newCollection: Collection = {
      id: Date.now().toString(),
      name,
      description,
      fontIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: this.getRandomColor()
    };

    collections.push(newCollection);
    localStorage.setItem(this.STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
    
    return newCollection;
  }

  updateCollection(id: string, updates: Partial<Collection>): Collection | null {
    const collections = this.getCollections();
    const index = collections.findIndex(c => c.id === id);
    
    if (index === -1) return null;

    collections[index] = {
      ...collections[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(this.STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
    return collections[index];
  }

  deleteCollection(id: string): boolean {
    const collections = this.getCollections();
    const filtered = collections.filter(c => c.id !== id);
    
    if (filtered.length === collections.length) return false;

    localStorage.setItem(this.STORAGE_KEYS.COLLECTIONS, JSON.stringify(filtered));
    return true;
  }

  addFontToCollection(collectionId: string, fontId: string): boolean {
    const collection = this.getCollections().find(c => c.id === collectionId);
    if (!collection || collection.fontIds.includes(fontId)) return false;

    return !!this.updateCollection(collectionId, {
      fontIds: [...collection.fontIds, fontId]
    });
  }

  removeFontFromCollection(collectionId: string, fontId: string): boolean {
    const collection = this.getCollections().find(c => c.id === collectionId);
    if (!collection) return false;

    return !!this.updateCollection(collectionId, {
      fontIds: collection.fontIds.filter(id => id !== fontId)
    });
  }

  exportCollection(collectionId: string, format: 'csv' | 'json'): string {
    const collection = this.getCollections().find(c => c.id === collectionId);
    if (!collection) throw new Error('Collection not found');

    const fonts = this.getFonts().filter(font => collection.fontIds.includes(font.id));

    if (format === 'json') {
      return JSON.stringify({
        collection: {
          name: collection.name,
          description: collection.description,
          createdAt: collection.createdAt
        },
        fonts
      }, null, 2);
    }

    // CSV format
    const headers = 'Name,Family,Style,Weight,Format,License,Category,Date Installed,Path';
    const rows = fonts.map(font => 
      `"${font.name}","${font.family}","${font.style}",${font.weight},"${font.format}","${font.license}","${font.category}","${font.dateInstalled}","${font.path}"`
    );
    
    return [headers, ...rows].join('\n');
  }

  private getRandomColor(): string {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
      '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getLastScanDate(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.LAST_SCAN);
  }
}

export const fontService = new FontService();