
var demosController;

$(document).ready(function() {

    checkBrowser();
d3.json("./index-card-data/array_of_1000_cards.json");
  //  d3.json('./index-card-data/array_of_1000_cards.json', function(err, _data) {
  // data = _data;

  // // Get two to start
  // nodes = data.slice(0,15).map(function(node) {
  //   return node.extracted_information.participant_a;
  // });
  //   //DEMOS CONTROLLER
    demosController = new DemosController([
        DemoPlainTree,
        DemoCircularTrees,
        DemoLineSet,
        DemoOverlappingRects,
        DemoComplexHierarchy,
        DemoCirclePacking,
        DemoLineSet2,
        DemoExplorer,
        DemoParallaxGraph
    ]);

    var demoTitle = getParameterByName("demo") || DemoExplorer.demoTitle;
    var hideDetailsContainer = getParameterByName("hideDetailsContainer") || true;

    demosController.setUpDemo(demoTitle);

    if(hideDetailsContainer)
        demosController.hideDetailsContainer();

});


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function checkBrowser() {
    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    if(!is_chrome){
        alert("Please run the application on Chrome Web Browser.")
    }
}