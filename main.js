// 1: SET GLOBAL VARIABLES
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG containers for both charts
const svg1_precipitation = d3.select("#lineChart1") // If you change this ID, you must change it in index.html too
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const svg2_RENAME = d3.select("#lineChart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// (If applicable) Tooltip element for interactivity
// const tooltip = ...

// 2.a: LOAD...
d3.csv("weather.csv").then(data => {
    // 2.b: ... AND TRANSFORM DATA
    console.log(data);
    const parseDate = d3.timeParse("%m/%d/%Y");
    const formatMonthYear = d3.timeFormat("%B-%Y");

    data.forEach(d => {
        // d.date = parseDate(d.date);
        d["month-year"] = formatMonthYear(parseDate(d.date));
    });

    const numericColumns = ["actual_max_temp", "actual_mean_temp", "actual_min_temp",
        "actual_precipitation", "average_max_temp", "average_min_temp", "average_precipitation",
        "record_max_temp", "record_min_temp", "record_precipitation"];

    data.forEach(d => {
        numericColumns.forEach(col => {
            d[col] = +d[col];
        });
    });

    indianapolisData = data.filter(d => d.city === "Indianapolis");
    indianapolisData = indianapolisData.map(d => ({
        date: d.date,
        high: +d.actual_max_temp,
        avg: +d.actual_mean_temp,
        low: +d.actual_min_temp
    }))

    console.log("Parsed Data:", data);

    console.log("Indianapolis Data:", indianapolisData);

    const nestedData = d3.group(data, d => d.city, d => d["month-year"]);
    const monthlyAverages = Array.from(nestedData, ([city, months]) => ({
        city,
        values: Array.from(months, ([monthYear, records]) => ({
            monthYear,
            avgPrecipitation: d3.mean(records, d => d.actual_precipitation)
        }))
    }));
    console.log(monthlyAverages);
    // 3.a: SET SCALES FOR CHART 1
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(monthlyAverages, city => d3.max(city.values, d => d.avgPrecipitation))])
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(monthlyAverages.map(d => d.city));

    const line = d3.line()
        .x(d => xScale(parseDate(d.monthYear)))
        .y(d => yScale(d.avgPrecipitation));
    // 4.a: PLOT DATA FOR CHART 1

    // 5.a: ADD AXES FOR CHART 1

    // 6.a: ADD LABELS FOR CHART 1


    // 7.a: ADD INTERACTIVITY FOR CHART 1
    

    // ==========================================
    //         CHART 2 (if applicable)
    // ==========================================

    // 3.b: SET SCALES FOR CHART 2


    // 4.b: PLOT DATA FOR CHART 2


    // 5.b: ADD AXES FOR CHART 


    // 6.b: ADD LABELS FOR CHART 2


    // 7.b: ADD INTERACTIVITY FOR CHART 2


});