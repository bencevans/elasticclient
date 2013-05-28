elasticclient
=============

js elasticsearch client

```javascript
var elastic = require('elasticclient');

var es = elastic();
// defaults to
// var es = elastic(9200, 'localhost');
// where
// var es = elastic(port, host);

// search at different levels
es.search(query, callback);
es.index('twitter').search(query, callback);
es.index('twitter').type('tweet').search(query, callback);

// search using query string
es.search('hello world', function(err, res, hits) {
  console.log(hits);
});

// search using ElasticSearch JSON query format
es.search({
  query: {
    filtered: {
      query: {
        query_string: {
          query: 'some query string here'
        }
      },
      filter: {
        term: { 'user' : 'kimchy' }
      }
    }
  }
}, function(err, res, hits) {
  console.log(hits);
});
```