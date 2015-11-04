function run() {
  d3.csv('scripts/data.csv', function(d) {
    return {
      bnppp:       +d.BNPpp,
      bnppl:       +d.BPNperLand,
      grijs:       +d.GrijzeEnergie,
      hydro:       +d.HydroEnergy,
      jaar:        +d.Jaar,
      land:         d.Land,
      oppervlakte: +d.Oppervlakte,
      populatie:   +d.Populatie,
      total:       +d.RenewableEnergy,
      solar:       +d.SolarEnergy,
      wind:        +d.WindEnergy,
      percentage:  +d.percentageGroen
    };
  }, function(error, d) {
    var data = [];

    for (var i = 0; i < d.length; i += 23) {
      var newObject = {
        bnppp: [],
        bnppl: [],
        grijs: [],
        hydro: [],
        jaar: [],
        land: d[i].land,
        oppervlakte: [],
        populatie: [],
        total: [],
        solar: [],
        wind: [],
        percentage: []
      };

      for(var j = 0; j < 23; j++) {
        var index = i + j;

        newObject.bnppp.push(d[index].bnppp);
        newObject.bnppl.push(d[index].bnppl);
        newObject.grijs.push(d[index].grijs);
        newObject.hydro.push(d[index].hydro);
        newObject.jaar.push(d[index].jaar);
        newObject.oppervlakte.push(d[index].oppervlakte);
        newObject.populatie.push(d[index].populatie);
        newObject.total.push(d[index].total);
        newObject.solar.push(d[index].solar);
        newObject.wind.push(d[index].wind);
        newObject.percentage.push(d[index].percentage);
      }
      
      data.push(newObject);
    }
    
    var agreements = [
      { name: '0%', value: '0' },
      { name: 'Europe Target by 2020 - 20%', value: '20' },
      { name: '40%', 'value': '40' },
      { name: '60%', 'value': '60' },
      { name: '80%', 'value': '80' },
      { name: '', 'value': '100'}
    ];

    var HEIGHT = 900,
        WIDTH = HEIGHT;

    $('.js-tooltip').hide();

    var selected = [Math.round(Math.random() * data.length), Math.round(Math.random() * data.length)];
    var maxSelected = 2;

    var currentYear = 0;
    var currentFilter = 'hydro';

    var rd = d3.scale.linear().domain([100, 0]).range([50, WIDTH / 2 - 60]);
    var inwoners = d3.scale.linear().domain([0, 1300000000]).range([5, 60]);
    var yearScale = d3.scale.linear().domain([0, 22]).range([5, 95]);

    data.forEach(function(d, i) {
      d.s = i;
    });

    var svg = d3.select('.vis').append('svg')
        .attr('width', WIDTH)
        .attr('height', HEIGHT);

    var g = svg.append('g')
        .attr('transform', 'translate(' + WIDTH / 2 + ',' + HEIGHT / 2 + ')');

    var arc = d3.svg.arc()
        .outerRadius(function(d) { return rd(d.value); })
        .startAngle(0)
        .endAngle(2 * Math.PI);

    var gAgreements = g.append('g')
        .attr('class', 'agreements');

    gAgreements.selectAll('.agreementsPaths')
        .data(agreements)
          .enter().append('path')
        .attr('id', function(d, i) { return 'agreementsPath' + i })
        .attr('class', 'agreementsPath')
        .attr('d', arc)
        //.style('stroke', '#fff')
        //.style('fill', 'none')
        //.style('opacity', '0.6');

    gAgreements.selectAll('.agreementsLabels')
        .data(agreements)
          .enter().append('text')
        .attr('class', 'agreementsLabel')
        .attr('dy', -5)
        .attr('dx', 0)
        //.style('fill', '#fff')
        //.style('font-size', '11px')
        .style('text-anchor', 'middle')
      .append('textPath')
        .attr('xlink:href', function(d, i) { return '#agreementsPath' + i; })
        .attr('startOffset', '50%')
        .text(function(d, i) { return d.name; });

    var gCountries = g.append('g')
        .attr('class', 'countries');

    var country = gCountries.selectAll('.country')
        .data(data)
          .enter().append('circle')
        .attr('class', 'country')
        .attr('r', function(d, i) { return inwoners(d.populatie[currentYear]); })
        .attr('cy', function(d, i) {
          var degrees = d.s / data.length * 360;
          var radians = degrees * Math.PI / 180;

          return rd(d.percentage[currentYear]) * Math.sin(radians);
        })
        .attr('cx', function(d, i) {
          var degrees = d.s / data.length * 360;
          var radians = degrees * Math.PI / 180;

          return rd(d.percentage[currentYear]) * Math.cos(radians);
        })
        .on('mouseenter', function(d, i) {
          var cx = +$(this).attr('cx');
          var cy = +$(this).attr('cy');
          var r = +$(this).attr('r');
          var newX = WIDTH / 2 + cx;
          var newY = HEIGHT / 2 + cy;

          var tooltip = $('.js-tooltip');
          tooltip.show();
          tooltip.css('top', newY + r / 1.2);
          tooltip.css('left', newX + r / 1.2);

          $('.js-country').text(d.land);
          $('.js-green-percentage').text(Math.round(d.percentage[currentYear]));
          $('.js-green-total').text(Math.round(d.total[currentYear]));
          var totalGrey = d.total[currentYear] / d.percentage[currentYear] * 100;
          $('.js-grey-total').text(Math.round(totalGrey));
        })
        .on('mouseleave', function(d, i) {
          $('.js-tooltip').hide();
        })
        .on('click', function(d, i) {
          select(i + 1);
        });

    function select(index) {
      if (selected.indexOf(index) < 0) {
        if (selected.length > 1) selected.splice(0, 1);
        
        selected.push(index);

        updateData();
      }
    }

    function selectFix(num, index) {
      selected[num] = index;
      updateData();
    }

    function getRaceData() {
      return selected.map(function(i) {
        return data[i];
      });
    }

    var centerText = g.append('text')
        .attr('text-anchor', 'middle')
        .text('100%')
        .attr('class', 'center-text');

    var centerText2 = g.append('text')
        .attr('text-anchor', 'middle')
        .text('Green')
        .attr('class', 'center-text unit')
        .attr('y', 13);

    d3.select('.timeline')
        .on('input', function() {
          changeYear(+this.value);
        });

    var canScroll = true;

    $(document).keydown(function(e) {
      switch(e.which) {
        case 37:
          scroll(-1, 150);
          break;
        case 39:
          scroll(1, 150);
          break;
      }
    });

    $(document).keyup(function(e) {
      if (e.which === 37 || e.which === 39) {
        canScroll = true;
      }
    });

    function scroll(direction, speed) {
      if (canScroll) {
        canScroll = false;
        setTimeout(function() {
          canScroll = true;
        }, speed);

        changeYear(currentYear + direction);
      }
    }

    function changeYear(year) {
      $('.js-tooltip').hide();

      d3.selectAll('.label')
        .remove();

      currentYear = year;

      if (currentYear < 0) { currentYear = 0; }
      if (currentYear > 22) {currentYear = 22; }

      $('.timeline-current').css('width', yearScale(currentYear) + '%');
      $('.timeline-year').css('left', yearScale(currentYear) - 2.5 + '%');
      $('.timeline-year').text(1990 + currentYear);

      updateData();
    };

    var countryDropdown1 = $('.country-dropdown-1');
    var countryDropdown2 = $('.country-dropdown-2');

    $('.country-dropdown').scombobox({
      fullMatch: true,
      highlight: false
    });

    var values = data.map(function(d, i) {
      return { value: i + 1, text: d.land}
    })

    countryDropdown1.scombobox('fill', values);
    countryDropdown2.scombobox('fill', values);

    countryDropdown1.scombobox('change', function(e) {
      var current = this.value;
      selectFix(0, +current);
    });

    countryDropdown2.scombobox('change', function(e) {
      var current = this.value;
      selectFix(1, +current);
    });

    var timeline = $('.timeline');

    timeline.on('click', function(e) {
      var x = e.clientX;
      var width = window.innerWidth - window.innerWidth / 10 - 300;
      x -= window.innerWidth / 20;

      var year = Math.round(x / width * 22);

      changeYear(year);
    });

    $('.button-prev').on('click', function() {
      changeYear(currentYear - 1);
    });

    $('.button-next').on('click', function() {
      changeYear(currentYear + 1);
    });

    function updateData() {
      filter();

      var index1 = selected[0] - 1;
      var index2 = selected[1] - 1;

      countryDropdown1.scombobox('val', selected[0].toString());
      countryDropdown2.scombobox('val', selected[1].toString());

      $('.js-wind-1').text(Math.round(data[index1].wind[currentYear]));
      $('.js-water-1').text(Math.round(data[index1].hydro[currentYear]));
      $('.js-solar-1').text(Math.round(data[index1].solar[currentYear]));
      $('.js-green-1').text(Math.round(data[index1].percentage[currentYear]) + '%');

      $('.js-wind-2').text(Math.round(data[index2].wind[currentYear]));
      $('.js-water-2').text(Math.round(data[index2].hydro[currentYear]));
      $('.js-solar-2').text(Math.round(data[index2].solar[currentYear]));
      $('.js-green-2').text(Math.round(data[index2].percentage[currentYear]) + '%');

      var countries = $('.countries');

      var country1 = countries.children()[index1];
      var country2 = countries.children()[index2];
      
      countries.children().css('fill', '#118DEE');
      
      $(country1).css('fill', '#D50046');
      $(country2).css('fill', '#D50046');
    }

    function filter() {
      var filter = currentFilter;
      
      var scale = d3.scale.linear().domain([
        d3.min(data, function(c) { return d3.min(c[filter], function(v) { return v; }); }),
        d3.max(data, function(c) { return d3.max(c[filter], function(v) { return v; }); })
      ]).range([5, 60]);

      d3.selectAll('.country')
        .transition()
        .duration(250)
        .attr('cy', function(d, i) {
          var degrees = d.s / data.length * 360;
          var radians = degrees * Math.PI / 180;

          return rd(d.percentage[currentYear]) * Math.sin(radians);
        })
        .attr('cx', function(d, i) {
          var degrees = d.s / data.length * 360;
          var radians = degrees * Math.PI / 180;

          return rd(d.percentage[currentYear]) * Math.cos(radians);
        })
        .attr('r', function(d, i) { return scale(d[filter][currentYear]); });
    }

    $('.js-populatie-filter').on('click', function() {
      currentFilter = 'populatie';
      filter();
    });

    $('.js-oppervlakte-filter').on('click', function() {
      currentFilter = 'oppervlakte';
      filter();
    });

    $('.js-wind-filter').on('click', function() {
      currentFilter = 'wind';
      filter();
    });

    $('.js-hydro-filter').on('click', function() {
      currentFilter = 'hydro';
      filter();
    });

    $('.js-solar-filter').on('click', function() {
      currentFilter = 'solar';
      filter();
    });

    $('input[type="radio"]').keydown(function(e) {
        var arrowKeys = [37, 38, 39, 40];
        if (arrowKeys.indexOf(e.which) !== -1)
        {
            $(this).blur();
            return false;
        }
    });

    updateData();

    currentFilter = 'populatie';
    filter();

    var overlay = $('.overlay');
    overlay.hide();

    $('.compare-button').on('click', function() {
      renderOverlay();
    });

    function renderOverlay() {
      var parseDate = d3.time.format("%Y").parse;

      var graphData = [];

      for (var i = 0; i < 23; i++) {
        graphData.push({
          year: i + 1990,
          country1: data[selected[0] - 1].percentage[i],
          country2: data[selected[1] - 1].percentage[i]
        });
      }

      graphData.forEach(function(d) {
        d.year = parseDate(d.year.toString());
      });

      overlay.show();
      
      var margin = 60;
      var w = 900 - margin * 2,
          h = 600 - margin * 2;

      var x = d3.time.scale()
          .range([0, w]);

      var y = d3.time.scale()
          .range([h, 0]);

      var color = d3.scale.category20c();

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom');

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient('left');

      var line = d3.svg.line()
          .interpolate('basis')
          .x(function(d) { return x(d.year); })
          .y(function(d) { return y(d.percentage); });

      var graph = d3.select('.grafiek').append('svg')
          .attr('width', w + margin * 2)
          .attr('height', h + margin * 2)
        .append('g')
          .attr('transform', 'translate(' + margin + ',' + margin + ')');

      color.domain(d3.keys(graphData[0]).filter(function(key) {
        return key !== 'year'; 
      }));

      var categories = color.domain().map(function(name) {
        return {
          name: name,
          values: graphData.map(function(d) {
            return { year: d.year, percentage: +d[name] };
          })
        };
      });

      x.domain(d3.extent(graphData, function(d) { return d.year }));
      y.domain([0, 100]);

      graph.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + h + ')')
          .call(xAxis);

      graph.append('g')
          .attr('class', 'y axis')
          .call(yAxis);

      var category = graph.selectAll('.category')
          .data(categories)
        .enter().append('g')
          .attr('class', 'category');

      category.append('path')
          .attr('class', 'line')
          .attr('d', function(d) { return line(d.values) })
          .style('stroke', '#000')
          .style('fill', 'none');  
    };

    function deleteOverlay() {
      $('.overlay svg').remove();
    }
  });
}
