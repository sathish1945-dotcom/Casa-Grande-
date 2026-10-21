import { Project, PropertyFilterParams } from './types';

/**
 * Filter projects deterministically by city, BHK, budget, status, property type, and query.
 */
export function filterProjects(projects: Project[], filters: PropertyFilterParams): Project[] {
  return projects.filter((project) => {
    // City filter
    if (filters.city && filters.city !== 'All') {
      if (project.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }
    }

    // Locality filter
    if (filters.locality && filters.locality.trim() !== '') {
      if (!project.locality.toLowerCase().includes(filters.locality.toLowerCase().trim())) {
        return false;
      }
    }

    // BHK filter
    if (filters.bhk && filters.bhk !== 'All') {
      const bhkNum = Number(filters.bhk);
      const hasBhk = project.configurations.some((cfg) => cfg.bhk === bhkNum);
      if (!hasBhk) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'All') {
      if (project.status !== filters.status) {
        return false;
      }
    }

    // Property Type filter
    if (filters.propertyType && filters.propertyType !== 'All') {
      if (project.propertyType !== filters.propertyType) {
        return false;
      }
    }

    // Budget range filter
    if (filters.minBudget !== undefined && filters.minBudget > 0) {
      if (project.maxPrice < filters.minBudget) {
        return false;
      }
    }
    if (filters.maxBudget !== undefined && filters.maxBudget > 0) {
      if (project.startingPrice > filters.maxBudget) {
        return false;
      }
    }

    // Search Query (name, locality, amenities, description)
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase().trim();
      const matchName = project.name.toLowerCase().includes(query);
      const matchLocality = project.locality.toLowerCase().includes(query);
      const matchCity = project.city.toLowerCase().includes(query);
      const matchAmenity = project.amenities.some((a) => a.toLowerCase().includes(query));
      const matchType = project.propertyType.toLowerCase().includes(query);
      if (!matchName && !matchLocality && !matchCity && !matchAmenity && !matchType) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sorts filtered projects based on user preference
 */
export function sortProjects(projects: Project[], sortBy: PropertyFilterParams['sortBy'] = 'featured'): Project[] {
  const sorted = [...projects];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.startingPrice - b.startingPrice);
    case 'price-desc':
      return sorted.sort((a, b) => b.startingPrice - a.startingPrice);
    case 'possession':
      // Ready to Move first, then soonest dates
      return sorted.sort((a, b) => {
        if (a.status === 'Ready to Move' && b.status !== 'Ready to Move') return -1;
        if (b.status === 'Ready to Move' && a.status !== 'Ready to Move') return 1;
        return a.possessionDate.localeCompare(b.possessionDate);
      });
    case 'featured':
    default:
      return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
}
