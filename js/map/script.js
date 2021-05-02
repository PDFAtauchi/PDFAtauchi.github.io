var visitedCountries = getVisitedCountries(trips);

var container = d3.select("#container-map").node(),
    width = container.getBoundingClientRect().width,
    height = container.getBoundingClientRect().height,
    active = d3.select(null);

var projection = d3
    .geoNaturalEarth1()
    .scale(width / 2 / Math.PI)
    .rotate([0, 0])
    .center([0, 0])
    .translate([width / 2, height / 2]);

var zoom = d3.zoom().on("zoom", zoomed);
var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("#container-map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "svg-map")
    .attr("preserveAspectRatio", "xMaxYMax meet")
    .on("click", stopped, true);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

var g = svg.append("g");

svg
    .call(zoom);

var tooltipCountry = d3.select("#container-map")
    .append("div")
    .attr("class", "tooltip_country hidden")
    .style("z-index", "10");

var tooltipPlace = d3.select("#container-map")
    .append("div")
    .attr("class", "tooltip_place hidden")
    .style("z-index", "10");

var tooltipPlaceCarousel = d3.select("#container-map")
    .append("div")
    .attr("class", "tooltip_place_carousel hidden")
    .style("z-index", "10");

d3.queue()
    .defer(d3.json, "../data/world-110m.json")
    .defer(d3.csv, "../data/world-country-names.csv")
    .await(ready);

function ready(error, world, countriesInformation) {
    if (error) throw error;
    var countryIds = topojson.feature(world, world.objects.countries).features;
    let countriesNames = getCountriesNames(countryIds, countriesInformation);

    g.selectAll("path")
        .data(countriesNames)
        .enter()
        .append("path")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("d", path)
        .attr('class', function(d) {
            return isCountryVisited(d) ? "country_visited" : "country_not_visited";
        })
        .on("mouseover", function(d, i) {
            return tooltipCountry.style("hidden", false).html(d.name);
        })
        .on("mousemove", showTooltipCountry)
        .on("mouseout", hideTooltipCountry)
        .on("click", clicked);
}

function clicked(d) {
    if (tooltipPlaceCarousel.classed("hidden") && visitedCountries.includes(d.id)) {

        if (active.node() === this) {
            return reset();
        }

        active.classed("active", false);
        active = d3.select(this).classed("active", true);

        var bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
            translate = [width / 2 - scale * x, height / 2 - scale * y];

        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));

        var contained_points = trips.filter(function(point) {
            return (point.country == d.id);
        });

        g.selectAll("image").remove();
        var k = 8;
        g.selectAll("image")
            .data(contained_points)
            .enter()
            .append("svg:image")
            .attr("xlink:href", "assets/map/location.png")
            .attr("x", function(location) {
                return projection([location.lon, location.lat])[0];
            })
            .attr("y", function(location) {
                return projection([location.lon, location.lat])[1];
            })
            .attr("width", k / 3 + "px")
            .attr("height", k / 3 + "px")
            .on("mouseover", showTooltipPlace)
            .on("mouseout", hideTooltipPlace)
            .on("click", showTooltipPlaceCarousel);

    } else {
        if (visitedCountries.includes(d.id)) {
            hideTooltipPlaceCarousel();
        } else {
            reset();
        }
    }
}

function reset() {
    active.classed("active", false);
    active = d3.select(null);

    g.selectAll("path")
        .classed("active", false)

    g.selectAll("image")
        .remove();

    hideTooltipPlaceCarousel();

    svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
}

function zoomed() {
    g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
    g.attr("transform", d3.event.transform);
}

function stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
}