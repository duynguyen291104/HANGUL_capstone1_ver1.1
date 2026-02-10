'use client';

import React, { useEffect, useState } from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { SearchBar, FilterBar } from '../../components/SearchAndFilter';
import { VocabList } from '../../components/VocabCard';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useVocabularyStore } from '../../stores/vocabulary';

type SortOption = 'stt' | 'korean' | 'vietnamese' | 'date';
type SortDirection = 'asc' | 'desc';

export default function LibraryPage() {
  const {
    vocabulary,
    isLoading,
    loadVocabulary,
    searchQuery,
    selectedTags,
    searchVocabulary,
    filterByTags,
    clearFilters,
    getFilteredVocabulary,
    getAllTags,
    getVocabularyCount
  } = useVocabularyStore();

  const [sortBy, setSortBy] = useState<SortOption>('stt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadVocabulary();
  }, [loadVocabulary]);

  const filteredVocabulary = getFilteredVocabulary();
  const allTags = getAllTags();

  // Sort the filtered vocabulary
  const sortedVocabulary = [...filteredVocabulary].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'stt':
        aValue = a.stt || 999999;
        bValue = b.stt || 999999;
        break;
      case 'korean':
        aValue = a.ko.toLowerCase();
        bValue = b.ko.toLowerCase();
        break;
      case 'vietnamese':
        aValue = a.vi.toLowerCase();
        bValue = b.vi.toLowerCase();
        break;
      case 'date':
        aValue = a.addedAt || 0;
        bValue = b.addedAt || 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };

  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    filterByTags(newSelectedTags);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải từ vựng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Thư viện từ vựng</h1>
          <p className="text-muted-foreground">
            {getVocabularyCount()} từ vựng • {filteredVocabulary.length} kết quả
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Bộ lọc
            {selectedTags.length > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {selectedTags.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={searchVocabulary}
        onClear={clearFilters}
        placeholder="Tìm kiếm từ vựng tiếng Hàn hoặc nghĩa tiếng Việt..."
      />

      {/* Filter Bar */}
      {showFilters && (
        <FilterBar
          availableTags={allTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearFilters={clearFilters}
        />
      )}

      {/* Sort Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            Sắp xếp theo
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={sortBy === 'stt' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('stt')}
              className="flex items-center gap-1"
            >
              STT
              {sortBy === 'stt' && (
                sortDirection === 'asc' ? 
                  <SortAsc className="h-3 w-3" /> : 
                  <SortDesc className="h-3 w-3" />
              )}
            </Button>

            <Button
              variant={sortBy === 'korean' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('korean')}
              className="flex items-center gap-1"
            >
              A-Z (Hàn)
              {sortBy === 'korean' && (
                sortDirection === 'asc' ? 
                  <SortAsc className="h-3 w-3" /> : 
                  <SortDesc className="h-3 w-3" />
              )}
            </Button>

            <Button
              variant={sortBy === 'vietnamese' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('vietnamese')}
              className="flex items-center gap-1"
            >
              A-Z (Việt)
              {sortBy === 'vietnamese' && (
                sortDirection === 'asc' ? 
                  <SortAsc className="h-3 w-3" /> : 
                  <SortDesc className="h-3 w-3" />
              )}
            </Button>

            <Button
              variant={sortBy === 'date' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('date')}
              className="flex items-center gap-1"
            >
              Ngày thêm
              {sortBy === 'date' && (
                sortDirection === 'asc' ? 
                  <SortAsc className="h-3 w-3" /> : 
                  <SortDesc className="h-3 w-3" />
              )}
            </Button>

            {(searchQuery || selectedTags.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {(searchQuery || selectedTags.length > 0) && (
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">
              {filteredVocabulary.length === 0 ? (
                'Không tìm thấy từ vựng nào phù hợp'
              ) : (
                <>
                  Hiển thị {filteredVocabulary.length} trong số {getVocabularyCount()} từ vựng
                  {searchQuery && (
                    <> cho "{searchQuery}"</>
                  )}
                  {selectedTags.length > 0 && (
                    <> với chủ đề: {selectedTags.join(', ')}</>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vocabulary List */}
      <VocabList
        items={sortedVocabulary}
        showRomanization={true}
      />

      {/* Empty State for no vocabulary at all */}
      {getVocabularyCount() === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Chưa có từ vựng nào</h3>
            <p className="text-muted-foreground mb-6">
              Hãy import dữ liệu từ vựng để bắt đầu xây dựng thư viện của bạn
            </p>
            <Button asChild>
              <a href="/import">Import từ vựng ngay</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}