!function(){

    var data = [
      [
        {axis: '0°', value: 0.75},
        {axis: '315°', value: 0.45},
        {axis: '270°', value: 0.24},
        {axis: '225°', value: 1},
      ],[
        {axis: '0°', value: 1},
        {axis: '90°', value: 0.8},
        {axis: '135°', value: 0.85},
        {axis: '180°', value: 0},
      ],
    ];
  
    var RadarChart = function(id,data,options){
      var config = {
        width: 700,
        height: 700,
        levels: 8,
        radians: 2* Math.PI,
        opacityArea: 1,
        factor:0.7,
        segment: 'circle'
      };
      this.data = data;
      if('undefined' !== typeof options){
        for(var i in options){
          if('undefined' !== typeof options[i]){
            config[i] = options[i];
          }
        }
      }
      var allAxis = data[0].map(function(i,j){
        return i.axis;
      });
      var total = allAxis.length;
      var radius = config.factor * Math.min(config.width/2, config.height/2);
      d3.select(id).select('svg').remove();
      var g = d3.select(id)
        .append('svg')
        .attr('width', config.width)
        .attr('height', config.height)
        .append('g');
  
      var axis = g.selectAll('.axis')
        .data(allAxis)
        .enter()
        .append('g')
        .attr('class','axis');
  
      for(var j=0; j<config.levels; j++){
  
        if (config.segment === 'line'){
          var wlevelFactor = (j+1)*(config.factor*config.width/ config.levels/2);//config.factor*radius*((j+1)/config.levels);//
          var hlevelFactor = (j+1)*(config.factor*config.height/ config.levels/2);//config.factor*radius*((j+1)/config.levels);//
          g.selectAll(".levels")
          .data(allAxis)
          .enter()
          .append("svg:line")
          .attr("x1", function(d, i){return wlevelFactor*(1-Math.sin(i*config.radians/total));})
          .attr("y1", function(d, i){return hlevelFactor*(1-Math.cos(i*config.radians/total));})
          .attr("x2", function(d, i){return wlevelFactor*(1-Math.sin((i+1)*config.radians/total));})
          .attr("y2", function(d, i){return hlevelFactor*(1-Math.cos((i+1)*config.radians/total));})
          .attr("class", "line")
          .style("stroke", "grey")
          .style("stroke-opacity", "0.75")
          .style("stroke-width", "0.3px")
          .attr("transform", "translate(" + (config.width/2-wlevelFactor) + ", " + (config.height/2-hlevelFactor) + ")");
        }
  
        else if (config.segment === 'circle') {
          g.append('svg:ellipse')
          .attr('cx', config.width / 2)
          .attr('cy', config.height / 2)
          .attr('rx', function(d,i){return (j+1)*config.factor*(config.width/config.levels/2)})
          .attr('ry', function(d,i){return (j+1)*config.factor*(config.height/config.levels/2)})
          .attr('class','ring-level')
          .style('stroke-dasharray', function(){
            if (j === config.levels - 1){
              return '1,0';
            }
            else {
              return '1,4';
            }
          });
        }
  
        g.append('text')
        .attr('class','level-mark')
        .text(100/config.levels * (j+1))
        .attr('text-anchor','middle')
        .attr('dy','1em')
        .attr('x', config.width / 2 + 10)
        .attr('y', config.height/2 - 15 - config.factor*(j+1)*(config.height/config.levels/2));
      }
      axis.append('line')
        .attr('x1', config.width / 2)
        .attr('y1', config.height / 2)
        .attr('x2', function(d,i) {
          return config.width / 2 * (1 - config.factor* Math.sin(i * config.radians / total));
        })
        .attr('y2', function(d,i) {
          return config.height / 2 * (1 - config.factor * Math.cos(i * config.radians / total));
        })
        .attr('class', 'line');
  
      axis.append('text')
        .attr('class','legend')
        .text(function(d) {return d;})
        .attr('text-anchor','middle')
        .attr('dy', '1em')
        .attr('transform', 'translate(0, -10)')
        .attr('x', function(d,i) {
          var val = i * config.radians / total;
          return (config.width / 2 * (1 - config.factor * Math.sin(val))) - (60*Math.sin(val));})
        .attr('y', function(d,i) {
          var val = i * config.radians / total;
          return (config.height / 2 * (1 - config.factor * Math.cos(val))) - (60*Math.cos(val));});
  
      data.forEach(function(path,i){
        var dataValues = [];
        path.forEach(function(point,index){
          dataValues.push([
            config.width/2*(1-(parseFloat(Math.max(point.value, 0)))*config.factor*Math.sin(index*config.radians/total)),
            config.height/2*(1-(parseFloat(Math.max(point.value, 0)))*config.factor*Math.cos(index*config.radians/total)),
          ]);
        });
        g.append('polygon')
          .attr('class','radar-chart-' + legendsName[i])
          .data([dataValues])
          .attr('points', function(d){
            var string = '';
            for (var i = 0; i < d.length; i++){
              string = string+d[i][0] + ',' + d[i][1] + ' ';
            }
            return string;
          })
          .style('stroke','#485359')
          .style('stroke-width','3px')
          .style('fill', '#E29735');
        var gd = g.selectAll('.data-group-' + legendsName[i])
          .data(dataValues)
          .enter()
          .append('g')
          .attr('class','data-group-' + legendsName[i]);
  
        gd.append('circle')
          .attr('r', '5')
          .attr('class','data-point')
          .attr('cx',function(d){return d[0]})
          .attr('cy', function(d){return d[1]})
  
        gd.append('text')
          .text(function(d,i){return path[i].value * 100 + '%'})
          .attr('text-anchor', 'middle')
          .attr('class','data-text')
          .attr('x', function(d){return d[0]})
          .attr('y', function(d){return d[1]-10} )
          .style('fill', 'black')
          .style('stroke','black')
          .style('stroke-width','1px')
          .style('font-weight','700');
      });
    };
    RadarChart.prototype.update = function(val,index){
      console.log(val);
    };
    var inputContainer = d3.select('#controller');
    var legendsName = [2013];
    var radar = new RadarChart('#container', data);
    data[0].forEach(function(el,i){
      var input = inputContainer.append('input')
        .attr('type','range')
        .attr('min','0')
        .attr('max','100')
        .attr('step','1')
        .attr('value',el.value * 100)
        .on('input', function(){
          radar.update.call(radar,this.value,i);
        });
    });
  }();