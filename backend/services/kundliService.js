import { DateTime } from 'luxon';
import tzlookup from 'tz-lookup';
import { julian, solar, moonposition } from 'astronomia';

// ---------------- City Map ----------------
export const cityMap = {
  Mumbai: { lat: 19.075984, lon: 72.877656 },
  Delhi: { lat: 28.70406, lon: 77.102493 },
  Bengaluru: { lat: 12.971599, lon: 77.594566 },
  Chennai: { lat: 13.08268, lon: 80.270718 },
  Kolkata: { lat: 22.572646, lon: 88.363895 },
  // Add more cities as needed
};

// ---------------- Zodiac Signs ----------------
const SIGNS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
];

// ---------------- Helper Functions ----------------
function normalizeDegrees(d) {
  const v = d % 360;
  return v < 0 ? v + 360 : v;
}
function lonToSign(lon) {
  const n = Math.floor(normalizeDegrees(lon) / 30);
  return SIGNS[n];
}
function lonToHouse(ascLon, lon) {
  const diff = normalizeDegrees(lon - ascLon);
  return Math.floor(diff / 30) + 1; // 1..12
}
function radToDeg(rad) {
  return rad * (180 / Math.PI);
}
function degToRad(deg) {
  return deg * (Math.PI / 180);
}

// ---------------- Julian Date ----------------
export function localToJulianDate({ dob, tob, tz }) {
  const [hh, mm] = tob.split(':').map(Number);
  const dtLocal = DateTime.fromISO(
    `${dob}T${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`,
    { zone: tz }
  );
  if (!dtLocal.isValid) throw new Error('Invalid DOB, TOB or timezone');
  const dtUTC = dtLocal.toUTC();
  const jd = julian.CalendarGregorianToJD(
    dtUTC.year,
    dtUTC.month,
    dtUTC.day + (dtUTC.hour / 24) + (dtUTC.minute / 1440) + (dtUTC.second / 86400)
  );
  return { jd, dtUTC };
}

// ---------------- Planetary Computations ----------------
function computeSunLongitude(jd) {
  const lonRad = solar.apparentLongitude(jd); // radians
  return normalizeDegrees(radToDeg(lonRad));
}

function computeMoonLongitude(jd) {
  const mp = moonposition.position(jd); // { lon, lat, range } in radians
  return normalizeDegrees(radToDeg(mp.lon));
}

// Greenwich Sidereal Time (degrees)
function greenwichSiderealTime(jd) {
  const T = (jd - 2451545.0) / 36525.0; // Julian centuries since J2000
  let theta = 280.46061837 +
              360.98564736629 * (jd - 2451545) +
              0.000387933 * T * T -
              (T * T * T) / 38710000;
  return normalizeDegrees(theta);
}

// Local Sidereal Time = GST + longitude
function computeLocalSidereal(jd, lon) {
  const gst = greenwichSiderealTime(jd);
  return normalizeDegrees(gst + lon);
}

// Mean obliquity of the ecliptic (IAU 2000)
function meanObliquity(jd) {
  const T = (jd - 2451545.0) / 36525; // Julian centuries from J2000
  const eps = 23 + (26/60) + (21.448/3600) 
            - (46.8150/3600)*T 
            - (0.00059/3600)*T*T 
            + (0.001813/3600)*T*T*T;
  return degToRad(eps); // radians
}

function computeAscendant(jd, lat, lon) {
  const epsRad = meanObliquity(jd);
  const lstDeg = computeLocalSidereal(jd, lon);
  const lstRad = degToRad(lstDeg);
  const phiRad = degToRad(lat);

  const sinEps = Math.sin(epsRad);
  const cosEps = Math.cos(epsRad);
  const tanPhi = Math.tan(phiRad);

  const num = Math.sin(lstRad) * cosEps - tanPhi * sinEps;
  const den = Math.cos(lstRad);
  let ascRad = Math.atan2(num, den);
  return normalizeDegrees(radToDeg(ascRad));
}

// ---------------- Main Kundli Function ----------------
export async function generateKundliSummary({ name, dob, tob, city }) {
  const cityNormalized = (city || '').trim();
  const loc = cityMap[cityNormalized];
  if (!loc) throw new Error(`City "${city}" not supported in local list.`);

  const { lat, lon } = loc;
  const tz = tzlookup(lat, lon);
  const { jd, dtUTC } = localToJulianDate({ dob, tob, tz });

  const sunLon = computeSunLongitude(jd);
  const moonLon = computeMoonLongitude(jd);
  const ascLon = computeAscendant(jd, lat, lon);

  const sunSign = lonToSign(sunLon);
  const moonSign = lonToSign(moonLon);
  const ascSign = lonToSign(ascLon);

  const positions = {
    sun: { lon: sunLon, sign: sunSign, house: lonToHouse(ascLon, sunLon) },
    moon: { lon: moonLon, sign: moonSign, house: lonToHouse(ascLon, moonLon) },
    ascendant: { lon: ascLon, sign: ascSign, house: 1 },
    mars: null,
    mercury: null,
    venus: null,
    jupiter: null,
    saturn: null,
    rahu: null,
    ketu: null,
  };

  function shortPlanetLine(name, p) {
    if (!p) return `${name}: (not computed)`;
    return `${name} in ${p.sign} (House ${p.house}) — ${p.sign} traits.`;
  }

  const interpretation = [
    `Name: ${name}`,
    `Date of Birth (local): ${dob} ${tob} (${tz})`,
    `Place: ${cityNormalized} (lat: ${lat}, lon: ${lon})`,
    '',
    shortPlanetLine('Ascendant (Lagna)', positions.ascendant),
    shortPlanetLine('Sun', positions.sun),
    shortPlanetLine('Moon', positions.moon),
  ];

  return {
    name,
    dob,
    tob,
    city: cityNormalized,
    lat,
    lon,
    timezone: tz,
    jd,
    dtUTC: dtUTC.toISO(),
    positions,
    interpretation,
  };
}
