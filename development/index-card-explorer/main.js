
var container = d3.select('#app');

var svg = container.append('svg')
  .style('width', '80vw')
  .style('height', '80vh');

// console.log(container.node())

var force = d3.layout.force()
  .charge(-20)
  // .gravity(0)
  .size([500, 500]);

d3.json('./index-card-data/array_of_100_cards.json', function(err, data) {
  // Array of objects
  var nodes = data.map(function(d) {
    return {
      indexCard: d
    }
  });

  var circleGs = svg
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .classed('node', true)

  var circles = circleGs.append('circle')
    .attr('r', 10)
    .attr('fill', 'blue');

  circleGs.append('text')
    .text('foo')

  force.nodes(nodes);

  circleGs.call(force.drag);

  window.nodes = nodes;

  force.on('tick', function(alpha, eventType) {
    console.log(nodes[0])

    circleGs
      .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
      // .attr('cx', function(d) { return d.x })
      // .attr('cy', function(d) { return d.y })

    // circles
      // .attr('cx', function(d) { return d.x })
      // .attr('cy', function(d) { return d.y })
      // .each(function(d) {
      //   this.setAttribute('cx', d.x)
      //   this.setAttribute('cy', d.y)
      // })
  });

  force.start();

})



// function IndexCardBranchingSets() {
//   this.setDiv = function() {}
// }
//
// var branching = new IndexCardBranchingSets()
//
// branching.setDiv()
//
// function IndexCardBranchingSets() {
//   var obj;
//
//   obj.setDiv = function() {};
//
//   return obj;
// }
//
// var branching = IndexCardBranchingSets();
//
// branching.setDiv();
