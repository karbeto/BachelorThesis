import { STATUS_COLORS } from '../screens/Map/logic'

export function generateMapHtml(reports: any[]): string {
  const markersScript = reports
    .map((report: any) => {
      const markerColor = STATUS_COLORS[report.status] || '#94A3B8'
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
      `
    })
    .join('\n')

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
        var map = L.map('map', { zoomControl: false }).setView([41.715, 21.773], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);

        ${markersScript}
      </script>
    </body>
    </html>
  `
}