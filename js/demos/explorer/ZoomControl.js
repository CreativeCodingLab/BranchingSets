var ZoomControl = function (container) {
    var self = {};

    self.onZoomIn = function () {

    };

    self.onZoomOut = function () {

    };

      self.zoomOut = function () {
        var currentScale = _zoomBehaviour.scale();
        //if(currentScale >= _zoomBehaviour.scaleExtent()[0] - 0.5)
            setZoom(_zoomBehaviour.scale()*0.6);
    };

    self.zoomIn = function () {
        var currentScale = _zoomBehaviour.scale();
        if(currentScale <= _zoomBehaviour.scaleExtent()[1]*1.5)
            setZoom(_zoomBehaviour.scale()*1.5);
    };





    var init = function () {
        var zoomContainer =
            container.append('div')
            .classed('zoom-control-container', true);

        zoomContainer.append('div')
            .classed('zoom-control-button', true)
            .classed('zoom-control-button-plus', true)
            .on('click', function () {
                self.onZoomIn()
            });


        zoomContainer.append('div')
            .classed('zoom-control-button', true)
            .classed('zoom-control-button-minus', true)
            .on('click', function () {
                self.onZoomOut()
            });

    }();

    return self;
};

