/**
 * TypeScript types for Iranian second-level administrative boundaries (cities/counties) GeoJSON data
 */

// Base GeoJSON types
export interface Position {
	0: number; // longitude
	1: number; // latitude
	2?: number; // altitude (optional)
}

export interface PointCoordinates extends Position {}

export interface LineStringCoordinates extends Array<Position> {}

export interface PolygonCoordinates extends Array<Array<Position>> {}

export interface MultiPointCoordinates extends Array<Position> {}

export interface MultiLineStringCoordinates extends Array<Array<Position>> {}

export interface MultiPolygonCoordinates
	extends Array<Array<Array<Position>>> {}

export type GeometryObject =
	| { type: "Point"; coordinates: PointCoordinates }
	| { type: "LineString"; coordinates: LineStringCoordinates }
	| { type: "Polygon"; coordinates: PolygonCoordinates }
	| { type: "MultiPoint"; coordinates: MultiPointCoordinates }
	| { type: "MultiLineString"; coordinates: MultiLineStringCoordinates }
	| { type: "MultiPolygon"; coordinates: MultiPolygonCoordinates };

export interface CrsProperties {
	name: string;
}

export interface CrsObject {
	type: "name";
	properties: CrsProperties;
}

export interface Feature<P = Record<string, any>, G = GeometryObject> {
	type: "Feature";
	properties: P;
	geometry: G;
	id?: string | number;
}

export interface FeatureCollection<
	P = Record<string, any>,
	G = GeometryObject,
> {
	type: "FeatureCollection";
	name: string;
	crs?: CrsObject;
	features: Array<Feature<P, G>>;
}

// Iranian second-level administrative boundary specific types
export interface IranAdmin2BoundaryProperties {
	adm2_name: string; // City/County name in English
	adm2_name1: string; // City/County name in Persian/Farsi
	adm2_name2: string | null; // City/County name in additional language (if available)
	adm2_name3: string | null; // City/County name in additional language (if available)
	adm2_pcode: string; // City/County code (e.g. "IR015001")
	adm1_name: string; // Province name in English
	adm1_name1: string; // Province name in Persian/Farsi
	adm1_name2: string | null; // Province name in additional language (if available)
	adm1_name3: string | null; // Province name in additional language (if available)
	adm1_pcode: string; // Province code (e.g. "IR015")
	adm0_name: string; // Country name in English
	adm0_name1: string; // Country name in Persian/Farsi
	adm0_name2: string | null; // Country name in additional language (if available)
	adm0_name3: string | null; // Country name in additional language (if available)
	adm0_pcode: string; // Country code (e.g. "IR")
	valid_on: string; // Date when the boundary became valid (ISO format)
	valid_to: string | null; // Date when the boundary became invalid (ISO format) or null if still valid
	area_sqkm: number; // Area in square kilometers
	cod_version: string; // Common Operational Database version
	lang: string; // Language code for adm2_name
	lang1: string; // Language code for adm2_name1
	lang2: string | null; // Language code for adm2_name2
	lang3: string | null; // Language code for adm2_name3
	adm2_ref_name: string; // Reference name for the city/county
	center_lat: number; // Latitude of the city/county's centroid
	center_lon: number; // Longitude of the city/county's centroid
}

export interface IranAdmin2BoundaryFeature
	extends Feature<IranAdmin2BoundaryProperties, GeometryObject> {}

export interface IranAdmin2BoundaryFeatureCollection
	extends FeatureCollection<IranAdmin2BoundaryProperties, GeometryObject> {
	type: "FeatureCollection";
	name: "irn_admin2";
	crs: CrsObject;
	features: IranAdmin2BoundaryFeature[];
}

// Helper type for the specific geometry used in this dataset
export type IranCityCountyGeometry =
	| { type: "Polygon"; coordinates: PolygonCoordinates }
	| { type: "MultiPolygon"; coordinates: MultiPolygonCoordinates };
