export interface FoodTruck {
    objectid: string;
    applicant: string;
    facilitytype: string;
    cnn: string;
    locationdescription: string;
    address: string;
    permit: string;
    status: string;
    fooditems: string;
    latitude: string;
    longitude: string;
    schedule: string;
    received: string;
    priorpermit: string;
    location: Location;
}

export interface Location {
    type: string,
    coordinates: [number, number]
}
