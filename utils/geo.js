const EARTH_RADIUS_METERS = 6371000;
const DEFAULT_MIN_DISTANCE_METERS = 50;

const toRadians = (value) => (value * Math.PI) / 180;

export const getDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
};

export const hasLocationChanged = (
  oldLoc,
  newLoc,
  thresholdMeters = DEFAULT_MIN_DISTANCE_METERS,
) => {
  if (
    oldLoc?.latitude == null ||
    oldLoc?.longitude == null ||
    newLoc?.latitude == null ||
    newLoc?.longitude == null
  ) {
    return true;
  }

  const distance = getDistanceMeters(
    Number(oldLoc.latitude),
    Number(oldLoc.longitude),
    Number(newLoc.latitude),
    Number(newLoc.longitude),
  );

  return distance >= thresholdMeters;
};
