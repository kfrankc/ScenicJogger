var radius; // can be any value
var direction; // can be North, East, South, West

/*
1. Ask the user which general direction they would like to travel in.
2. Query Yelp for a list of landmarks within that radius. Remove landmarks that are not 
in the user-chosen direction.
3. Find the closest landmark to current location.
4. WHILE LOOP
  a. At each iteration, calculate Google Maps optimized path length. Stop when length is greater
    than the max travel distance, and remove that last-added landmark.
  b. At each current landmark, choose the closest landmark to that current landmark.
*/