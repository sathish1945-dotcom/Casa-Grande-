import React from 'react';
import {
  SlidersHorizontal,
  X,
  Search,
  Building,
  Check,
  RotateCcw,
} from 'lucide-react';
import { City, PropertyType, ProjectStatus, PropertyFilterParams } from '../lib/types';
import { formatIndianCurrency } from '../lib/calculator';

interface ProjectFilterProps {
  filters: PropertyFilterParams;
  onFilterChange: (newFilters: Partial<PropertyFilterParams>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  const cities: (City | 'All')[] = ['All', 'Chennai', 'Coimbatore', 'Bengaluru'];
  const bhkOptions: (number | 'All')[] = ['All', 2, 3, 4, 5];
  const statuses: (ProjectStatus | 'All')[] = ['All', 'Ready to Move', 'Under Construction', 'New Launch'];
  const types: (PropertyType | 'All')[] = ['All', 'Sky Villa', 'Apartment', 'Penthouse', 'Row Villa'];

  // Calculate active filter count
  const activeCount = [
    filters.city && filters.city !== 'All',
    filters.bhk && filters.bhk !== 'All',
    filters.status && filters.status !== 'All',
    filters.propertyType && filters.propertyType !== 'All',
    Boolean(filters.maxBudget && filters.maxBudget > 0),
    Boolean(filters.searchQuery && filters.searchQuery.trim() !== ''),
  ].filter(Boolean).length;

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E2D7] rounded-sm p-5 shadow-sm mb-8">
      {/* Top Header: Search input & Sorting */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-[#F0EBE1]">
        
        {/* Search query input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8C7A63] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, locality (e.g. ECR, OMR), or amenity..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full bg-[#FAF8F5] border border-[#DDD6C8] rounded pl-9 pr-8 py-2 text-xs text-[#161D1A] placeholder:text-[#8C9690] focus:outline-none focus:border-[#C5A880]"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              aria-label="Clear search input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right side: Sort Selector & Reset button */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="flex items-center gap-2">
            <label htmlFor="filter-sort-select" className="text-xs text-[#636F69] whitespace-nowrap">Sort By:</label>
            <select
              id="filter-sort-select"
              aria-label="Sort residences by"
              value={filters.sortBy || 'featured'}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as PropertyFilterParams['sortBy'] })}
              className="bg-[#FAF8F5] border border-[#DDD6C8] rounded px-3 py-1.5 text-xs text-[#161D1A] focus:outline-none focus:border-[#C5A880]"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="possession">Possession Date (Ready First)</option>
            </select>
          </div>

          {activeCount > 0 && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-[#8C3A3A] hover:text-[#B22222] px-2 py-1.5 rounded hover:bg-[#FDF2F2] transition-colors"
              title="Reset all search filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Row 1: City Tabs & BHK Pills */}
      <div className="py-4 border-b border-[#F0EBE1] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* City Filter Tabs */}
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A8680] block mb-2">
            Location
          </span>
          <div className="flex flex-wrap gap-1.5">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => onFilterChange({ city })}
                className={`px-3 py-1.5 rounded text-xs transition-all ${
                  (filters.city || 'All') === city
                    ? 'bg-[#0D2818] text-[#FAF8F5] font-semibold shadow-sm'
                    : 'bg-[#FAF8F5] text-[#47524C] hover:bg-[#F2ECE1] border border-[#E5DFD3]'
                }`}
              >
                {city === 'All' ? 'All Locations' : city}
              </button>
            ))}
          </div>
        </div>

        {/* BHK Configuration Filter */}
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A8680] block mb-2">
            Bedrooms (BHK)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {bhkOptions.map((bhk) => (
              <button
                key={String(bhk)}
                onClick={() => onFilterChange({ bhk })}
                className={`px-3 py-1.5 rounded text-xs transition-all ${
                  (filters.bhk || 'All') === bhk
                    ? 'bg-[#C5A880] text-[#0D2818] font-bold shadow-sm'
                    : 'bg-[#FAF8F5] text-[#47524C] hover:bg-[#F2ECE1] border border-[#E5DFD3]'
                }`}
              >
                {bhk === 'All' ? 'Any BHK' : `${bhk} BHK`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Controls Row 2: Status & Property Typology & Budget */}
      <div className="pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Status */}
        <div className="flex-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A8680] block mb-1.5">
            Construction Stage
          </span>
          <div className="flex flex-wrap gap-1.5">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => onFilterChange({ status })}
                className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                  (filters.status || 'All') === status
                    ? 'bg-[#1A422D] text-[#FAF8F5] border-[#1A422D] font-medium'
                    : 'bg-[#FFFFFF] text-[#55615B] border-[#DDD6C8] hover:bg-[#FAF8F5]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Property Typology */}
        <div className="flex-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A8680] block mb-1.5">
            Typology
          </span>
          <div className="flex flex-wrap gap-1.5">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => onFilterChange({ propertyType: type })}
                className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                  (filters.propertyType || 'All') === type
                    ? 'bg-[#1A422D] text-[#FAF8F5] border-[#1A422D] font-medium'
                    : 'bg-[#FFFFFF] text-[#55615B] border-[#DDD6C8] hover:bg-[#FAF8F5]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Cap Range Selector */}
        <div className="w-full md:w-56">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A8680]">
              Max Budget
            </span>
            <span className="text-xs font-bold text-[#0D2818]">
              {filters.maxBudget && filters.maxBudget > 0 ? formatIndianCurrency(filters.maxBudget) : 'No Cap'}
            </span>
          </div>
          <input
            type="range"
            min={7500000}
            max={125000000}
            step={2500000}
            value={filters.maxBudget || 125000000}
            onChange={(e) => {
              const val = Number(e.target.value);
              onFilterChange({ maxBudget: val >= 125000000 ? 0 : val });
            }}
            className="w-full accent-[#C5A880] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#8C9690] mt-1">
            <span>₹75L</span>
            <span>₹3.5 Cr</span>
            <span>₹12.5 Cr</span>
          </div>
        </div>
      </div>

      {/* Active Filter Badges Ribbon */}
      <div className="mt-4 pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#636F69]">Verified Portfolio:</span>
          <span className="font-bold text-[#0D2818] bg-[#F2ECE1] px-2 py-0.5 rounded text-xs">
            {totalResults} {totalResults === 1 ? 'Residence' : 'Residences'} Available
          </span>
        </div>
        {activeCount > 0 && (
          <span className="text-xs text-[#8C7A63]">
            {activeCount} active {activeCount === 1 ? 'filter' : 'filters'} applied
          </span>
        )}
      </div>
    </div>
  );
};
