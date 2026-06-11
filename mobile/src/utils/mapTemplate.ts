import { STATUS_COLORS } from '../screens/Map/logic';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export function generateMapHtml(reports: any[], userLocation?: Coordinates | null): string {
  let centerLat = 41.715;
  let centerLng = 21.773;

  if (userLocation?.latitude && userLocation?.longitude) {
    centerLat = userLocation.latitude;
    centerLng = userLocation.longitude;
  } else if (reports && reports.length > 0 && reports[0].latitude) {
    centerLat = reports[0].latitude;
    centerLng = reports[0].longitude;
  }

  const markersScript = reports
    .filter((r: any) => r?.latitude && r?.longitude)
    .map((report: any) => {
      const markerColor = STATUS_COLORS[report.status] || '#94A3B8';
      return `
        var marker = L.circleMarker([${report.latitude}, ${report.longitude}], {
          radius: 10,
          fillColor: '${markerColor}',
          color: '#FFFFFF',
          weight: 2,
          fillOpacity: 0.9
        }).addTo(map);
        
        marker.on('click', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ id: "${report.id}" }));
        });
      `;
    })
    .join('\n');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; background-color: #E5E7EB; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        // Dynamically initialized using our calculated center focus
        var map = L.map('map', { zoomControl: false }).setView([${centerLat}, ${centerLng}], 14);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);

        ${markersScript}
      </script>
    </body>
    </html>
  `;
}