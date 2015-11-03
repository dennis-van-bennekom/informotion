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
    { name: '40%', 'value': '40' }
  ];

  var HEIGHT = 900,
      WIDTH = HEIGHT;

  var selected = [];
  var maxSelected = 2;

  var currentYear = 0;

  var rd = d3.scale.linear().domain([100, 0]).range([0, WIDTH / 2 - 60]);
  var inwoners = d3.scale.linear().domain([0, 1300000000]).range([5, 50]);
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

  var dot = g.append('circle')
      .attr('r', '1px')
      //.style('fill', "#fff");

  var centerText = g.append('text')
      .attr('text-anchor', 'middle')
      .text('100%')
      .attr('class', 'center-text')

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
      //.style('fill', '#fff')
      //.style('stroke', '#fff')
      //.style('opacity', 0.9)
      .on('mouseenter', function(d, i) {
        var cx = $(this).attr('cx');
        var cy = $(this).attr('cy');
        var r = $(this).attr('r');

        var label = d3.select(this.parentNode)
            .append('text')
            .attr('class', 'label')
            .style('text-anchor', 'middle')
            .style('fill', '#fff')
            .text(function() { return d.land })
            .attr('dx', cx)
            .attr('dy', cy - r - 10)
            .style('opacity', 0)
            .transition()
            .duration(200)
            .style('opacity', 1);
      })
      .on('mouseleave', function(d, i) {
        d3.selectAll('.label')
          .transition()
          .duration(200)
          .style('opacity', 0)
          .remove();
      })
      .on('click', function(d, i) {
        if (selected.indexOf(i) >= 0) {
          deselect(this, i);
        } else {
          select(this, i);
        }
      });

  function deselect(element, index) {
    selected.splice(selected.indexOf(index), 1);
    
    d3.select(element)
        .style('fill', '#fff');
  }

  function select(element, index) {
    if (selected.length < maxSelected) {
      selected.push(index);
      
      d3.select(element)
          .style('fill', 'red');
    }
  }

  function getRaceData() {
    return selected.map(function(i) {
      return data[i];
    });
  }

  d3.select('.timeline')
      .on('input', function() {
        changeYear(+this.value);
      });

  var canScroll = true;

  $(document).mousewheel(function(e) {

    var direction = e.deltaY > 0 ? -1 : 1;

    scroll(direction, 300);
  });

  $(document).keydown(function(e) {
    switch(e.which) {
      case 38:
        scroll(-1, 150);
        break;
      case 40:
        scroll(1, 150);
        break;
    }
  });

  $(document).keyup(function(e) {
    if (e.which === 38 || e.which === 40) {
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
    d3.selectAll('.label')
      .remove();

    currentYear = year;

    if (currentYear < 0) { currentYear = 0; }
    if (currentYear > 22) {currentYear = 22; }
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
      });


    $('.timeline-current').css('width', yearScale(currentYear) + '%');
    $('.timeline-year').css('left', yearScale(currentYear) - 2.5 + '%');
    $('.timeline-year').text(1990 + currentYear);
  };

  var countryDropdown1 = $('.country-dropdown-1');
  var countryDropdown2 = $('.country-dropdown-2');

  countryDropdown1.combobox();
  countryDropdown2.combobox();

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
});

