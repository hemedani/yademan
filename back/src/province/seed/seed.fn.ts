import { type ActFn } from "@deps";
import { city, coreApp, province } from "../../../mod.ts";
import type { MyContext } from "@lib";

import {
	IranAdminBoundaryFeatureCollection,
} from "../../types/IranAdmin1Boundaries.ts";
import {
	IranAdmin2BoundaryFeatureCollection as IranCityBoundaryFeatureCollection,
} from "../../types/IranAdmin2Boundaries.ts";

export const seedFn: ActFn = async (body) => {
	const { user }: MyContext = coreApp.contextFns
		.getContextModel() as MyContext;

	// Read and parse the provinces GeoJSON file
	const provincesDataStr = await Deno.readTextFile(
		"assets/geojson/irn_admin1_simplified_converted.json",
	);
	const provincesData: IranAdminBoundaryFeatureCollection = JSON.parse(
		provincesDataStr,
	);

	// Read and parse the cities GeoJSON file
	const citiesDataStr = await Deno.readTextFile(
		"assets/geojson/irn_admin2_simplified_converted.json",
	);
	const citiesData: IranCityBoundaryFeatureCollection = JSON.parse(
		citiesDataStr,
	);

	// Create provinces first
	const createdProvinces: Record<string, any> = {};

	for (const feature of provincesData.features) {
		const provinceName = feature.properties.adm1_name1 ||
			feature.properties.adm1_name;
		const provinceEnglishName = feature.properties.adm1_name;
		const provinceCode = feature.properties.adm1_pcode;

		const newProvince = await province.insertOne({
			doc: {
				name: provinceName,
				english_name: provinceEnglishName,
				area: feature.geometry,
				center: {
					type: "Point",
					coordinates: [
						feature.properties.center_lon,
						feature.properties.center_lat,
					],
				},
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			relations: {
				registrar: {
					_ids: user._id,
				},
			},
		});

		createdProvinces[provinceCode] = newProvince;
	}

	// Create cities and associate them with their provinces
	for (const feature of citiesData.features) {
		const cityName = feature.properties.adm2_name1 ||
			feature.properties.adm2_name;
		const cityEnglishName = feature.properties.adm2_name;
		const provinceCode = feature.properties.adm1_pcode;

		// Find the corresponding province
		const provinceDoc = createdProvinces[provinceCode];
		if (!provinceDoc) {
			console.warn(
				`Province with code ${provinceCode} not found for city ${cityName}`,
			);
			continue;
		}

		await city.insertOne({
			doc: {
				name: cityName,
				english_name: cityEnglishName,
				area: feature.geometry,
				center: {
					type: "Point",
					coordinates: [
						feature.properties.center_lon,
						feature.properties.center_lat,
					],
				},
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			relations: {
				registrar: {
					_ids: user._id,
				},
				province: {
					_ids: provinceDoc._id,
					relatedRelations: {
						cities: true,
						capital: false,
					},
				},
			},
		});
	}

	return {
		provincesCreated: Object.keys(createdProvinces).length,
		citiesCreated: citiesData.features.length,
	};
};
