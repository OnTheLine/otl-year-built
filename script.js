$(document).ready(function() {

  const layers = [
    {name: 'pre1900', path: 'geojson/pre1900.geojson', layer: null},
    {name: '1900s', path: 'geojson/1900s.geojson', layer: null},
    {name: '1910s', path: 'geojson/1910s.geojson', layer: null},
    {name: '1920s', path: 'geojson/1920s.geojson', layer: null},
    {name: '1930s', path: 'geojson/1930s.geojson', layer: null},
    {name: '1940s', path: 'geojson/1940s.geojson', layer: null},
    {name: '1950s', path: 'geojson/1950s.geojson', layer: null},
    {name: '1960s', path: 'geojson/1960s.geojson', layer: null},
    {name: '1970s', path: 'geojson/1970s.geojson', layer: null},
    {name: '1980s', path: 'geojson/1980s.geojson', layer: null},
    {name: '1990s', path: 'geojson/1990s.geojson', layer: null},
    {name: '2000s', path: 'geojson/2000s.geojson', layer: null},
    {name: '2010s', path: 'geojson/2010s.geojson', layer: null},
  ];

  // From layers, calculate how many tabs
  const tabs = layers.length;

  // For each layer defined above, generate a tab and load the geojson
  for (var i = 0; i < tabs; i++) {

    // Create a tab and append above the map
    $('.tabBar').append('<div num="' + i + '" class="tabItem">' + layers[i].name + '</div>');

    // Read the geojson file and generate a Leaflet layer
    (function(i) {
      $.getJSON(layers[i].path, function(data) {
        layers[i].layer = L.geoJson(data, {
          style: stylePast,
          onEachFeature: function(feature, layer) {

            // Add a popup with address and year built
            layer.bindPopup(feature.properties.siteaddres +
                '<br>Built in ' + feature.properties.yearbuilt)
          }
        })

        // As soon as the first tab is loaded, activate it
        if (i === 0) { $('.tabItem[num="0"]').click() }
      })
    })(i)
  }

  // Edit the center point and zoom level
  var map = L.map('map', {
    center: [41.76206, -72.74203],
    zoom: 13,
    scrollWheelZoom: false,
    keyboard: false,
  });

  // Edit links to your GitHub repo and data source credit
  map.attributionControl
    .setPrefix('View <a href="https://github.com/ontheline/otl-year-built" target="_blank">data and code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>; design by <a href="http://ctmirror.org">CT Mirror</a>');

  // Basemap CartoDB layer with labels
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright"> \
    OpenStreetMap</a> contributors, &copy; \
    <a href="http://cartodb.com/attributions">CartoDB</a>'
  }).addTo(map);

  // Add West Hartford town boundary
  $.getJSON("geojson/westhartford.geojson", function (data){
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      return {
        'color': 'black',
        'weight': 0.5,
        'fillOpacity': 0,
      }
    }
  }).addTo(map);
  });


  // Add scale to the bottom-right
  L.control.scale().addTo(map);

  // Define styles for past & present decades and match with index.html and style.css
  const stylePast = {
    fillColor: '#222',
    weight: 0,
    opacity: 0.8,
    color: '#222',
    fillOpacity: 0.8
  }

  const stylePresent = {
    fillColor: 'blue',
    weight: 0,
    opacity: 0.8,
    color: 'blue',
    fillOpacity: 0.8
  }

  // Given a tab number `num`, show all geojsons for and before the tab,
  // and hide all after that tab
  const setChoropleth = function(num) {

    for (var i = 0; i < tabs; i++) {
      var l = layers[i].layer;

      if (i < num && !map.hasLayer(l)) {
        map.addLayer(l);
      }
      else if (i === num && !map.hasLayer(l)) {
        map.addLayer(l);
      }
      else if ((i > num) && map.hasLayer(l)) {
        map.removeLayer(l);
      }

      l.setStyle( i === num ? stylePresent : stylePast )
    }
  }


  // When a new tab is selected, this removes/adds the GeoJSON data layers
  $(".tabItem").click(function() {

    // Paint active tab in red
    $(".tabItem").removeClass("selected");
    $(this).addClass("selected");

    setChoropleth( parseInt($(this).attr('num')) );

    // Manually trigger "moveend" so that hash updates, without really moving
    map.setZoom(map.getZoom());
  });


  // This watches for arrow keys to advance the tabs
  $("body").keydown(function(e) {
      var selectedTab = parseInt($(".selected").attr('num'));
      var nextTab;

      // previous tab with left arrow
      if (e.keyCode == 37) {
          nextTab = (selectedTab == 0) ? tabs-1 : selectedTab - 1;
      }
      // next tab with right arrow
      else if (e.keyCode == 39)  {
          nextTab = (selectedTab == tabs-1) ? 0 : selectedTab + 1;
      }

      $('.tabItem[num="' + nextTab + '"').click();
  });

  // add custom legend https://www.figma.com/file/7JitgyYxiT3xR3fyoZttKb/otl-zoning-graphics
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<img src="./otl-year-built-legend.png" alt="Year Built Legend" width="200">';
    return div;
  };

  legend.addTo(map);

});
