export function getFeatureBounds(geojson) {
  const bounds = {
    minLng: Infinity,
    minLat: Infinity,
    maxLng: -Infinity,
    maxLat: -Infinity,
  };

  const visit = (coords) => {
    if (!Array.isArray(coords)) return;
    if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      const [lng, lat] = coords;
      bounds.minLng = Math.min(bounds.minLng, lng);
      bounds.maxLng = Math.max(bounds.maxLng, lng);
      bounds.minLat = Math.min(bounds.minLat, lat);
      bounds.maxLat = Math.max(bounds.maxLat, lat);
      return;
    }
    coords.forEach(visit);
  };

  geojson?.features?.forEach((feature) => visit(feature.geometry?.coordinates));

  if (!Number.isFinite(bounds.minLng)) return null;
  return bounds;
}

export function wardColorExpression() {
  return [
    'match',
    ['to-number', ['get', 'WardNo']],
    1, '#258a72',
    2, '#3d6e54',
    3, '#db537b',
    4, '#ffc151',
    5, '#ee7367',
    6, '#b87022',
    '#258a72',
  ];
}
