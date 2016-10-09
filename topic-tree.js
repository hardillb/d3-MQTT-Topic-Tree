/*
 * Based on the Tree example from d3 here:
 * http://mbostock.github.io/d3/talk/20111018/tree.html
 * 
 * Copyright (c) 2013, Michael Bostock
 * All rights reserved.
 */

var m = [20, 120, 20, 120],
    w = 2000 - m[1] - m[3],
    h = 750 - m[0] - m[2],
    i = 0,
    root;



var tree; 

var diagonal;

var vis; 

function setup(tagID) {
	tree = d3.layout.tree().size([h, w]);
	diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });
	vis = d3.select("#"+tagID).append("svg:svg").attr("width", w + m[1] + m[3]).attr("height", h + m[0] + m[2]).append("svg:g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");
	
	  root = {"name": "-", "children": []};
	  root.x0 = h / 2;
	  root.y0 = 0;

	  function toggleAll(d) {
	    if (d.children) {
	      d.children.forEach(toggleAll);
	      toggle(d);
	    }
	  }

	  update(root);
}


function update(source) {
  var duration = d3.event && d3.event.altKey ? 5000 : 500;

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse();

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 120; });

  // Update the nodes…
  var node = vis.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });
  
  
  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", function(d) { toggle(d); update(d); });

  nodeEnter.append("svg:circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("svg:text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);
  
  nodeEnter.append("svg:text")
  	.attr("class","data")
	.attr("x", 10)
	.attr("y", 5)
	.attr("dy", ".35em")
	.attr("id",function(d) {return d.id;})
	.text(function(d) { 
                if (d.data) { 
                  if (d.data.length > 20) {
                    return d.data.substring(0,20) + "..."; 
                  } else { 
                    return d.data; 
                  }
                } 
                return ""; 
              })
	.style("fill-opacity", 1)
	.attr("onmouseover","evt.target.parentNode.getElementsByClassName('popup')[0].setAttribute('style','opacity: 1');")
    .attr("onmouseout","evt.target.parentNode.getElementsByClassName('popup')[0].setAttribute('style','opacity: 0');");
  
  
  var popup = nodeEnter.append("svg:g");
  popup.attr("class", "popup")
  .style("opacity", 0)
  .append("svg:rect")
  .attr("class","popupRect")
  .attr("x",10)
  .attr("y",10)
  .attr("rx",5)
  .attr("ry",5)
  .attr("width", 500)
  .attr("height", 20);
  

  popup.append("svg:text")
     .attr("x",15)
     .attr("y",20)
     .attr("dy", ".35em")
     .attr("class","popupTxt")
     .text(function(d) { 
                if (d.data) { 
                	if (d.data.length > 100) {
                        return d.data.substring(0,100) + "..."; 
                      } else { 
                        return d.data; 
                      }
                } 
                return ""; 
              });
     
     
  
  
  var nodeChange = node.selectAll("text.data")
      .text(function(d) {if (d.data) {if (d.data.length > 20) {return d.data.substring(0,20) + "..."; } else { return d.data; }} return "";});
  var popupChange = node.selectAll("text.popupTxt")
      .text(function(d) { 
    	  if (d.data) { 
    		  if (d.data.length > 100) {
    			  return d.data.substring(0,100) + "..."; 
    		  } else { 
    			  return d.data; 
    		  }
    	  } 
    	  return ""; 
      });
  
  if (popup.select("text.popupTxt").node() !== null) {
     popup.select("rect.popupRect").attr("width", popup.select("text.popupTxt").node().getComputedTextLength() + 20);
  }
  //need to resize the red box
  
  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);
  
  nodeUpdate.select("text.popup")
      .style("fill-opacity", 1e-6);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = vis.selectAll("path.link")
      .data(tree.links(nodes), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("svg:path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
    .transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children.
function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}


function addNode(topic, body) {
	var parts = topic.split("/");
	if (root.children[0]===undefined){
		newnode = {"name": parts.shift(), "children":[]};
		root.children = [newnode];
		walk(parts,newnode,body);
	} else {
		walk(parts,root,body);
	}
	update(root);
}

function walk(parts, node, body) {
	if (parts.length != 0) {
		var current = parts.shift();
		if (node.children && node.children.length != 0) {
			//console.log("walking old");
			var z=0;
			for(z=0; z < node.children.length; z++) {
				//console.log(node.children[z].name + " - " + current);
				if (node.children[z].name == current) {
					//console.log("found");
					walk(parts,node.children[z], body);
					break;
				}
			}
			//console.log("done loop - " + z + ", " + node.children.length);
			if (z == node.children.length) {
				//console.log("adding new");
				var newnode = {"name": current, "children":[]};
				node.children.push(newnode);
				walk(parts,node.children[z],body);
			}
		} else if (node._children && node._children.length != 0) {
			//console.log("walking hidden");
			var z=0;
			for(z=0; z < node._children.length; z++) {
				//console.log(node._children[z].name + " - " + current);
				if (node._children[z].name == current) {
					//console.log("found");
					walk(parts,node._children[z], body);
					break;
				}
			}
			//console.log("done hidden loop - " + z + ", " + node._children.length);
			if (z == node._children.length) {
				//console.log("adding new hidden");
				var newnode = {"name": current, "_children":[]};
				node._children.push(newnode);
				walk(parts,node._children[z],body);
			}
		}else {
			//console.log("empty");
			newnode = {"name": current, "children":[]};
			node.children = [newnode];
			walk(parts,node.children[0],body);
		}
	} else {
		//console.log("body");
		node.data = body;
		node.dirty = true;

	}
}
