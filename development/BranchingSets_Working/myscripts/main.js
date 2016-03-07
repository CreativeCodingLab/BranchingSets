

//Constants for the SVG
var margin = {top: 0, right: 0, bottom: 5, left: 15};
var width = document.body.clientWidth - margin.left - margin.right;
var height = 700 - margin.top - margin.bottom;

//---End Insert------

//Append a SVG to the body of the html page. Assign this SVG as an object to svg
var svg = d3.select("body").append("svg")
    .style("background", "#eee")
    .attr("width", width)
    .attr("height", height);

//Setting up the force layout
var force = d3.layout.force()
    .charge(-05)
    .linkDistance(100)
    .gravity(0.001)
    .size([width, height]);

var forceLabel = d3.layout.force()
  .gravity(0).linkDistance(10)
  .linkStrength(20).charge(-80)
  .size([width, height]);

svg.call(tip);

var viewNodes = [];
var viewLinks = []; // Or maybe "selectedLinks"? Or somethign?

var nodes = [];
var links = [];
var nodes2 = [];
var links2 = [];
var labelAnchors = [];
var labelAnchorLinks = [];

// force
//     // .nodes(viewNodes)
//     .links(viewLinks)

var nameToNode={};
var nameToNode2;
var data3;
var isDisplayingPopup;

drawColorLegend();

// d3.json("data/cards-for-time-arcs.json", function(error, data_) {
d3.json("data/cardsWithContextData.json", function(error, data_) {
    data3 = data_;
    data3.forEach(function(d, index){
      if (index<30) {
        var a = d.extracted_information.participant_a;
        var b = d.extracted_information.participant_b;
        var e = "";
        if (d.evidence){
            for (var i=0;i<1;i++){
                e+= " "+d.evidence[i];
            }
        }

        var type = d.extracted_information.interaction_type;

        var node1 = processNode(a);
        var node2 = processNode(b);
        var l = new Object();
        l.source = node1;
        l.target = node2;
        l.type = type;

        l.name = node1.fields.entity_text+"__"+node2.fields.entity_text;
        links.push(l);
      }
    });
    function processNode(fields){
        if (nameToNode[fields.entity_text]==undefined){
            var newNode = {};
            newNode.fields = fields;
            newNode.id = nodes.length;
            nodes.push(newNode);
            nameToNode[fields.entity_text] = newNode;
            return newNode;
        }
        else{
            return nameToNode[fields.entity_text];
        }
    }
    console.log("Number of nodes: "+nodes.length);
    console.log("Number of links: "+links.length);

// ready();
});

var loadData = d3.select('body').append('button').text('load interpro:IPR002959');

loadData.on('click', function() {
  var viewNodes = nodes
    .filter(function(d) { return d});
    debugger

  var viewLinks = [];

  render(viewNodes, viewLinks)

});

function nodeClicked(d) {
  console.log(d);
  debugger
  // Find this node's links
  // Find all the nodes that are linked to
  // Remove duplicates
  // Assign this new array of nodes and links to viewNodes and viewLinks
  // Call render(viewNodes, viewLinks)

  var viewLinks = [];

  links.forEach(function(link) {
    if(link.source.fields.entity_text === d.fields.entity_text) {
      viewLinks.push(link);
      viewNodes.push(link.target);
      viewNodes.push(link.source);
      debugger
    }

    else if(link.target.fields.entity_text === d.fields.entity_text) {
      viewLinks.push(link);
      viewNodes.push(link.source);
      viewNodes.push(link.target);
    }
  })

  // var fakeLinks = links.slice(6,13); // Don't do this – instead find the links that are connected to this node

  // var fakeNodes = [];

  // fakeLinks.forEach(function(link) {
  //   if(link.source.fields.entity_text === d.fields.entity_text)
  //   // TODO: Only push if this source or target node is not in the fakeNodes array already
  //   fakeNodes.push(link.source);
  //   fakeNodes.push(link.target);
  // });

  // TODO: Remove duplicates!
  // debugger

  render(viewNodes, viewLinks);
}

function render(viewNodes, viewLinks) {
  console.log('render')

  force
    .nodes(viewNodes)
    .links(viewLinks)
    .start();

  var link = svg.selectAll(".link")
      .data(viewLinks)

  link.enter().append("line")
    .attr("class", "link")

    .style("stroke", function(l){
       return getColor(l.type);
    })
    .style("stroke-opacity", 0.9)
    .style("stroke-width", 5);

  link.exit().remove();

  var node = svg.selectAll(".node").data(viewNodes); // "Update"

  var entered_node = node.enter()
    .append('g')
    .attr("class", "node")
    .call(force.drag)
    .on('click', nodeClicked)

  entered_node.append("rect") // "Enter"
    .attr({
              width: 20,
              height: 20,
              rx : 3,
              ry : 3,
              fill: '#d28460'
          })
    .style("fill", "#444")
    .style("stroke", "#eee")
    .style("stroke-opacity", 0.5)
    .style("stroke-width", 0.3)

  entered_node.append('text')
    .style('stroke-width', 0)
    .text('')

  node.exit().remove();

  svg.selectAll('.node')
      .on('mouseover', function(d) {
        d3.select(this).select('text')
          .text(d.fields.entity_text);

        d3.select(this)
          .select('rect')
          .style({
            "stroke": "#000",
            "stroke-width": 5
          });



        // svg.selectAll(".node")
        //   .select('rect')
        //   .style("stroke" , function(d2){
        //     if (d.id==d2.id){
        //       return "#000";
        //     }
        //
        //   })
        //   .style("stroke-width" , function(d2){
        //     if (d.id==d2.id){
        //       return 5;
        //     }
        //   })
        //   .call(force.drag);
      })
      .on('mouseout', function(){
        //  svg.selectAll(".node")
        d3.select(this)
          .select('rect')
          .style("stroke-width" ,0);

        d3.select(this)
          .select('text')
          .text('')

      });

  // node.append("title")
  //     .text(function(d) { return d.fields.entity_text; });

};

force.on("tick", function() {
  svg.selectAll('.link')
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  svg.selectAll('.node')
  .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
});
//
