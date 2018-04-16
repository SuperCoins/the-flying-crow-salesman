import _ from 'lodash';
import { point } from '@turf/helpers';
import turfDistance from '@turf/distance';

class Location {
    /**
     * @param {number} longitude 
     * @param {number} latitude 
     */
    constructor(longitude, latitude) {
        this.longitude = longitude;
        this.latitude = latitude;
    }

    /**
     * @returns {number} longitude
     */
    getLongitude() { return this.longitude; };

    /**
     * @returns {number} latitude
     */
    getLatitude() { return this.latitude; };

    /**
     * @returns {[number, number]} longitude and latitude
     */
    getPoint() { return [this.getLongitude(), this.getLatitude()]; }

    /**
     * Calculate the distance between two Locations taking into account the curvature of the Earth
     * @param {Location} location 
     * @returns {number}
     */
    distanceTo(location) {
        var from = point(this.getPoint());
        var to = point(location.getPoint());
        return turfDistance(from, to);
    }
}

const locations = [];   // An array of all Locations
let home;   // The Location that is home

/**
 * Add a new location of the given longitude and latitude, if this is the first Location then it will be stored as home
 * @param {number} longitude 
 * @param {number} latitude 
 */
function addLocation(longitude, latitude) {
    if (!home) home = new Location(longitude, latitude);
    else locations.push(new Location(longitude, latitude));
}

/**
 * Calculate the bestRoute between all Locations (starting and ending at home)
 * @returns {Object} bestRoute
 * @returns {Location[]} bestRoute.route
 * @returns {number} bestRoute.totalDistance
 */
function getBestRoute() {
    const routes = generateAllPossibleRoutes();
    const routesAndDistance = routes.map(route => {
        return {
            route,
            totalDistance: getRouteDistance(route)
        };
    });
    return _.maxBy(routesAndDistance, 'totalDistance');
}

/**
 * Given an array of Locations, figure out the totalDistance of the route
 * @param {Location[]} route 
 */
function getRouteDistance(route) {
    // Create an array that contains all journeys in our route (from one location to another)
    let pairings = [];
    for (let i = 0; i < route.length - 1; i++) {
        pairings.push([route[i], route[i + 1]]);
    }
    // Work out the distance of each journey, then add them all together
    return pairings.map(pairing => pairing[0].distanceTo(pairing[1])).reduce((a, b) => a + b);
}

/**
 * Generates all possible routes from an Array of Locations. A route will start and end at home. To get all possible routes we find all permutations.
 */
function generateAllPossibleRoutes() {
    let possibleRoutes = [];
    let usedLocations = [home]; // The first stop will be home
    // A recursive permutation function
    const permute = function (locationsArray) {
        // Our exit condition will be when locationsArray.length == 0
        locationsArray.forEach((location, index) => {
            locationsArray.splice(index, 1);    // Remove the location
            usedLocations.push(location);
            if (locationsArray.length == 0) possibleRoutes.push(usedLocations.slice()); // If there are no locations left then the route is finished
            permute(locationsArray);    // Recurse
            locationsArray.splice(index, 0, location);  // Add the location back in
            usedLocations.pop();
        });
    };
    permute(locations.slice()); // This ensures we don't modify the original array
    possibleRoutes.forEach(route => route.push(home));  // The final stop will be home
    return possibleRoutes;
}

export default { addLocation, getBestRoute };