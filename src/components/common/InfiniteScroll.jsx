// src/components/common/InfiniteScroll.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '../Icon';
import { Icons } from '../Icons';

export default function InfiniteScroll({ 
  items, 
  renderItem, 
  itemsPerPage = 12,
  loadingComponent,
  hasMore: externalHasMore,
  onLoadMore,
  darkMode 
}) {
  const [displayedItems, setDisplayedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const loadMoreItems = useCallback(() => {
    if (loading) return;
    if (!hasMore) return;
    if (externalHasMore !== undefined && !externalHasMore) return;

    setLoading(true);
    
    // Simulate async load or call parent's onLoadMore
    setTimeout(() => {
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const newItems = items.slice(0, end);
      
      setDisplayedItems(newItems);
      
      if (newItems.length >= items.length) {
        setHasMore(false);
      }
      
      setPage(prev => prev + 1);
      setLoading(false);
      
      if (onLoadMore) {
        onLoadMore(page);
      }
    }, 500);
  }, [page, items, itemsPerPage, loading, hasMore, onLoadMore, externalHasMore]);

  // Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loadMoreItems, hasMore, loading]);

  // Reset when items change
  useEffect(() => {
    setDisplayedItems(items.slice(0, itemsPerPage));
    setPage(2);
    setHasMore(items.length > itemsPerPage);
  }, [items, itemsPerPage]);

  return (
    <div className="space-y-4">
      {/* Render items */}
      <div className="space-y-2">
        {displayedItems.map((item, index) => renderItem(item, index))}
      </div>

      {/* Loading indicator and trigger */}
      <div ref={loaderRef} className="flex justify-center py-4">
        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Loading more signals...
            </span>
          </div>
        )}
        
        {!hasMore && displayedItems.length > 0 && (
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            You've reached the end! ({displayedItems.length} signals loaded)
          </p>
        )}
        
        {loadingComponent && loading && loadingComponent}
      </div>
    </div>
  );
}