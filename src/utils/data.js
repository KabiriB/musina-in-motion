const base = import.meta.env.BASE_URL;

const DATA_PATHS = {
  blocksGeojson: `${base}data/musina_blocks_with_summary_app_SAFE_v1.geojson`,
  wardsGeojson: `${base}data/musina_wards_1_6_official_app_ready_v3_QA_PATCHED.geojson`,
  wardSummary: `${base}data/musina_ward_summary_app_v1.json`,
  blockSummary: `${base}data/musina_block_summary_app_SAFE_v1.json`,
  countrySummary: `${base}data/musina_country_summary_app_SAFE_v1.json`,
  metadata: `${base}data/musina_interface_metadata_v1.json`,
  infrastructureGeojson: `${base}data/musina_infrastructure_points_app_v1.geojson`,
  infrastructurePoints: `${base}data/musina_infrastructure_points_app_v1.json`,
  nearestInfrastructure: `${base}data/musina_block_nearest_infrastructure_app_v1.json`,
  petrolCandidatesGeojson: `${base}data/musina_petrol_station_candidates_TEMPORARY_v1.geojson`,
  petrolCandidates: `${base}data/musina_petrol_station_candidates_TEMPORARY_v1.json`,
  participatoryResourcesGeojson: `${base}data/musina_participatory_resources_mapped_app_v1.geojson`,
  participatoryResources: `${base}data/musina_participatory_resources_app_v1.json`,
  participatoryResourceCategorySummary: `${base}data/musina_participatory_resource_category_summary_v1.json`,
};

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }
  return response.json();
}

export async function loadMusinaData() {
  const [
    blocksGeojson,
    wardsGeojson,
    wardSummary,
    blockSummary,
    countrySummary,
    metadata,
    infrastructureGeojson,
    infrastructurePoints,
    nearestInfrastructure,
    petrolCandidatesGeojson,
    petrolCandidates,
    participatoryResourcesGeojson,
    participatoryResources,
    participatoryResourceCategorySummary,
  ] = await Promise.all([
    loadJson(DATA_PATHS.blocksGeojson),
    loadJson(DATA_PATHS.wardsGeojson),
    loadJson(DATA_PATHS.wardSummary),
    loadJson(DATA_PATHS.blockSummary),
    loadJson(DATA_PATHS.countrySummary),
    loadJson(DATA_PATHS.metadata),
    loadJson(DATA_PATHS.infrastructureGeojson),
    loadJson(DATA_PATHS.infrastructurePoints),
    loadJson(DATA_PATHS.nearestInfrastructure),
    loadJson(DATA_PATHS.petrolCandidatesGeojson),
    loadJson(DATA_PATHS.petrolCandidates),
    loadJson(DATA_PATHS.participatoryResourcesGeojson),
    loadJson(DATA_PATHS.participatoryResources),
    loadJson(DATA_PATHS.participatoryResourceCategorySummary),
  ]);

  return {
    blocksGeojson,
    wardsGeojson,
    wardSummary,
    blockSummary,
    countrySummary,
    metadata,
    infrastructureGeojson,
    infrastructurePoints,
    nearestInfrastructure,
    petrolCandidatesGeojson,
    petrolCandidates,
    participatoryResourcesGeojson,
    participatoryResources,
    participatoryResourceCategorySummary,
  };
}
