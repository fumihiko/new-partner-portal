<template>
  <div ref="resizeRef">
    <svg ref="svgRef"></svg>
  </div>
</template>                               

<script>
import { onMounted, ref, watchEffect } from "vue";
import { select, scaleOrdinal, pie, arc, interpolate } from "d3";

import useResizeObserver from "@/use/resizeObserver";

export default {
  props: ["data"],
  setup(props) {
    const svgRef = ref(null);
    const { resizeRef, resizeState } = useResizeObserver();

    onMounted(() => {
      // const pieData = pie().sort(null).value(d => d.value)

      const { width, height } = resizeState.dimensions;
      const colorList = ["#1499D6", "#FE4A49", "#FED766", "#E6E6EA"];

      const r = 224 / 2;

      const svg = select(svgRef.value)
        .attr("width", width)
        .attr("height", height * 2);
      const d3GOuter = svg
        .append("g")
        .attr(
          "transform",
          "translate(" + width / 2 + "," + (height * 2) / 2 + ")"
        );
      const pieData = pie()
        .sort(null)
        .value((d) => d.leadCount);
      // グラフの扇型
      const d3FnArcInner = arc().outerRadius(r).innerRadius(51);
      // polylineの折り返し位置
      const d3FnArcOuter = arc()
        .innerRadius(r * 1.06)
        .outerRadius(r * 1.06);
      // labelList内の値を引数に渡すとcolorListから同じindexの値を返す関数
      // labelList[colorList.length]にはcolorList[0]が
      // labelList[colorList.length + 1]にはcolorList[1]が対応する
      const d3FnOrdinalColor = scaleOrdinal()
        .domain(pieData(props.data))
        .range(colorList);

      // 扇型の中間の角度を算出する関数
      const midAngle = (d) => {
        d.startAngle + (d.endAngle - d.startAngle) / 2;
      };

      d3GOuter.append("g").attr("class", "slices");
      d3GOuter.append("g").attr("class", "labels");
      d3GOuter.append("g").attr("class", "lines");

      /* ------- PIE SLICES -------*/
      const d3PathSlice = d3GOuter
        .select(".slices")
        .selectAll("path.slice")
        .data(pieData(props.data));
      d3PathSlice
        .enter()
        .append("path")
        .attr("d", d3FnArcInner)
        .attr("fill", (d) => d3FnOrdinalColor(d.index));
      d3PathSlice
        .transition()
        .duration(1000)
        .attrTween("d", function (d) {
          var d3Interpolate = interpolate({ startAngle: 0, endAngle: 0 }, d);
          return function (t) {
            return d3FnArcInner(d3Interpolate(t));
          };
        });
      // d3PathSlice.exit()
      //   .remove();

      /* ------- TEXT LABELS -------*/
      const d3Text = d3GOuter
        .select(".labels")
        .selectAll("text")
        .data(pieData(props.data));
      d3Text
        .enter()
        .append("text")
        .text(function (d) {
          console.log(d.data.value);
          return d.data.leadCount;
        })
        .style("font-family", "Roboto, sans-serif")
        .style("font-size", `14px`)
        .style("font-weight", `400`)
        .attr("dy", ".35em")
        .attr("fill", "#9b9b9b")

        .attr("transform", function (d) {
          var pos = d3FnArcOuter.centroid(d);

          pos[0] = r * 1.2 * (midAngle(d) < Math.PI ? 1 : -1);
          console.log(pos);
          return "translate(" + pos + ")";
        })
        .style("text-anchor", function () {
          return midAngle < Math.PI ? "start" : "end";
        });
      // d3Text.exit()
      //   .remove();

      /* ------- SLICE TO TEXT POLYLINES -------*/
      const d3Polyline = d3GOuter
        .select(".lines")
        .selectAll("polyline")
        .data(pieData(props.data))
        .enter();
      d3Polyline
        .append("polyline")
        .attr("stroke", (d) => d3FnOrdinalColor(d.index))
        .attr("stroke-width", "1")
        .attr("fill", "none")
        .attr("points", function (d) {
          var posA = d3FnArcInner.centroid(d); // line insertion in the slice
          var posB = d3FnArcOuter.centroid(d); // line break: we use the other arc generator that has been built only for that
          var posC = d3FnArcOuter.centroid(d); // Label position = almost the same as posB
          // we need the angle to see if the X position will be at the extreme right or extreme left
          posC[0] = r * 1.1 * (midAngle(d) < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
          return [posA, posB, posC];
        });
      const labelHeight = 20;
      const legend = svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 130},0)`);

      legend
        .selectAll(null)
        .data(pieData(props.data))
        .enter()
        .append("rect")
        .attr("y", (d) => labelHeight * d.index * 1.8)
        .attr("width", labelHeight)
        .attr("height", labelHeight)
        .attr("fill", (d) => d3FnOrdinalColor(d.index))
        .attr("stroke", "#808080")
        .style("stroke-width", "1px");

      legend
        .selectAll(null)
        .data(pieData(props.data))
        .enter()
        .append("text")
        .text((d) => d.data.mqlType)
        .attr("x", 32)
        .attr("y", (d) => labelHeight * d.index * 1.8 + 14)
        .style("font-family", "Roboto, sans-serif")
        .style("font-size", `14px`)
        .style("font-weight", `400`)
        .attr("fill", "#9b9b9b");
      const legendBox = document.querySelector(".legend");
      console.log("lewgendwidth " + legendBox.offsetWidth);
      // d3Polyline.exit()
      //   .remove();

      watchEffect(() => {});
    });

    return { svgRef, resizeRef };
  },
};
</script>