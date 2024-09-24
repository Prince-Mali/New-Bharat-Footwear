let center = [72.8777,19.0760]

var map = tt.map({
    key: mapToken,
    container: "map",
    center : center,
    zoom : 8
});

map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());

var marker = new tt.Marker({color : '#259fafda'}).setLngLat(center).addTo(map);
let popup = new tt.Popup({offset : 30, closeButton : false}).setLngLat(center).setHTML(`<h5 class= "map-title" style='color : #259fafda;'>New Bharat Footwear</h5><p style='color : #259fafda;'>Mumbai</p>`).addTo(map);