d3-MQTT-Topic-Tree
==================

A MQTT Topic Tree viewer using the d3 collapsable tree and MQTT over websockets

-- d3
The Collapasable tree orginally came from here:
http://mbostock.github.io/d3/talk/20111018/tree.html

I've wrapped it with a little code to allow for dynamically adding nodes and to add the topic segments to each node.

-- index-mq.html
This version of the example uses the IBM WebSphere MQ MQTT Javascript client library to connect to a broker via websockets. I have not included the library for licensing reasons, but you can find a copy to play with as part of this bundle:

http://www-01.ibm.com/common/ssi/cgi-bin/ssialias?infotype=AN&subtype=CA&htmlfid=897/ENUS213-121&appname=USN

-- index.mosquitto.html
This version uses mosquitto-1.1.js client library from here:
http://mosquitto.org/download/

You can use lighttpd with the websockets module to proxy websocket requests for mosquitto. You can find details of how to  build lighttpd with the required module here:
https://github.com/nori0428/mod_websocket 
