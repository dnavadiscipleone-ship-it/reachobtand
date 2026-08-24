// Haversine formula to calculate distance between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Build SQL for location-based discovery
export const buildDiscoveryQuery = (userLat, userLon, radiusKm = 20) => {
  // Using PostGIS-style distance calculation
  return `
    SELECT
      p.id, p.user_id, p.display_name, p.age, p.bio, p.interested_in,
      p.latitude, p.longitude, p.looking_for, p.interests,
      p.anonymous_mode, p.discreet_mode,
      pp.photo_url as primary_photo,
      ROUND(
        CAST(
          6371 * 2 * ASIN(
            SQRT(
              POWER(SIN((p.latitude - $1) * PI() / 360), 2) +
              COS($1 * PI() / 180) * COS(p.latitude * PI() / 180) *
              POWER(SIN((p.longitude - $2) * PI() / 360), 2)
            )
          ) AS NUMERIC
        ), 2
      ) AS distance
    FROM profiles p
    LEFT JOIN profile_photos pp ON p.id = pp.profile_id AND pp.is_primary = TRUE
    WHERE
      p.user_id != $3
      AND p.verified = TRUE
      AND p.latitude IS NOT NULL
      AND p.longitude IS NOT NULL
      AND ABS(p.latitude - $1) <= $4
      AND ABS(p.longitude - $2) <= $4
    ORDER BY distance
    LIMIT 50
  `;
};
