<template>
  <div ref="resizeRef">
    <svg ref="svgRef">
     
    </svg>
  </div>
</template>

<script>
import { onMounted, ref, watchEffect } from 'vue';
import { select, scaleOrdinal, pie, arc } from 'd3';

//import useResizeObserver from "@/use/resizeObserver";

export default {
 
  props: ["data"],
  setup(props) {
    const svgRef = ref(null)
   // const { resizeRef, resizeState } = useResizeObserver();
    //const margin = 40
    onMounted(() => {
      //const { width, height } = resizeState.dimensions; 
      //console.log(width)
      const width = 456
      const height = 277
      //const radius = Math.min(width, height) / 2 -margin;
      const radius = 112;
    const labelHeight = 20
      const svg = select(svgRef.value).attr("width", width)
    .attr("height", height)
      const chart = svg
        .append('g')
        .attr('transform', `translate(${radius * 2}, ${height-radius})`)
      
      chart.append('g').attr('class', 'slices')
      chart.append('g').attr('class', 'lines')
      chart.append('g').attr('class', 'labels')

       const pieData = pie().sort(null).value(d => d.value)
      const path = arc().outerRadius(radius).innerRadius(51)
      const outerArc = arc()
        .outerRadius(radius * 0.9)
        .innerRadius(radius * 0.9)
        
     const colorScheme = scaleOrdinal().domain(pieData(props.data)).range(['#1499D6','#FE4A49','#FED766','#E6E6EA'])
      const midAngle = (d) => {d.startAngle + (d.endAngle - d.startAngle) / 2}
      console.log(pieData(props.data))
      chart
        .selectAll(null)
        .data(pieData(props.data))
        .enter()
        
        .append('path')
        .attr('d',path)
        .attr('fill', d => colorScheme(d.index))
     

      const legend = svg
        .append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${radius * 2 + 20},0)`)
      
      legend
        .selectAll(null)
        .data(pieData(props.data))
        .enter()
        .append('rect')
        .attr('y', d => labelHeight * d.index * 1.8)
        .attr('width', labelHeight)
        .attr('height', labelHeight)
        .attr('fill', d => colorScheme(d.index))
        .attr('stroke', '#808080')
        .style('stroke-width', '1px')
      
      legend
        .selectAll(null)
        .data(pieData(props.data))
        .enter()
        .append('text')
        .text(d => d.data.name)
        .attr('x', 32)
        .attr('y', d => labelHeight * d.index * 1.8 + 14)
        .style('font-family', 'Roboto, sans-serif')
        .style('font-size', `14px`)
        .style('font-weight', `400`)
        .attr('fill', '#9b9b9b')
        const legendBox = document.querySelector('.legend')
      console.log('lewgendwidth ' + legendBox.offsetWidth)
          
      //   svg  
      //     .select('.lines')
      //     .selectAll('polyline')
      //     .data(pieData(props.data))
      //     .enter()
      //     .append('polyline')
      //     .attr('points', function(d) {
      //       console.log(outerArc.centroid(d))
      //         // see label transform function for explanations of these three lines.
      //         var pos = outerArc.centroid(d);
      //         pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1)
      //         return [path.centroid(d), outerArc.centroid(d), pos]
      //     })


         

      //   const label = svg
      //     .append('text')
          
      //     .attr('transform', function(d) {
      //         var pos = outerArc.centroid(d);
      //         pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1)
      //         return 'translate(' + pos + ')'
      //     })
      //     .style('text-anchor', function(d) {
      //         return (midAngle(d)) < Math.PI ? 'start' : 'end';
      //     })
      
      //   label
      //     .select('.labels')
      //     .selectAll('text')
      //     .data(pieData(props.data))
      //     .enter()
      //     .attr('dy', '.35em')
      //     .html(d => d.data)
               
    

// Add the polylines between chart and labels:
svg.select('g').select('.lines')
  .selectAll('allPolylines')
  .data(pieData(props.data))
  .enter()
  .append('polyline')
    .attr("stroke", "black")
    .attr('transform', `translate(${radius/2}, ${(height-radius)/2})`)
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function(d) {
      var posA = path.centroid(d) // line insertion in the slice
      var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      var posC = outerArc.centroid(d); // Label position = almost the same as posB
      // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
    })

// Add the polylines between chart and labels:
svg.select('g').select('.labels')
  .selectAll('allLabels')
  .data(pieData(props.data))
  .enter()
  .append('text')
    .text( function(d) { console.log(d.data.value) ; return d.data.value } )
    .attr('transform', `translate(${radius}, ${height-radius})`)                              
    .attr('transform', function(d) {
        var pos = outerArc.centroid(d);
       
        pos[0] = radius * 0.99 * (midAngle < Math.PI ? 1 : -1);
        console.log(pos)
        return 'translate(' + pos + ')';
    })
    .style('text-anchor', function() {
       
        return (midAngle < Math.PI ? 'start' : 'end')
    })
    //  svg
    //   .append('text')
    //   .attr('class', 'toolCircle')
    //   .attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
    //   .html('sdfsd') // add text to the circle.
    //   .style('font-size', '.9em')
    //   .style('text-anchor', 'middle')

      
     
      watchEffect(() => {
       

        // Step 7
        // const label = arc().outerRadius(radius).innerRadius(150);
            
        // circular.append("text").attr("transform", function(d) { 
        //             return "translate(" + label.centroid(d) + ")"; 
        //     }).text(function(d) { return d.data.name; });
            
      })
    })

    // return refs to make them available in template
    return { svgRef }
  },
}
</script>
<style lang="scss" scoped>
  svg {
    min-height: 240px;
  }
  svg:not([class*="-fa"]) {
	/* important for responsiveness */
	display: block;
	stroke: none;
	width: 100%;
	height: 100%;
	overflow: visible;
	
  }

  polyline{
    opacity: .3;
    stroke: black;
    stroke-width: 2px;
    fill: none;
}
</style>