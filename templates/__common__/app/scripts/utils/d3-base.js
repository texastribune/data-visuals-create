import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear } from 'd3-scale';

export default function createBase({
  margin,
  container,
  width,
  height,
  x,
  y,
  alttext,
  xAxis = axisBottom(),
  yAxis = axisLeft(),
  xAxisGap = 5,
} = {}) {
  margin = Object.assign({ top: 20, right: 20, bottom: 20, left: 20 }, margin);

  margin.bottom += xAxisGap;

  const parent = container.node();

  const containerWidth = width || parent.offsetWidth;
  const containerHeight = height || parent.offsetHeight;

  const innerWidth = containerWidth - margin.left - margin.right;
  const innerHeight = containerHeight - margin.top - margin.bottom;

  const svg = container
    .append('svg')
    .attr('width', containerWidth)
    .attr('height', containerHeight);

  if (!alttext) {
    console.warn('Alternative text was not provided');
  } else {
    svg
      .attr('role', 'img')
      .attr('aria-describedby', 'description')
      .append('desc')
      .attr('id', 'descrption')
      .text(alttext);
  }

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const xScale = x || scaleLinear().range([0, innerWidth]);
  const yScale = y || scaleLinear().range([innerHeight, 0]);

  xAxis.scale(xScale);
  yAxis.scale(yScale);

  const drawAxis = () => {
    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${innerHeight + xAxisGap})`)
      .call(xAxis);

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis);
  };

  return {
    margin,
    container,
    containerWidth,
    containerHeight,
    width: innerWidth,
    height: innerHeight,
    svg,
    g,
    x: xScale,
    y: yScale,
    xAxis,
    yAxis,
    drawAxis,
  };
}
