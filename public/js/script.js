const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("sendLocation", { latitude, longitude });
      },
      (error) => {
        console.error(error);
      },
      { 
          enableHighAccuracy: true,
          timeout: 10000, // Increase timeout to 10 seconds
          maximumAge: 0
      }
    );
  }

const map = L.map("map").setView([0, 0], 19);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Madan Mohan Behera",
    }).addTo(map);

const markers = {};

socket.on("receiveLocation", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if (!markers[id]) {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    } else {
        markers[id].setLatLng([latitude, longitude]);
    }

});

socket.on("userDisconnected", (id) => {
    if (markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
