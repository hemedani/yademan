/**
 * TypeScript types for Iranian administrative boundaries GeoJSON data
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

// Iranian administrative boundary specific types
export interface IranAdminBoundaryProperties {
	adm1_name: string; // Province name in English
	adm1_name1: string; // Province name in Persian/Farsi
	adm1_name2: string | null; // Province name in additional language (if available)
	adm1_name3: string | null; // Province name in additional language (if available)
	adm1_pcode: string; // Province code (e.g. "IR001")
	adm0_name: string; // Country name in English
	adm0_name1: string; // Country name in Persian/Farsi
	adm0_name2: string | null; // Country name in additional language (if available)
	adm0_name3: string | null; // Country name in additional language (if available)
	adm0_pcode: string; // Country code (e.g. "IR")
	valid_on: string; // Date when the boundary became valid (ISO format)
	valid_to: string | null; // Date when the boundary became invalid (ISO format) or null if still valid
	area_sqkm: number; // Area in square kilometers
	cod_version: string; // Common Operational Database version
	lang: string; // Language code for adm1_name
	lang1: string; // Language code for adm1_name1
	lang2: string | null; // Language code for adm1_name2
	lang3: string | null; // Language code for adm1_name3
	adm1_ref_name: string; // Reference name for the province
	center_lat: number; // Latitude of the province's centroid
	center_lon: number; // Longitude of the province's centroid
}

export interface IranAdminBoundaryFeature
	extends Feature<IranAdminBoundaryProperties, GeometryObject> {}

export interface IranAdminBoundaryFeatureCollection
	extends FeatureCollection<IranAdminBoundaryProperties, GeometryObject> {
	type: "FeatureCollection";
	name: "irn_admin1";
	crs: CrsObject;
	features: IranAdminBoundaryFeature[];
}

// Helper type for the specific geometry used in this dataset
export type IranProvinceGeometry =
	| { type: "Polygon"; coordinates: PolygonCoordinates }
	| { type: "MultiPolygon"; coordinates: MultiPolygonCoordinates };
