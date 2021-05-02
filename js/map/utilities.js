function hideTooltipCountry() {
    tooltipCountry
        .classed("hidden", true);
}

function hideTooltipPlace() {
    tooltipPlace
        .classed('hidden', true);
}

function hideTooltipPlaceCarousel() {
    tooltipPlaceCarousel
        .classed('hidden', true);
}

function showTooltipCountry(country) {
    tooltipCountry.classed("hidden", false)
        .style("top", (d3.event.pageY + 10) + "px")
        .style("left", (d3.event.pageX + 10) + "px")
        .html(country.name);
}

function showTooltipPlace(trip) {
    if (tooltipPlaceCarousel.classed("hidden")) {
        tooltipPlace
            .classed('hidden', false)
            .html("<span id='close' onclick='hideTooltipPlaceCarousel()'  style='cursor: pointer;'>x</span>" +
                "<div class='inner_tooltip'>" +
                "<p>" + trip.name + "</p>" +
                "</div>" +
                "<div> Click me &#x1f4cc;</div>")
            .attr('style',
                'left:' + (d3.event.pageX + 10) + 'px; top:' + (d3.event.pageY) + 'px');
    }
}

function showTooltipPlaceCarousel(trip) {
    tooltipPlaceCarousel
        .classed('hidden', false)
        .html("<span id='close' onclick='hideTooltipPlaceCarousel()' style='cursor: pointer;'>x</span>" +
            "<div class='inner_tooltip'>" +
            "<p>" + trip.name + "</p>" +
            "</div><div class='carousel slide' id='container_places_carousel' data-ride='carousel'><div class='carousel-inner'>" +
            getPlacesListInHtmlFormat(trip) +
            "</div>" +
            '<a class="carousel-control-prev" href="#container_places_carousel" data-slide="prev">' +
            '<span class="carousel-control-prev-icon"></span></a>' +
            '<a class="carousel-control-next" href="#container_places_carousel" data-slide="next">' +
            '<span class="carousel-control-next-icon"></span>' +
            '</a></div>')
        .attr('style',
            'left:' + (d3.event.pageX + 10) + 'px; top:' + (d3.event.pageY) + 'px');
}

function getPlacesListInHtmlFormat(trip) {
    let places = trip["places"];
    var placesListInHtmlFormat = "";

    places.forEach(function(place, index) {
        let active = index == 0 ? "active" : "";
        var placeInHtmlFormat = "<div class='carousel-item " + active + "'> " +
            "<a href='info_link' target='_blank' >" +
            "<img class ='icon' title='title_place' src='media_link' alt='media' /></a></div>";

        placeInHtmlFormat = placeInHtmlFormat.replace("info_link", place["info_link"]);
        placeInHtmlFormat = placeInHtmlFormat.replace("title_place", place["title"]);
        placeInHtmlFormat = placeInHtmlFormat.replace("media_link", place["media_link"]);
        placesListInHtmlFormat += placeInHtmlFormat
    });

    return placesListInHtmlFormat;
}

function isCountryVisited(country) {
    let isVisited = visitedCountries.includes(country.id);
    let isInvalid = (country.id == '-99' && country.geometry.coordinates[0][0][0] != 20.590405904059054);
    return isVisited && !isInvalid;
}

function getVisitedCountries(trips) {
    var visitedCountries = trips.map(function(trip) {
        return trip.country;
    });

    visitedCountries = [...new Set(visitedCountries)];
    return visitedCountries;
}

function getCountriesNames(countryIds, countryNames) {
    let countriesNames = countryIds.filter(function(d) {
        return countryNames.some(function(n) {
            if (d.id == n.id) return d.name = n.name;
        })
    });
    return countriesNames;
}