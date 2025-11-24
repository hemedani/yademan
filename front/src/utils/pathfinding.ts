/**
 * Utility functions for pathfinding between multiple locations
 */

// Calculate the distance between two points using Haversine formula
export const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
  const [lon1, lat1] = point1;
  const [lon2, lat2] = point2;

  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Nearest neighbor algorithm to solve the traveling salesman problem
export const findShortestPath = (
  startLocation: [number, number],
  places: { coordinates: [number, number]; name: string; id: string }[]
): { path: { coordinates: [number, number]; name: string; id: string }[]; totalDistance: number } => {
  if (places.length === 0) {
    return { path: [], totalDistance: 0 };
  }

  // Create an array of places with additional info
  const placesWithInfo = places.map((place, index) => ({
    ...place,
    index
  }));

  // Initialize variables
  const visited = new Set<number>();
  const path: { coordinates: [number, number]; name: string; id: string }[] = [];
  let currentLocation = startLocation;
  let totalDistance = 0;

  // Start with the starting location
  const firstPlace = findClosestPlace(currentLocation, placesWithInfo, visited);
  if (firstPlace) {
    path.push({ coordinates: firstPlace.coordinates, name: firstPlace.name, id: firstPlace.id });
    visited.add(firstPlace.index);
    currentLocation = firstPlace.coordinates;
    totalDistance += calculateDistance(startLocation, currentLocation);
  }

  // Visit all other places by finding the closest unvisited place
  while (visited.size < places.length) {
    const nextPlace = findClosestPlace(currentLocation, placesWithInfo, visited);
    if (nextPlace) {
      path.push({ coordinates: nextPlace.coordinates, name: nextPlace.name, id: nextPlace.id });
      visited.add(nextPlace.index);
      totalDistance += calculateDistance(currentLocation, nextPlace.coordinates);
      currentLocation = nextPlace.coordinates;
    } else {
      break; // Should not happen in normal cases
    }
  }

  return { path, totalDistance };
};

// Helper function to find the closest unvisited place
const findClosestPlace = (
  currentLocation: [number, number],
  places: { coordinates: [number, number]; name: string; id: string; index: number }[],
  visited: Set<number>
): { coordinates: [number, number]; name: string; id: string; index: number } | null => {
  let closestPlace: { coordinates: [number, number]; name: string; id: string; index: number } | null = null;
  let minDistance = Infinity;

  for (const place of places) {
    if (!visited.has(place.index)) {
      const distance = calculateDistance(currentLocation, place.coordinates);
      if (distance < minDistance) {
        minDistance = distance;
        closestPlace = place;
      }
    }
  }

  return closestPlace;
};

// Alternative algorithm using a more sophisticated approach
export const findOptimalPathWithOpenStreetMap = async (
  startLocation: [number, number],
  places: { coordinates: [number, number]; name: string; id: string }[]
): Promise<{ path: { coordinates: [number, number]; name: string; id: string }[]; totalDistance: number; routeGeometry: [number, number][] }> => {
  // For now, use the nearest neighbor algorithm
  // In the future, this could be implemented using a routing service API
  const { path, totalDistance } = findShortestPath(startLocation, places);

  // Generate a simple line geometry for the path
  const routeGeometry: [number, number][] = [startLocation];
  for (const place of path) {
    routeGeometry.push(place.coordinates);
  }

  return { path, totalDistance, routeGeometry };
};
