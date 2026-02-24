import iranGeoJSON from "./Iran-simplified.json";

// Re-export the first (and only) feature from the GeoJSON FeatureCollection
// The geometry is a MultiPolygon covering Iran's mainland and its islands
const iranBorderGeoJSON = iranGeoJSON.features[0] as GeoJSON.Feature<GeoJSON.MultiPolygon>;

export default iranBorderGeoJSON;
