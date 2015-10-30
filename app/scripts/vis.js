var agreements = [
  { name: 'Europe Goal', value: '40' },
  { name: 'Gekke ding', value: '20' },
  { name: 'Een of ander doel', 'value': '5' }
];

var data = [
  {
    country: 'Netherlands',
    year: '2014',
    years: [
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80
    ]
  },
  {
    country: 'Belgie',
    year: '2014',
    years: [
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80
    ]
  },
  {
    country: 'Frankrijk',
    year: '2014',
    years: [
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80
    ]
  },
  {
    country: 'Frankrijkhahah dit is een lange naam',
    year: '2014',
    years: [
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80
    ]
  },
  {
    country: 'Frankrijk',
    year: '2014',
    years: [
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80,
      Math.random() * 80
    ]
  }
];

var WIDTH = 720,
    HEIGHT = 720;

var selected = [];
var maxSelected = 2;

var currentYear = 0;

var timelineElement = $('.timeline-inner');

var rd = d3.scale.linear().domain([100, 0]).range([0, WIDTH / 2 - 60]);

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
    .style('fill', "#fff");

var gAgreements = g.append('g')
    .attr('class', 'agreements');

gAgreements.selectAll('.agreementsPaths')
    .data(agreements)
      .enter().append('path')
    .attr('id', function(d, i) { return 'agreementsPath' + i })
    .attr('class', 'agreementsPath')
    .attr('d', arc)
    .style('stroke', '#fff')
    .style('fill', 'none')
    .style('opacity', '0.6');

gAgreements.selectAll('.agreementsLabels')
    .data(agreements)
      .enter().append('text')
    .attr('class', 'agreementsLabel')
    .attr('dy', -5)
    .attr('dx', 0)
    .style('fill', '#fff')
    .style('font-size', '11px')
    .style('text-anchor', 'middle')
    .style('font-family', 'sans-serif')
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
    .attr('r', 20)
    .attr('cy', function(d, i) {
      var degrees = d.s / data.length * 360;
      var radians = degrees * Math.PI / 180;

      return rd(d.years[currentYear]) * Math.sin(radians);
    })
    .attr('cx', function(d, i) {
      var degrees = d.s / data.length * 360;
      var radians = degrees * Math.PI / 180;

      return rd(d.years[currentYear]) * Math.cos(radians);
    })
    .style('fill', '#fff')
    .style('stroke', '#fff')
    .style('opacity', 0.9)
    .on('mouseenter', function(d, i) {
      var cx = $(this).attr('cx');
      var cy = $(this).attr('cy');
      var r = $(this).attr('r');

      var label = d3.select(this.parentNode)
          .append('text')
          .attr('class', 'label')
          .style('text-anchor', 'middle')
          .style('fill', '#fff')
          .text(function() { return d.country })
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
        console.log("nee nee");
      } else {
        select(d, i);
      }
    });

function select(element, index) {
  if (selected.length < maxSelected) {
    selected.push(index);

    console.log(selected);
  }
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
  if (currentYear > 21) {currentYear = 21; }

  timelineElement.css('top', '-' + currentYear * 100 + '%');

  d3.selectAll('.country')
    .transition()
    .duration(250)
    .attr('cy', function(d, i) {
      var degrees = d.s / data.length * 360;
      var radians = degrees * Math.PI / 180;

      return rd(d.years[currentYear]) * Math.sin(radians);
    })
    .attr('cx', function(d, i) {
      var degrees = d.s / data.length * 360;
      var radians = degrees * Math.PI / 180;

      return rd(d.years[currentYear]) * Math.cos(radians);
    })
};