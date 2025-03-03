// mapStyles.js
export const mapStyle = [
  {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#99DDFF" // Light blue for water
          },
          {
              "lightness": 30
          }
      ]
  },
  {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#EAEAEA" // Light gray for landscape
          },
          {
              "lightness": 30
          }
      ]
  },
//   {
//       "featureType": "road",
//       "elementType": "geometry",
//       "stylers": [
//           {
//               "color": "#D8E0E7" // Very light gray for roads
//           },
//           {
//               "lightness": 10
//           }
//       ]
//   },
//   {
//       "featureType": "road.highway",
//       "elementType": "geometry",
//       "stylers": [
//           {
//               "color": "#F2F2F2" // Soft light gray for highways
//           },
//           {
//               "lightness": 10
//           }
//       ]
//   },
  {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#F5F5F5" // Light gray for points of interest
          },
          {
              "lightness": 20
          }
      ]
  },
  {
      "featureType": "poi",
      "elementType": "labels",
      "stylers": [
          {
              "visibility": "off" // Hide point of interest labels
          }
      ]
  },
  {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#E5E5E5" // Very light gray for transit
          },
          {
              "lightness": 15
          }
      ]
  },
  {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#FFFFFF" // White for administrative areas
          },
          {
              "lightness": 30
          }
      ]
  },
  {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#D0D0D0" // Light gray for administrative borders
          },
          {
              "lightness": 20
          }
      ]
  },
//   {
//       "featureType": "road",
//       "elementType": "labels",
//       "stylers": [
//           {
//               "visibility": "on" 
//           },
//           {
//               "lightness": 20
//           }
//       ]
//   },


];
