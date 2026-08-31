function drawChart() {

    // ลบกราฟเดิมก่อนสร้างใหม่
    d3.select("#chart").selectAll("*").remove();

    const data = [
        { channel: "Online sales", sales: 3500 },
        { channel: "In-store sales", sales: 4500 }
    ];

    const width = 700;
    const height = 450;

    const margin = {
        top: 60,
        right: 30,
        bottom: 70,
        left: 70
    };

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const x = d3.scaleBand()
        .domain(data.map(d => d.channel))
        .range([margin.left, width - margin.right])
        .padding(0.4);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.sales)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${margin.left},0)`)
        .call(
            d3.axisLeft(y)
                .tickSize(-(width - margin.left - margin.right))
                .tickFormat("")
        )
        .selectAll("line")
        .attr("stroke", "#d9d9d9")
        .attr("stroke-dasharray", "4,4");

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .style("font-weight", "bold")
        .text("Sales by Channel");

    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("padding", "8px 12px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "6px")
        .style("pointer-events", "none")
        .style("opacity", "0");

    const bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.channel))
        .attr("y", height - margin.bottom)
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .attr("rx", 8)
        .attr("fill", "#2e75b6");

    bars.transition()
        .delay((d, i) => i * 400)
        .duration(1200)
        .ease(d3.easeBounceOut)
        .attr("y", d => y(d.sales))
        .attr("height", d => height - margin.bottom - y(d.sales));

    bars.on("mouseover", function (event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", "#ff7f0e");

        tooltip
            .style("opacity", 1)
            .html(`
                <strong>${d.channel}</strong><br>
                Sales: ${d.sales.toLocaleString()}
            `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 30) + "px");

    }).on("mousemove", function (event) {

        tooltip
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 30) + "px");

    }).on("mouseout", function () {

        d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", "#2e75b6");

        tooltip.style("opacity", 0);
    });

    svg.selectAll(".value")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "value")
        .attr("x", d => x(d.channel) + x.bandwidth() / 2)
        .attr("y", height - margin.bottom)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style("font-weight", "bold")
        .style("opacity", 0)
        .text(d => d.sales)
        .transition()
        .delay((d, i) => i * 400 + 900)
        .duration(500)
        .style("opacity", 1)
        .attr("y", d => y(d.sales) - 10);
}


// =====================
// LINE CHART
// =====================
function drawLineChart() {

    d3.select("#lineChart").selectAll("*").remove();

    const data = [
        { month: "Jan", revenue: 5000 },
        { month: "Feb", revenue: 5500 },
        { month: "Mar", revenue: 6000 },
        { month: "Apr", revenue: 6500 },
        { month: "May", revenue: 7000 },
        { month: "Jun", revenue: 7500 }
    ];

    const width = 700;
    const height = 450;

    const margin = {
        top: 60,
        right: 40,
        bottom: 60,
        left: 70
    };

    const svg = d3.select("#lineChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const x = d3.scalePoint()
        .domain(data.map(d => d.month))
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.revenue)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Grid
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${margin.left},0)`)
        .call(
            d3.axisLeft(y)
                .tickSize(-(width - margin.left - margin.right))
                .tickFormat("")
        )
        .selectAll("line")
        .attr("stroke", "#d9d9d9")
        .attr("stroke-dasharray", "4,4");

    // X Axis
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    // Y Axis
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    // Title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .style("font-weight", "bold")
        .text("Revenue Trend");

    const line = d3.line()
        .x(d => x(d.month))
        .y(d => y(d.revenue));

    // Path Animation
    const path = svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#e74c3c")
        .attr("stroke-width", 3)
        .attr("d", line);

    const totalLength = path.node().getTotalLength();

    path
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

    // Tooltip
    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("padding", "8px 12px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "6px")
        .style("pointer-events", "none")
        .style("opacity", "0");

    // Points
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.month))
        .attr("cy", d => y(d.revenue))
        .attr("r", 0)
        .attr("fill", "#e74c3c")
        .on("mouseover", function (event, d) {

            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>${d.month}</strong><br>
                    Revenue: ${d.revenue.toLocaleString()}
                `);

        })
        .on("mousemove", function (event) {

            tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 30) + "px");

        })
        .on("mouseout", function () {

            tooltip.style("opacity", 0);

        })
        .transition()
        .delay((d, i) => i * 250)
        .duration(500)
        .attr("r", 6);

    // Labels
    svg.selectAll(".revenue-label")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => x(d.month))
        .attr("y", d => y(d.revenue) - 12)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text(d => d.revenue.toLocaleString());
}
function drawPieChart() {

    d3.select("#pieChart").selectAll("*").remove();

    const data = [
        { city: "Bangkok", temperature: 32 },
        { city: "Tokyo", temperature: 25 },
        { city: "New York", temperature: 20 },
        { city: "London", temperature: 18 },
        { city: "Sydney", temperature: 22 }
    ];

    const width = 700;
    const height = 550;
    const radius = 220;

    const svg = d3.select("#pieChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // กลุ่มกราฟ Pie
    const chartGroup = svg.append("g")
        .attr("transform", `translate(${width * 0.38}, ${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.city))
        .range(d3.schemeTableau10);

    const pie = d3.pie()
        .value(d => d.temperature)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Tooltip
    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("padding", "10px 14px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "8px")
        .style("box-shadow", "0 2px 8px rgba(0,0,0,0.15)")
        .style("pointer-events", "none")
        .style("opacity", 0);

    const arcs = chartGroup
        .selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

    // Pie slices
    arcs.append("path")
        .attr("fill", d => color(d.data.city))
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .on("mouseover", function (event, d) {

            const total = d3.sum(data, x => x.temperature);
            const percent =
                ((d.data.temperature / total) * 100).toFixed(1);

            d3.select(this)
                .transition()
                .duration(150)
                .attr("transform", "scale(1.05)");

            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>${d.data.city}</strong><br>
                    Temperature: ${d.data.temperature} °C<br>
                    Percentage: ${percent}%
                `);
        })
        .on("mousemove", function (event) {
            tooltip
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 30) + "px");
        })
        .on("mouseout", function () {

            d3.select(this)
                .transition()
                .duration(150)
                .attr("transform", "scale(1)");

            tooltip.style("opacity", 0);
        })
        .transition()
        .duration(1000)
        .attrTween("d", function (d) {
            const i = d3.interpolate(
                { startAngle: 0, endAngle: 0 },
                d
            );

            return function (t) {
                return arc(i(t));
            };
        });

    // Title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .style("font-weight", "bold")
        .text("City Temperature Distribution");

    // Legend ด้านขวา
    const legend = svg.append("g")
        .attr("transform", "translate(560,120)");

    data.forEach((d, i) => {

        legend.append("rect")
            .attr("x", 0)
            .attr("y", i * 35)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", color(d.city));

        legend.append("text")
            .attr("x", 30)
            .attr("y", i * 35 + 14)
            .style("font-size", "14px")
            .text(`${d.city} (${d.temperature}°C)`);
    });
}