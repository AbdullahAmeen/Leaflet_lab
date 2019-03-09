// Setting up the map view.
var mymap = L.map('map',{
	center:[41.257160, -95.995102],
	zoom:4.6,
	minzoom:2,
	maxzoom:18
});

var currentYear;
var stateLayer;
var popLayer;
var hasControl=false;

// Addint a tile layer.
var basemap = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);


// Creating a Lat & Lon Popup.
var popup = L.popup();
function onMapClick(e) {
    popup
    .setLatLng(e.latlng)
    .setContent("<p>Hello!<br />The Coordinates of the point you just clicked is:" + e.latlng.toString()+"</p>")
    .openOn(mymap);
};
mymap.on('click', onMapClick);

//First lets Creating Popup message.
function onEachFeature(feature, layer){

		var popupContent = "<p> Estimated Population in 2018 at this State was: " + feature.properties.Pop_2018 + "</p>";
		layer.bindPopup(popupContent);

    //event listeners to open popup on hover
		layer.on({
			mouseover: function(){
				//console.log(popupContent);
				this.openPopup();
			},
			mouseout: function(){
				this.closePopup();
			}
		});
		

};

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 60;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI)/900;

    return radius;
};

function createPropSymbols(data, map, attributes){
	//var attribute = "Pop_2010";
	
	var attribute = attributes;
	
    //create marker options
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "maroon",
        color: "white",
        weight: 0.5,
        opacity: 3,
        fillOpacity: 0.8
    };

    //create a Leaflet GeoJSON layer and add it to the map
    popLayer = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            //For each feature, determine its value for the selected attribute
            var attValue = Number(feature.properties[attribute]);
			//console.log(attValue);
            //Give each feature's circle marker a radius based on its attribute value
            geojsonMarkerOptions.radius = calcPropRadius(attValue);

            //create circle markers
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
		onEachFeature: onEachFeature
    }).addTo(mymap);
	addLayerControl();
};

//Addint the States Population Data (GeoJSON).
function getMap(){
	currentYear = "Pop_2010";
		// AJAX request.
var populationGeojson= $.ajax("data/StatesPopulation.geojson", {
	  dataType: "json",
	  success: function(response) {

		var attributes = currentYear;
		createPropSymbols(response, mymap, attributes);
		createSequenceControls(mymap, attributes);
	  }
	});
};

// Here I want to add one more GeoJSON files so that I can use another Operator (Overlay) in my lab1.
 $.ajax("data/State.geojson", {
		dataType: "json",
		success: function(response){

			//create a Leaflet GeoJSON layer and add it to the map
			stateLayer = L.geoJson(response, {
						
            }).addTo(mymap);
			//console.log(stateLayer);
			addLayerControl();
		}
 });

//Building the attribute array in main.js

function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Pop") > -1){
            attributes.push(attribute);
        };
    };

    //check result
    //console.log(attributes);

    return attributes;
};


$(document).ready(getMap);

//Adding the sequence panel to the map. But we need to call the getMap function so that the sequence have access to our data

function createSequenceControls(mymap){
    //create range input element (slider)
    $('#panel').append('<input class="range-slider" type="range">');

    //set slider attributes
    $('.range-slider').attr({
        max: 8,
        min: 0,
        value: 0,
        step: 1,

    });
	// Adding the Forward and Skip buttons in main.js- We will use the class and id the css to style the buttons
	$('#panel').append('<button class="skip" id="reverse">Reverse</button>');
    $('#panel').append('<button class="skip1" id="forward">Forward</button>');
	$('.skip').click(function(){
		
		var barValue
 
 // Decrease current year by 1
         if(currentYear == "Pop_2010"){
			 currentYear = "Pop_2018";
			 barValue = 8;
		 } 
		 else if(currentYear == "Pop_2011"){
			 currentYear = "Pop_2010";
			  barValue = 0;
		 } 
		 else if(currentYear == "Pop_2012"){
			 currentYear = "Pop_2011";
			  barValue = 1;
		 } 
		 else if(currentYear == "Pop_2013"){
			 currentYear = "Pop_2012";
			  barValue = 2;
		 } 
		 else if(currentYear == "Pop_2014"){
			 currentYear = "Pop_2013";
			  barValue = 3;
		 } 
		 else if(currentYear == "Pop_2015"){
			 currentYear = "Pop_2014";
			  barValue = 4;
		 } 
		  else if(currentYear == "Pop_2016"){
			 currentYear = "Pop_2015";
			  barValue = 5;
		 } 
		  else if(currentYear == "Pop_2017"){
			 currentYear = "Pop_2016";
			  barValue = 6;
		 } 
		  else if(currentYear == "Pop_2018"){
			 currentYear = "Pop_2017";
			  barValue = 7;
		 } 
		
		// Update map based on current year
	  var populationGeojson= $.ajax("data/StatesPopulation.geojson", {
	  dataType: "json",
	  success: function(response) {
		  

		var attributes = currentYear;
		createPropSymbols(response, mymap, attributes);
		addLayerControl();
	  }
	});
	
	// Adjust slider
	
	$('.range-slider').attr({
        value: barValue,
    });
	
	
	
        //sequence
    });
	
	$('.skip1').click(function(){
		
		
		//console.log("Calling Skip Method");
		
		  if(currentYear == "Pop_2018"){
			 currentYear = "Pop_2010";
			  barValue = 0;
		 } 
		 else if(currentYear == "Pop_2010"){
			 currentYear = "Pop_2011";
			  barValue = 1;
		 } 
		 else if(currentYear == "Pop_2011"){
			 currentYear = "Pop_2012";
			  barValue = 2;
		 } 
		 else if(currentYear == "Pop_2012"){
			 currentYear = "Pop_2013";
			  barValue = 3;
		 } 
		 else if(currentYear == "Pop_2013"){
			 currentYear = "Pop_2014";
			  barValue = 4;
		 } 
		 else if(currentYear == "Pop_2014"){
			 currentYear = "Pop_2015";
			  barValue = 5;
		 } 
		  else if(currentYear == "Pop_2015"){
			 currentYear = "Pop_2016";
			  barValue = 6;
		 } 
		  else if(currentYear == "Pop_2016"){
			 currentYear = "Pop_2017";
			  barValue = 7;
		 } 
		  else if(currentYear == "Pop_2017"){
			 currentYear = "Pop_2018";
			  barValue = 8;
		 } else {
			 currentYear = "Pop_2010"
			  barValue = 0;
		 }
		
	  var populationGeojson= $.ajax("data/StatesPopulation.geojson", {
	  dataType: "json",
	  success: function(response) {
		
		//var attributes = processData(response);
		var attributes = currentYear;
		createPropSymbols(response, mymap, attributes);
		addLayerControl();
	  }
	});
	// Adjusting bar slider
	// Adjust slider
	
	$('.range-slider').attr({
        value: barValue,
    });
	
    });
	$('#reverse').html('<img src="img/Reverse.png">');
    $('#forward').html('<img src="img/Forward.png">');
};

function addLayerControl(){

	// Creating Layer Control Operator.
	if (popLayer&&stateLayer&&!hasControl){
		var baselayer= {"Base Map": basemap};
		var overlay={"StateLayer": stateLayer,
				"Population": popLayer };
	
		L.control.layers(baselayer, overlay).addTo(mymap);
		hasControl = true;
	};


};
