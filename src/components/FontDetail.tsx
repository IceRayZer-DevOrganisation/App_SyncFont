import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Download, Shield, Calendar, HardDrive, Type, Edit } from 'lucide-react';
import { Font, Collection } from '../types';
import { getFonts } from '../services/fontService';
import { getCollections, addFontToCollection } from '../services/supabaseService';

const FontDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [font, setFont] = useState<Font | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showAddToCollection, setShowAddToCollection] = useState(false);
  const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog');
  const [previewSize, setPreviewSize] = useState(24);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const fonts = await getFonts();
        const foundFont = fonts.find((f: Font) => f.id === id);
        setFont(foundFont || null);
        const cols = await getCollections();
        setCollections(cols);
      }
    };
    fetchData();
  }, [id]);

  if (!font) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">Font not found</p>
          <button
            onClick={() => navigate('/fonts')}
            className="mt-2 text-blue-600 hover:text-blue-700"
          >
            Back to Font Library
          </button>
        </div>
      </div>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getLicenseColor = (license: string) => {
    switch (license) {
      case 'free': return 'bg-green-100 text-green-800';
      case 'commercial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddToCollection = async (collectionId: string) => {
    if (!font) return;
    await addFontToCollection(collectionId, font.id);
    setShowAddToCollection(false);
    // Show success message or update UI
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/fonts')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{font.name}</h1>
          <p className="text-gray-600">{font.family} • {font.style}</p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddToCollection(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add to Collection</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Font Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preview Text</label>
                  <input
                    type="text"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <input
                    type="range"
                    min="12"
                    max="72"
                    value={previewSize}
                    onChange={(e) => setPreviewSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{previewSize}px</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 min-h-[120px] flex items-center">
                <p
                  className="text-gray-900 break-words w-full"
                  style={{ 
                    fontFamily: font.family,
                    fontSize: `${previewSize}px`,
                    lineHeight: 1.4
                  }}
                >
                  {previewText}
                </p>
              </div>
            </div>
          </div>

          {/* Sample Sizes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Sizes</h3>
            
            <div className="space-y-4">
              {[12, 14, 16, 18, 24, 32, 48].map(size => (
                <div key={size} className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 w-8">{size}px</span>
                  <p
                    className="text-gray-900 flex-1"
                    style={{ 
                      fontFamily: font.family,
                      fontSize: `${size}px`
                    }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Font Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Font Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Type className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Family</p>
                  <p className="font-medium text-gray-900">{font.family}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Edit className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Style & Weight</p>
                  <p className="font-medium text-gray-900">{font.style} • {font.weight}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <HardDrive className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Format & Size</p>
                  <p className="font-medium text-gray-900">{font.format} • {formatFileSize(font.size)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Date Installed</p>
                  <p className="font-medium text-gray-900">
                    {new Date(font.dateInstalled).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">License</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getLicenseColor(font.license)}`}>
                    {font.license.charAt(0).toUpperCase() + font.license.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* File Path */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">File Location</h3>
            <div className="bg-gray-50 rounded-lg p-3">
              <code className="text-sm text-gray-700 break-all">{font.path}</code>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category</h3>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {font.category.charAt(0).toUpperCase() + font.category.slice(1).replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Add to Collection Modal */}
      {showAddToCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add to Collection</h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {collections.length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                  No collections available. Create one first.
                </p>
              ) : (
                collections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => handleAddToCollection(collection.id)}
                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: collection.color }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{collection.name}</p>
                      <p className="text-sm text-gray-600">{collection.fontIds.length} fonts</p>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddToCollection(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FontDetail;