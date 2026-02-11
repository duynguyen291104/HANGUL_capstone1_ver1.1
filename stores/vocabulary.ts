'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VocabularyItem } from '../lib/types';
import { VocabDatabase, db } from '../lib/database';
import { generateId } from '../lib/utils';

interface VocabularyStore {
  vocabulary: VocabularyItem[];
  isLoading: boolean;
  searchQuery: string;
  selectedTags: string[];
  
  // Actions
  loadVocabulary: () => Promise<void>;
  addVocabulary: (items: VocabularyItem[]) => Promise<void>;
  updateVocabularyItem: (id: string, updates: Partial<VocabularyItem>) => Promise<void>;
  deleteVocabularyItem: (id: string) => Promise<void>;
  searchVocabulary: (query: string) => void;
  filterByTags: (tags: string[]) => void;
  clearFilters: () => void;
  
  // Getters
  getFilteredVocabulary: () => VocabularyItem[];
  getAllTags: () => string[];
  getVocabularyCount: () => number;
}

export const useVocabularyStore = create<VocabularyStore>((set, get) => ({
  vocabulary: [],
  isLoading: false,
  searchQuery: '',
  selectedTags: [],

  loadVocabulary: async () => {
    set({ isLoading: true });
    console.log('🔄 Loading vocabulary from API...');
    
    try {
      // Load ALL vocabulary from API (no limit)
      const response = await fetch('/api/vocabulary?limit=100000');
      
      if (response.ok) {
        const result = await response.json();
        const vocabulary = result.data || [];
        
        console.log(`✅ Loaded ${vocabulary.length} words from API`);
        
        if (vocabulary.length > 0) {
          const vocabItems = vocabulary.map((item: any) => ({
            id: item.id.toString(),
            ko: item.ko,
            vi: item.vi,
            tags: item.tags || [],
            stt: item.stt,
            addedAt: item.addedAt ? new Date(item.addedAt).getTime() : Date.now(),
            srsLevel: 0,
            nextReview: Date.now(),
            correctStreak: 0,
            totalReviews: 0
          }));
          
          // Clear IndexedDB ONCE and sync fresh data
          try {
            await db.vocabulary.clear();
            await VocabDatabase.addVocabulary(vocabItems);
            console.log('💾 Synced to IndexedDB for offline use');
          } catch (dbError) {
            console.warn('IndexedDB sync failed, but continuing with API data:', dbError);
          }
          
          set({ vocabulary: vocabItems, isLoading: false });
          console.log(`✅ Set ${vocabItems.length} words to store`);
        } else {
          console.warn('⚠️ API returned 0 words');
          set({ vocabulary: [], isLoading: false });
        }
      } else {
        console.error('❌ API request failed:', response.status);
        // Fallback to IndexedDB if API fails
        const vocabulary = await VocabDatabase.getVocabulary();
        console.log(`📦 Loaded ${vocabulary.length} words from IndexedDB (fallback)`);
        set({ vocabulary, isLoading: false });
      }
    } catch (error) {
      console.error('❌ Failed to load vocabulary from API:', error);
      // Fallback to IndexedDB
      try {
        const vocabulary = await VocabDatabase.getVocabulary();
        console.log(`📦 Loaded ${vocabulary.length} words from IndexedDB (error fallback)`);
        set({ vocabulary, isLoading: false });
      } catch (dbError) {
        console.error('❌ IndexedDB fallback also failed:', dbError);
        set({ vocabulary: [], isLoading: false });
      }
    }
  },

  addVocabulary: async (items: VocabularyItem[]) => {
    set({ isLoading: true });
    try {
      // Prepare items for API
      const itemsForAPI = items.map(item => ({
        ko: item.ko,
        vi: item.vi,
        tags: item.tags || [],
        category: item.tags && item.tags.length > 0 ? item.tags[0] : null,
        difficulty: 'BEGINNER',
        stt: item.stt
      }));

      // Save to database via API
      const response = await fetch('/api/vocabulary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemsForAPI),
      });

      if (!response.ok) {
        throw new Error('Failed to save to database');
      }

      const result = await response.json();
      console.log('✅ Saved to database:', result);

      // Also save to IndexedDB for offline support
      const itemsWithIds = items.map(item => ({
        ...item,
        id: item.id || generateId(),
        addedAt: item.addedAt || Date.now()
      }));
      await VocabDatabase.addVocabulary(itemsWithIds);
      
      // Reload from API to get fresh data with DB IDs
      await get().loadVocabulary();
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to add vocabulary:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateVocabularyItem: async (id: string, updates: Partial<VocabularyItem>) => {
    try {
      await VocabDatabase.updateVocabulary(id, updates);
      const { vocabulary } = get();
      set({
        vocabulary: vocabulary.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      });
    } catch (error) {
      console.error('Failed to update vocabulary item:', error);
    }
  },

  deleteVocabularyItem: async (id: string) => {
    try {
      await VocabDatabase.deleteVocabulary(id);
      const { vocabulary } = get();
      set({
        vocabulary: vocabulary.filter(item => item.id !== id)
      });
    } catch (error) {
      console.error('Failed to delete vocabulary item:', error);
    }
  },

  searchVocabulary: (query: string) => {
    set({ searchQuery: query });
  },

  filterByTags: (tags: string[]) => {
    set({ selectedTags: tags });
  },

  clearFilters: () => {
    set({ searchQuery: '', selectedTags: [] });
  },

  getFilteredVocabulary: () => {
    const { vocabulary, searchQuery, selectedTags } = get();
    
    let filtered = vocabulary;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item =>
        item.ko.toLowerCase().includes(query) ||
        item.vi.toLowerCase().includes(query)
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(item =>
        item.tags && item.tags.some(tag => selectedTags.includes(tag))
      );
    }

    return filtered;
  },

  getAllTags: () => {
    const { vocabulary } = get();
    const tagSet = new Set<string>();
    
    vocabulary.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => tagSet.add(tag));
      }
    });
    
    return Array.from(tagSet).sort();
  },

  getVocabularyCount: () => {
    return get().vocabulary.length;
  }
}));