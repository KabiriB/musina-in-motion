// Shared cartographic configuration for Musina in Motion.
// OpenFreeMap provides MapLibre-compatible vector styles without a project API key.
// Keeping all map styles here lets the atlas change basemap treatment without editing each map.

export const MAP_STYLES = {
  local: 'https://tiles.openfreemap.org/styles/positron',
  journey: 'https://tiles.openfreemap.org/styles/liberty',
};

export const MAP_ATTRIBUTION = '© OpenFreeMap · © OpenMapTiles · © OpenStreetMap contributors';

export function firstLabelLayerId(map) {
  try {
    return map.getStyle()?.layers?.find((layer) => layer.type === 'symbol')?.id;
  } catch {
    return undefined;
  }
}
