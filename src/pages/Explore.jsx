import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDestinations, setSearchQuery, loadMore } from '@/store/destinationSlice';
import DestinationGrid from '@/components/destination/DestinationGrid';
import FilterPanel from '@/components/destination/FilterPanel';
import MapView from '@/components/map/MapView';
import Loader from '@/components/common/Loader';
import { Search, Map, List } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export default function Explore() {
  const dispatch = useDispatch();
  const { list, filters, searchQuery, loading, hasMore } = useSelector((state) => state.destinations);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  // Infinite scroll
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    document.title = 'Explore India | YatrAI';
    dispatch(fetchDestinations());
  }, [dispatch]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      // Simulate loading more data
      dispatch(loadMore());
    }
  }, [inView, hasMore, loading, dispatch]);

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  // Local filtering based on Redux state
  const filteredList = list.filter((dest) => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filters.category.length === 0 || 
                            filters.category.includes(dest.category) ||
                            (dest.tags && filters.category.some(cat => dest.tags.includes(cat)));

    const matchesCrowd = !filters.crowdLevel || dest.crowdLevel === filters.crowdLevel;

    // Add budget filtering logic if needed

    return matchesSearch && matchesCategory && matchesCrowd;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-text mb-2">Explore Incredible India</h1>
          <p className="text-muted">Discover hidden gems, vibrant cultures, and untamed nature.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search places, states..."
              className="w-full bg-surface border border-border rounded-chip py-2.5 pl-10 pr-4 text-sm text-text focus:outline-none focus:border-primary"
            />
            <Search className="absolute left-3 top-2.5 text-muted" size={18} />
          </div>
          
          <div className="flex bg-surface border border-border rounded-chip p-1 shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-primary text-bg' : 'text-muted hover:text-text'}`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-full transition-colors ${viewMode === 'map' ? 'bg-primary text-bg' : 'text-muted hover:text-text'}`}
            >
              <Map size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 z-10">
          <FilterPanel />
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full min-h-[600px]">
          {loading && filteredList.length === 0 ? (
           <div className="py-20 text-center text-muted">Loading destinations...</div>
          ) : viewMode === 'map' ? (
            <div className="sticky top-24">
              <MapView destinations={filteredList} height="calc(100vh - 160px)" />
            </div>
          ) : (
            <>
              <DestinationGrid destinations={filteredList} />
              
              {/* Infinite Scroll trigger */}
              {hasMore && (
                <div ref={ref} className="py-8 text-center text-muted text-sm">
                  {loading ? 'Processing more...' : 'Scroll for more'}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
