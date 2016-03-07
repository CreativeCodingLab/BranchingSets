
var container = d3.select('#app');

var svg = container.append('svg')
  .style("background", "#eee")
  .style('width', '80vw')
  .style('height', '80vh');

 var zoomControl = ZoomControl(svg);
  var _IndexCardGraph=createLinks;




var linksG = svg.append('g').classed('links', true);
var nodesG = svg.append('g').classed('nodes', true);

var force = d3.layout.force()
  .charge(-50)
  .linkDistance(15)
  .linkStrength(0.5)
  .gravity(0.05)
  .size([500, 500]);

var data = [];
var nodes = [];
var links = [];

function createLinks(){

  var circleGs = linksG
    .selectAll('.link')
    .data(links, function(d) { return d.source.identifier + "-" + d.target.identifier; });

  var entering = circleGs.enter()
    .append('g')
    .classed('link', true);

  entering.append('line')
    .attr('stroke', '#777')
    .attr('stroke-width', '2px');

  // entering.append('text')
  //   // .text(function(whateverIWannaCallIt) { return whateverIWannaCallIt.entity_text; });
  //   .text(function(d) { return d.entity_text + " " + d.identifier; });
}

function createNodes(){
  var circleGs = nodesG
    .selectAll('.node')
    .data(nodes, function(d) { return d.identifier; });

  var entering = circleGs.enter()
    .append('g')
    .classed('node', true);

  entering.append('rect')
    .attr({

                width: 20,
                height: 20,
                rx : 3,
                ry : 3,
                fill: '#d28460'
            })


    // entering.forEach(function(d){

    entering.on('mouseover', function(d) {

  entering.append('text')
    // .text(function(whateverIWannaCallIt) { return whateverIWannaCallIt.entity_text; });
    .text(function(d) { return d.entity_text + " " + d.identifier; });

    entering.on('mouseout', function(d) {
     createNodes();});
  });



  // });

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

    // [
    //   {
    //     source: d,
    //     target: additional_nodes_we_want_to_add[0]
    //   },
    //   {
    //     source: d,
    //     target: additional_nodes_we_want_to_add[1]
    //   }.
    //   ...
    // ]

   var arrayLinks=[];
   var arrayLinksObj;
     for( var k=0; k < additional_nodes_we_want_to_add.length; k++){
      arrayLinksObj = {source: d, target: additional_nodes_we_want_to_add[k]};
      arrayLinks.push(arrayLinksObj);
    }
    console.log(arrayLinks);
    // }

    //     {
    //       source: d,
    //     target: additional_nodes_we_want_to_add[additional_nodes_we_want_to_add.length]
    //   }
     links = links.concat(arrayLinks);
    links = _.uniq(links, false, function(d) { return d.source.identifier + "-" + d.target.identifier });

    console.log(links)


    nodes = nodes.concat(additional_nodes_we_want_to_add);
    nodes = _.uniq(nodes, false, function(d) { return d.identifier });

    createNodes();

    createLinks();

    force.nodes(nodes).start();
    nodesG.selectAll('.node').call(force.drag);
  })

  // circleGs.exit().remove();
}

d3.json('./index-card-data/array_of_1000_cards.json', function(err, _data) {
  data = _data;

  // Get two to start
  nodes = data.slice(0,15).map(function(node) {
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
  svg.selectAll('.link') // a bunch of g elements
    .select('line')
    .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  svg.selectAll('.node')
    .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
});

  zoomControl.onZoomIn = _IndexCardGraph.zoomIn;
        zoomControl.onZoomOut = _IndexCardGraph.zoomOut;

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
