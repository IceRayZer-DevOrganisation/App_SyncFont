export interface Device {
  id: string;
  userId: string;
  name: string;
  type: 'desktop' | 'mobile' | 'web';
  lastSync?: string;
}

export interface Font {
  id: string;
  userId: string;
  deviceId: string;
  name: string;
  family: string;
  style: string;
  weight: number;
  format: 'TTF' | 'OTF' | 'WOFF' | 'WOFF2';
  size: number;
  dateInstalled: string;
  path: string;
  license: 'free' | 'commercial' | 'unknown';
  category: 'serif' | 'sans-serif' | 'monospace' | 'script' | 'display';
  previewText?: string;
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  description: string;
  fontIds: string[];
  createdAt: string;
  updatedAt: string;
  color: string;
}

export interface FontStats {
  total: number;
  byCategory: Record<string, number>;
  byLicense: Record<string, number>;
  recentlyAdded: number;
}