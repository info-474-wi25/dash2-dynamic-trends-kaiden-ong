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
        d.month = new Date(d.date).getMonth() + 1;
        d.year = new Date(d.date).getFullYear();
        d["month-year"] = new Date(d.year, d.month);
    });

    const numericColumns = ["actual_max_temp", "actual_mean_temp", "actual_min_temp",
        "actual_precipitation", "average_max_temp", "average_min_temp", "average_precipitation",
        "record_max_temp", "record_min_temp", "record_precipitation"];

    data.forEach(d => {
        numericColumns.forEach(col => {
            d[col] = +d[col];
        });
    });

    const precipData = data;

    const groupedData = d3.groups(precipData, d => d.city, d => d["month-year"])
    .map(([city, monthyears]) => ({
        city,
        values: monthyears.map(([monthyear, entries]) => ({
            monthyear,
            avgPrecip: d3.mean(entries, e => e.actual_precipitation)
        }))
    }))

    console.log("Grouped Data", groupedData);

    const flattenedData = groupedData.flatMap(({ city, values }) => 
        values.map(({ monthyear, avgPrecip}) => ({
            monthyear,
            avgPrecip,
            city
        }))
    );

    console.log("Flat Data", flattenedData);

    indianapolisData = data.filter(d => d.city === "Indianapolis");
    const nestedIndyData = d3.group(indianapolisData, d => d["month-year"]);
    console.log("Nested", nestedIndyData)
    indianapolisData = Array.from(nestedIndyData, ([months, records]) => ({
        monthYear: months,
        highAvg: Math.round(d3.mean(records, d => d.actual_max_temp) * 100) / 100,
        meanAvg: Math.round(d3.mean(records, d => d.actual_mean_temp) * 100) / 100,
        meanLow: Math.round(d3.mean(records, d => d.actual_min_temp) * 100) / 100
    }))

    // console.log("Parsed Data:", data);

    console.log("Indianapolis Data:", indianapolisData);

    
    // 3.a: SET SCALES FOR CHART 1
    const xScale = d3.scaleTime()
    .domain(d3.extent(flattenedData, d => d["monthyear"]))
    .range([0, width]);

    const yScale = d3.scaleLinear()
    .domain([0, d3.max(flattenedData, d => d.avgPrecip)])
    .range([height, 0]);

    // 4.a: PLOT DATA FOR CHART 1

    // 5.a: ADD AXES FOR CHART 1

    // 6.a: ADD LABELS FOR CHART 1


    // 7.a: ADD INTERACTIVITY FOR CHART 1
    

    // ==========================================
    //         CHART 2 (if applicable)
    // ==========================================

    // 3.b: SET SCALES FOR CHART 2
    const parseMonthYear = d3.timeParse("%B-%Y");

    indianapolisData.forEach(d => d.monthYear = parseMonthYear(d.monthYear));
    const xScale2 = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);

    const yScale2 = d3.scaleLinear()
        .domain([0, d3.max(indianapolisData, records => d3.max(records.values, d => d.highAvg))])
        .range([height, 0]);

    // 4.b: PLOT DATA FOR CHART 2


    // 5.b: ADD AXES FOR CHART 


    // 6.b: ADD LABELS FOR CHART 2


    // 7.b: ADD INTERACTIVITY FOR CHART 2


});