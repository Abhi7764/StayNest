mapboxgl.accessToken = mapToken;
// console.log(listing);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});


// console.log(listing.geometry.coordinates);
// // const marker = new mapboxgl.Marker({ color: 'black', rotation: 45 })
const marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<p>Exact location will be provided after booking</p>`))
    .addTo(map);

//Listing.geometry.coordinates

//console.log(coordinates);
