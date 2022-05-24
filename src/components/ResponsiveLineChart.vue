<template>
  <div v-if="noDataToShow">
    <p>There is no data to show.</p>
  </div>
  <div v-if="!noDataToShow" ref="resizeRef">
    <svg ref="svgRef">
      <g class="x-axis" />
      <g class="y-axis" />
    </svg>
    <!-- <div id="tooltip" class="tooltip">
        <div class="tooltip-date">
            <span id="date"></span>
        </div>
        <div class="tooltip-alerts">
            Alerts sent: <span id="alerts"></span>
        </div>
    </div> -->
  </div>
</template>

<script>
import { onMounted, ref, watchEffect } from "vue";
import {
  select,
  line,
  scaleLinear,
  timeFormat,
  timeParse,
  extent,
  // mouse,
  // scan,
  curveBasis,
  axisBottom,
  axisLeft,
} from "d3";
import useResizeObserver from "@/use/resizeObserver";

export default {
  name: "ResponsiveLineChart",
  props: ["data", "mode"],
  setup(props) {
    // create ref to pass to D3 for DOM manipulation
    const fetchedMode = ref(props.mode);
    const svgRef = ref(null);
    const noDataToShow = ref(false)
    // this creates another ref to observe resizing,
    // which we will attach to a DIV,
    // since observing SVGs with the ResizeObserver API doesn't work properly
    const { resizeRef, resizeState } = useResizeObserver();

    onMounted(() => {
      // pass ref with DOM element to D3, when mounted (DOM available)
      const svg = select(svgRef.value);

      // whenever any dependencies (like data, resizeState) change, call this!
      watchEffect(() => {

        if(props.data.length <= 2) {
          noDataToShow.value = true
          return
        }
        noDataToShow.value = false
        const { width, height } = resizeState.dimensions;

        const xFormat = fetchedMode.value == "days" ? "%B %d, %Y" : "%b-%Y";

        const parseTime =
          fetchedMode.value == "days"
            ? timeParse("%Y/%m/%d")
            : timeParse("%Y/%m");

        const xScale = scaleLinear()
          .domain(extent(props.data, (d) => parseTime(d.date))) // input values...
          .range([0, width]); // ... output values

        const yScale = scaleLinear()
          .domain(extent(props.data, (d) => d.value)) // input values...
          .range([height, 0]); // ... output values

        // line generator: D3 method to transform an array of values to data points ("d") for a path element
        const lineGen = line()
          .curve(curveBasis)
          .x((d) => xScale(parseTime(d.date)))
          .y((d) => yScale(d.value));

        // render path element with D3's General Update Pattern
        svg
          .selectAll(".line") // get all "existing" lines in svg
          .data([props.data]) // sync them with our data
          .join("path")

          .attr("class", "line") // attach class (important for updating)
          .attr("stroke", "#1499D6") // styling
          .attr("d", lineGen);
        const xAxis = axisBottom(xScale).tickFormat(timeFormat(xFormat));
        svg
          .select(".x-axis")
          .style("transform", `translateY(${height}px)`) // position on the bottom
          .call(xAxis);

        const yAxis = axisLeft(yScale);
        svg.select(".y-axis").call(yAxis);
      });
    });

    // return refs to make them available in template
    return { svgRef, resizeRef, fetchedMode, noDataToShow };
  },
};
</script>
<style lang="scss" scoped>
svg:not([class*="-fa"]) {
  /* important for responsiveness */
  display: block;
  fill: none;
  stroke: none;
  width: 100%;
  height: 100%;
  overflow: visible;
  min-height: 258px;
}
div {
  padding: 24px;
}
</style>