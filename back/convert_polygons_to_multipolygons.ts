// Function to convert a single polygon to multipolygon
function convertPolygonToMultiPolygon(polygon: any) {
	// If it's already a MultiPolygon, return as-is
	if (polygon.type === "MultiPolygon") {
		return polygon;
	}

	// If it's a Polygon, convert it to MultiPolygon
	if (polygon.type === "Polygon") {
		return {
			type: "MultiPolygon",
			coordinates: [polygon.coordinates], // Wrap the coordinates in an additional array
		};
	}

	// If it's not a Polygon or MultiPolygon, return as-is
	return polygon;
}

// Function to process a GeoJSON feature
function processFeature(feature: any) {
	if (feature.geometry) {
		feature.geometry = convertPolygonToMultiPolygon(feature.geometry);
	}
	return feature;
}

async function main() {
	const inputFile = "./assets/geojson/irn_admin1_simplified.json";
	const outputFile = "./assets/geojson/irn_admin1_simplified_converted.json";

	try {
		// Read the input GeoJSON file
		console.log(`Reading ${inputFile}...`);
		const inputText = await Deno.readTextFile(inputFile);
		const geojsonData: any = JSON.parse(inputText);

		// Process each feature in the GeoJSON
		if (geojsonData.features && Array.isArray(geojsonData.features)) {
			console.log(
				`Processing ${geojsonData.features.length} features...`,
			);

			for (let i = 0; i < geojsonData.features.length; i++) {
				geojsonData.features[i] = processFeature(
					geojsonData.features[i],
				);

				// Log progress every 100 features
				if ((i + 1) % 100 === 0) {
					console.log(
						`Processed ${
							i + 1
						}/${geojsonData.features.length} features...`,
					);
				}
			}
		} else {
			console.error("GeoJSON does not contain a features array");
			return;
		}

		// Write the converted GeoJSON to the output file (minified)
		console.log(`Writing converted GeoJSON to ${outputFile}...`);
		await Deno.writeTextFile(
			outputFile,
			JSON.stringify(geojsonData),
		);

		console.log("Conversion completed successfully!");
		console.log(`Output saved to: ${outputFile}`);
	} catch (error) {
		console.error("Error processing GeoJSON:", error);
	}
}

// Run the main function
await main();
