import { useD3 } from './hooks/useD3';
import React from 'react';
import * as d3 from 'd3';
import { json } from './sample-graph';

const Graph = ({ data }: any): any => {
    const ref = useD3(
        (svg: any) => {

            let nodes = json.nodes;
            let links = json.links;


            let nodeId = (d: { id: string; }) => d.id; // given d in nodes, returns a unique identifier (string)
            let nodeGroup = (d: { group: any; }) => d.group; // given d in nodes, returns an (ordinal) value for color;
            // let nodeGroups; // an array of ordinal values representing the node groups;
            let nodeTitle;// given d in nodes, a title string;
            let nodeFill = "currentColor";// node stroke fill (if not using a group color encoding);
            let nodeStroke = "#fff"; // node stroke color
            let nodeStrokeWidth = 2; // node stroke width, in pixels
            let nodeStrokeOpacity = 1; // node stroke opacity
            let nodeRadius = 10; // node radius, in pixels
            let nodeStrength;
            let linkSource = (l: { source: string }) => l.source; // given d in links, returns a node identifier string
            let linkTarget = (l: { target: string }) => l.target; // given d in links, returns a node identifier string
            let linkStroke = "#999"; // link stroke color
            let linkStrokeOpacity = 0.6; // link stroke opacity
            let linkStrokeWidth = (l: { value: number; }) => Math.sqrt(l.value); // given d in links, returns a stroke width in pixels
            let linkStrokeLinecap = "round"; // link stroke linecap
            let linkStrength;
            let colors = d3.schemeTableau10;// an array of color strings, for the node groups
            let width = 640; // outer width, in pixels
            let height = 400; // outer height, in pixels
            let invalidation; // when this promise resolves, stop the simulation;

            const N = d3.map(nodes, nodeId).map(intern);
            const LS = d3.map(links, linkSource).map(intern);
            const LT = d3.map(links, linkTarget).map(intern);
            if (nodeTitle === undefined) nodeTitle = (_: any, i: number) => N[i];
            const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
            const G = d3.map(nodes, nodeGroup).map(intern);

            const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
            const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);


            // Replace the input nodes and links with mutable objects for the simulation.
            nodes = d3.map(nodes, (_, i) => ({ id: N[i] }));
            links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

            // Compute default domains.
            let nodeGroups = d3.sort(G);

            // Construct the scales.
            const color = d3.scaleOrdinal(nodeGroups, colors);

            // Construct the forces.
            const forceNode = d3.forceManyBody();
            const forceLink = d3.forceLink(links).id(({ index: i }) => {
                let ii = typeof i === "undefined" ? 0 : i;
                return N[ii];
            });
            if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
            if (linkStrength !== undefined) forceLink.strength(linkStrength);

            const simulation = d3.forceSimulation(nodes)
                .force("link", forceLink)
                .force("charge", forceNode)
                .force("center", d3.forceCenter())
                .on("tick", ticked);



            const link = svg.append("g")
                .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
                .attr("stroke-opacity", linkStrokeOpacity)
                .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
                .attr("stroke-linecap", linkStrokeLinecap)
                .selectAll("line")
                .data(links)
                .join("line");

            const node = svg.append("g")
                .attr("fill", nodeFill)
                .attr("stroke", nodeStroke)
                .attr("stroke-opacity", nodeStrokeOpacity)
                .attr("stroke-width", nodeStrokeWidth)
                .selectAll("circle")
                .data(nodes)
                .join("circle")
                .attr("r", nodeRadius)
                .call(drag(simulation));

            if (W) link.attr("stroke-width", (l: { index: number }) => W[l.index]);
            if (L) link.attr("stroke", (l: { index: number }) => L[l.index]);
            if (G) node.attr("fill", (i: { index: number }) => color(G[i.index]));
            if (T) node.append("title").text((i: { index: number }) => T[i.index]);
            //if (invalidation != null) invalidation.then(() => simulation.stop());

            function intern(value: { valueOf: () => any; } | null) {
                return value !== null && typeof value === "object" ? value.valueOf() : value;
            }

            function ticked() {
                link
                    .attr("x1", (d: { source: { x: any; }; }) => d.source.x)
                    .attr("y1", (d: { source: { y: any; }; }) => d.source.y)
                    .attr("x2", (d: { target: { x: any; }; }) => d.target.x)
                    .attr("y2", (d: { target: { y: any; }; }) => d.target.y);

                node
                    .attr("cx", (d: { x: any; }) => d.x)
                    .attr("cy", (d: { y: any; }) => d.y);
            }

            function drag(sim: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
                function dragstarted(event: { active: any; subject: { fx: any; x: any; fy: any; y: any; }; }) {
                    if (!event.active) sim.alphaTarget(0.3).restart();
                    event.subject.fx = event.subject.x;
                    event.subject.fy = event.subject.y;
                }

                function dragged(event: { subject: { fx: any; fy: any; }; x: any; y: any; }) {
                    event.subject.fx = event.x;
                    event.subject.fy = event.y;
                }

                function dragended(event: { active: any; subject: { fx: null; fy: null; }; }) {
                    if (!event.active) sim.alphaTarget(0);
                    event.subject.fx = null;
                    event.subject.fy = null;
                }

                return d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended);
            }

        }
        ,
        [data.length]);


    return (
        <svg
            ref={ref}
            style={{
                height: "680",
                width: "640",

            }

            } viewBox="-1500 -1500 3000 3000 "
        >
        </svg >
    );
}

export default Graph;