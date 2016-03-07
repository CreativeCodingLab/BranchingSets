
var container = d3.select('#app');

var svg = container.append('svg')
  .style('width', '80vw')
  .style('height', '80vh');

var force = d3.layout.force()
  .charge(-50)
  .size([500, 500]);

var data = [];
var nodes = [];
var links = [];

function createNodes(){
  var circleGs = svg
    .selectAll('.node')
    .data(nodes, function(d) { return d.identifier; });

  var entering = circleGs.enter()
    .append('g')
    .classed('node', true);

  entering.append('circle')
    .attr('r', 10)
    .attr('fill', 'blue');

  entering.append('text')
    // .text(function(whateverIWannaCallIt) { return whateverIWannaCallIt.entity_text; });
    .text(function(d) { return d.entity_text + " " + d.identifier; });

  circleGs.on('click', function(d) {
    console.log(data);

    console.log(d.identifier);

    // An array of any index cards with this participant as participant A
    var allWithThisId = getAllWithId(d.identifier, data);

    // console.log(allWithThisId);

    var participant_bs = [];
    var i, j;

    for (i = 0; i < allWithThisId.length; i++) {
      var card = allWithThisId[i];
      var a_array = getParticipantArray(card, 'b');
      for (j = 0; j < a_array.length; j++) {
        var part = a_array[j];
        participant_bs.push(part);
      }
    }

    // console.log(participant_bs);
    // console.log(_.uniq(participant_bs, false, function(d) { return d.identifier }))

    var additional_nodes_we_want_to_add = _.uniq(participant_bs, false, function(d) { return d.identifier });

    console.log(additional_nodes_we_want_to_add);

    nodes = nodes.concat(additional_nodes_we_want_to_add);
    nodes = _.uniq(nodes, false, function(d) { return d.identifier });

    createNodes();

    force.nodes(nodes).start();
  })

  // circleGs.exit().remove();
}

d3.json('./index-card-data/array_of_1000_cards.json', function(err, _data) {
  data = _data;

  // Get two to start
  nodes = data.slice(0,100).map(function(node) {
    return node.extracted_information.participant_a;
  });

  console.log(nodes);

  createNodes();

  var circleGs = svg.selectAll('.node');

  // circleGs.on('click', function(d) {
  //   console.log('hello');
  // })

  // circleGs.on('click', function(d) {
  //   // An array of any index cards with this participant as participant A
  //   var allWithThisId = getAllWithId(d.identifier, data);
  //
  //   var participant_bs = [];
  //   var i, j;
  //
  //   for (i = 0; i < allWithThisId.length; i++) {
  //     var card = allWithThisId[i];
  //     var a_array = getParticipantArray(card, 'b');
  //     for (j = 0; j < a_array.length; j++) {
  //       var part = a_array[j];
  //       participant_bs.push(part);
  //     }
  //   }
  //
  //   // console.log(participant_bs);
  //   // console.log(_.uniq(participant_bs, false, function(d) { return d.identifier }))
  //
  //   var additional_nodes_we_want_to_add = _.uniq(participant_bs, false, function(d) { return d.identifier });
  //
  //   console.log(additional_nodes_we_want_to_add);
  //
  //   nodes = nodes.concat(additional_nodes_we_want_to_add);
  //   nodes = _.uniq(nodes, false, function(d) { return d.identifier });
  //
  //   // console.log(nodes);
  //
  //   createNodes();
  //
  //   force.nodes(nodes).start();
  // })

  force.nodes(nodes);

  circleGs.call(force.drag);

  force.start();

})

function getParticipantArray(card, side) {
  // var partA = card.extracted_information.participant_a;
  var part = card.extracted_information['participant_' + side]
  if(part.identifier){
    // var arrayofPartA = _(partA.identifier).toArray();
    //return arrayofPartA;
    return [ part ];
  }
  else if(part.length){
    return part;
  }

}

// function getParticipantAArray(card) {
//   var partA = card.extracted_information.participant_a;
//   if(partA.identifier){
//     return [ partA ];
//   }
//   else if(partA.length){
//     return partA;
//   }
// }

force.on('tick', function(alpha, eventType) {
  svg.selectAll('.link')
    .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  svg.selectAll('.node')
    .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
});


function getAllWithId(id, data) {
  //console.log(id, data);
  var filtered = data.filter(function(card){
    partA = card.extracted_information.participant_a;
    if (typeof partA === 'undefined') {
      // console.log(card);
      // throw new Error("No participant A?!?!")
      return false;
    }
    if(partA.identifier) {
      //console.log(id,card);
      return id === partA.identifier;
    }
    if (partA.length) {
      console.log("partA is an array");
      throw new Error('partA is an array');
    }
  });
  return filtered;
}
