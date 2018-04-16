import mapboxgl from 'mapbox-gl';

import './marker.css';
import houseIcon from './icons/house.png'
import parcelIcon from './icons/parcel.png'

export default class Map {
    /**
     * Creates a mapboxgl map and attaches it to a HTML element
     * @param {string} accessToken The Access token for use with mapboxgl
     * @param {string} containerId The id of the HTML element to attach the map to
     */
    constructor(accessToken, containerId) {
        mapboxgl.accessToken = accessToken;
        this.map = new mapboxgl.Map({
            container: containerId,
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [-0.1838922, 51.5195627], // Starting position [lng, lat]
            zoom: 13 // Starting zoom
        });
    }

    /**
     * Attach a function to the onClick event of the map, this function is provided with the onClick event the map generates
     * @param {Function} callback A function to be called whenever the map is clicked
     */
    onClick(callback) {
        this.map.on("click", e => {
            callback(e);
        });
    }

    /**
     * Draw a map marker at the given position, if the marker draw is home then it will have a house picture, otherwise it will have a parcel picture
     * @param {Object} lngLat 
     * @param {number} lngLat.lng
     * @param {number} lngLat.lat
     * @param {number} [markerSize = 50] 
     */
    drawMarker(lngLat, markerSize = 50) {
        let isMarkerHome = this.home == undefined;
        let el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${isMarkerHome ? houseIcon : parcelIcon})`;
        el.style.width = markerSize + 'px';
        el.style.height = markerSize + 'px';

        let marker = new mapboxgl.Marker(el)
            .setLngLat(lngLat)
            .addTo(this.map);

        if (isMarkerHome) this.home = marker;
    }

    /**
     * Draw a route along a given list of locations
     * @param {Location[]} route - An array of locations from which a route can be drawn
     */
    drawRoute(route) {
        if (this.map.getLayer('route') != undefined) {
            this.map.removeLayer('route');
            this.map.removeSource('route');
        }
        let coords = route.map(location => location.getPoint());
        let geoJson = {
            "id": "route",
            "type": "line",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": coords
                    }
                }
            },
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#888",
                "line-width": 8
            }
        };
        this.map.addLayer(geoJson);
    }

    /**
     * On the home marker add a popup which details the total distance of the route
     * @param {number} distance - In km
     */
    drawRouteDistance(distance) {
        let popup = new mapboxgl.Popup({ offset: 15 })
            .setText('Total Distance: ' + Math.round(distance * 100) / 100 + 'km');
        this.home.setPopup(popup).togglePopup();
    }
}