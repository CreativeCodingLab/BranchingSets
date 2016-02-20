
var container = d3.select('#app');

var svg = container.append('svg')
  .style('width', '80vw')
  .style('height', '80vh');

// console.log(container.node())

var force = d3.layout.force()
  .charge(-50)
   //.gravity(0)
  .size([500, 500]);

d3.json('./index-card-data/array_of_1000_cards.json', function(err, data) {
  // Array of objects
  // var nodes = data.map(function(d) {
  //   return {
  //     indexCard: d
  //   }
  // } 
  // );

  // // Just get one
  nodes = data.slice(0,2).map(function(node) {
    return node.extracted_information.participant_a;
  });

  createNodes();

  // var node = nodes[0].indexCard.extracted_information.participant_a;

  console.log(nodes);


  var links = data.map(function(d){
    return{
      indexCard: d
    }
  }
  ); 
   var links = [
     { source: 0, target: 1 }
   ];

  var circleGs = svg.selectAll('.node');

function createNodes(){
  var circleGs = svg
    .selectAll('.node')
    .data(nodes)
    
  var entering = circleGs.enter()
    .append('g')
    .classed('node', true);

  entering.append('circle')
    .attr('r', 10)
    .attr('fill', 'blue');

  entering.append('text')
    .text(function(whateverIWannaCallIt) { return whateverIWannaCallIt.entity_text; });

  circleGs.exit().remove();
}
  // circleGs.on('click', function(d) {
  //   console.log('hello');
  // })

  circleGs.on('click', function(d) {
    //console.log(d);

    // An array of any index cards with this participant as participant A
    var allWithThisId = getAllWithId(d.identifier);
    // console.log(allWithThisId);
    // 
    // var participantA_array = getParticipantAArray(allWithThisId[0]);

    var participant_bs = [];
    var i, j;

    // console.log(allWithThisId);

    for (i = 0; i < allWithThisId.length; i++) {
      var card = allWithThisId[i];
      var a_array = getParticipantArray(card, 'b');
      for (j = 0; j < a_array.length; j++) {
        var part = a_array[j];
        participant_bs.push(part);
      }
    }

    console.log(participant_bs);
    console.log(_.uniq(participant_bs, false, function(d) { return d.identifier }))

    var additional_nodes_we_want_to_add = _.uniq(participant_bs, false, function(d) { return d.identifier });

    nodes = nodes.concat(additional_nodes_we_want_to_add);
    nodes = _.uniq(nodes, false, function(d) { return d.identifier });

    console.log(nodes);

    createNodes();

    force.nodes(nodes);
    force.start();

    console.log(force.nodes());


    // var participant_a_arrays = allWithThisId.map(function(card) {
    //   return getParticipantArray(card, 'a');
    // });


    // console.log(participantA_array);
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

  function getParticipantAArray(card) {
    var partA = card.extracted_information.participant_a;
    if(partA.identifier){
      // var arrayofPartA = _(partA.identifier).toArray();
      //return arrayofPartA;
      return [ partA ];
    }
    else if(partA.length){
      return partA;
    }

  }



    // .text('Tejus')

  var allcards = data.map(function(d){
    return{
      indexCard: d
    }
  });
  

  function getAllWithId(id) {
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


 var link = svg.selectAll(".link")
      .data(links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  force.nodes(nodes);
  force.links(links);

  circleGs.call(force.drag);

  window.nodes = nodes;

  force.on('tick', function(alpha, eventType) {
    // console.log(nodes[0])
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

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
