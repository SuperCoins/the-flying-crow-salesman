import MapModule from './map-module';
import RouteModule from './route-module';

// TODO: Fetch this from a local file
const accessToken = 'pk.eyJ1Ijoic3VwZXJjb2lucyIsImEiOiJjamZ6a3NkZTMwd211MnFsbHQ3OXNkYmhlIn0.XMDjq13DWYXNrJynyB43IA';
const map = new MapModule(accessToken, 'map');

// On map click: drawmarker, store location, calculate best route, draw route, show distance
map.onClick(e => {
  map.drawMarker(e.lngLat);
  RouteModule.addLocation(e.lngLat.lng, e.lngLat.lat);
  let bestRoute = RouteModule.getBestRoute();
  if (bestRoute != undefined) {
    map.drawRoute(bestRoute.route);
    map.drawRouteDistance(bestRoute.totalDistance);
  }
});