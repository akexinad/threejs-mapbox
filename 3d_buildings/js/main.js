mapboxgl.accessToken = 'pk.eyJ1IjoiYWtleGluYWQiLCJhIjoiY2p0aWJ1b3d1MG53dzQzcGY1eGsyZmhlYSJ9.5M9Nprzz59r7--kUgE_BWA';

const centerCoords = {
    chicago: [-87.61694, 41.86625],
    zurich: [8.538961, 47.372476],
    siena: [11.331468, 43.318453],
    rozelle: [151.183958, -33.862300]
}

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: centerCoords.siena,
    zoom: 15.99,
    pitch: 40,
    bearing: 20
});

map.on('load', function() {
    map.addLayer({
        'id': 'room-extrusion',
        'type': 'fill-extrusion',
        'source': {
            // GeoJSON Data source used in vector tiles, documented at
            // https://gist.github.com/ryanbaumann/a7d970386ce59d11c16278b90dde094d
            'type': 'geojson',
            'data': 'https://docs.mapbox.com/mapbox-gl-js/assets/indoor-3d-map.geojson'
        },
        'paint': {
            // See the Mapbox Style Specification for details on data expressions.
            // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions

            // Get the fill-extrusion-color from the source 'color' property.
            'fill-extrusion-color': ['get', 'color'],

            // Get fill-extrusion-height from the source 'height' property.
            'fill-extrusion-height': ['get', 'height'],

            // Get fill-extrusion-base from the source 'base_height' property.
            'fill-extrusion-base': ['get', 'base_height'],

            // Make extrusions slightly opaque for see through indoor walls.
            'fill-extrusion-opacity': 0.8
        }
    });

    map.addLayer({
        'id': 'extrusion',
        'type': 'fill-extrusion',
        "source": {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": []
          }
        },
        'paint': {
          'fill-extrusion-color': '#00f',
          'fill-extrusion-height': ['get', 'frequency'],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.9
        }
      });

    map.addLayer({
        "id": "total",
        'type': 'circle',
        'paint': {
          'circle-radius': {
            'base': 1.75,
            'stops': [
              [12, 2],
              [22, 180]
            ]
          },
          'circle-color': '#ff7770'
        },
        "source": {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [8.538961, 47.372476]
                },
                "properties": {
                  "frequency": 100
                }
              },
              {
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [8.539961, 47.372476]
                },
                "properties": {
                  "frequency": 44
                }
              }
            ]
          }
        }
      });
});