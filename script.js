$(document).ready(function() {

  // Edit the initial year and number of tabs to match your GeoJSON data and tabs in index.html
  var tabs = 13;
  var choroplethLayer;
  var choroplethOpacity = 1;

  // Edit the center point and zoom level
  var map = L.map('map', {
    center: [41.76206605316627, -72.74202875269116],
    zoom: 12,
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

  L.control.scale().addTo(map);

  resetChoropleth('pre1900');

  function style(feature) {
    return {
      fillColor: 'black',
      weight: 0.5,
      opacity: 1,
      color: 'black',
      fillOpacity: 0.7
    };
  }

  // This highlights the polygon on hover, also for mobile
  function highlightFeature(e) {
    resetHighlight(e);
    var layer = e.target;
    layer.setStyle({
      weight: 4,
      color: 'black',
      fillOpacity: 0.7
    });
    info.update(layer.feature.properties);
  }

  // This resets the highlight after hover moves away
  function resetHighlight(e) {
    choroplethLayer.setStyle(style);
    info.update();
  }

  // This instructs highlight and reset functions on hover movement
  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: highlightFeature
    });
  }

  // Creates an info box on the map
  var info = L.control();
  info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
  };

  // Edit info box labels (such as props.town) to match properties of the GeoJSON data
  // info.update = function (props) {
  //   var winName =
  //   this._div.innerHTML += '<p>' + props.siteaddres + '</p>';
  //   this._div.innerHTML += '<p>' + props.yearbuilt + '</p>';
  // };
  // info.addTo(map);

  function resetChoropleth(year) {
    if (choroplethLayer && map.hasLayer(choroplethLayer)) {
      map.removeLayer(choroplethLayer);
    }

    $.getJSON("geojson/" + year + ".geojson", function (data) {
      choroplethLayer = L.geoJson(data, {
        style: style,
        onEachFeature: onEachFeature
      }).addTo(map);

      // Keep town boundaries on top
      // if (map.hasLayer(townBoundariesLayer)) {
      //   townBoundariesLayer.bringToFront();
      // }
    });
  }

  // When a new tab is selected, this removes/adds the GeoJSON data layers
  $(".tabItem").click(function() {

    $(".tabItem").removeClass("selected");
    $(this).addClass("selected");

    resetChoropleth( $(this).html() );

    // Manually trigger "moveend" so that hash updates, without really moving
    map.setZoom(map.getZoom());
  });

  // In info.update, this checks if GeoJSON data contains a null value, and if so displays "--"
  function checkNull(val) {
    if (val != null || val == "NaN") {
      return comma(val);
    } else {
      return "--";
    }
  }


  // This watches for arrow keys to advance the tabs
  $("body").keydown(function(e) {
      var selectedTab = parseInt($(".selected").attr('id').replace('tab', ''));
      var nextTab;

      // previous tab with left arrow
      if (e.keyCode == 37) {
          nextTab = (selectedTab == 1) ? tabs : selectedTab - 1;
      }
      // next tab with right arrow
      else if (e.keyCode == 39)  {
          nextTab = (selectedTab == tabs) ? 1 : selectedTab + 1;
      }

      $('#tab' + nextTab).click();
  });

});
