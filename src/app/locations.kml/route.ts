const LOCATIONS_KML = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Rella Aesthetics Locations</name>
    <Placemark>
      <name>Rella Aesthetics — Vacaville</name>
      <description>542 Main St, Vacaville, CA 95688 · 707.358.2928 · Tuesday–Friday, 9am–5pm · Saturday, 9am–1pm</description>
      <address>542 Main St, Vacaville, CA 95688</address>
    </Placemark>
    <Placemark>
      <name>Rella Aesthetics — Napa</name>
      <description>1541 3rd St, Napa, CA 94559 · 707.358.2928 · Thursday–Saturday, 9am–5pm</description>
      <address>1541 3rd St, Napa, CA 94559</address>
    </Placemark>
  </Document>
</kml>`;

export function GET() {
  return new Response(LOCATIONS_KML, {
    headers: {
      "content-type": "application/vnd.google-earth.kml+xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
      "x-robots-tag": "noindex, follow",
    },
  });
}
