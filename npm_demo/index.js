var _ = require('underscore');
// Node will try to resolve imports in this order:
// Core module?
// Local file or folder?
// node_modules?

var result = _.contains([1,2,3], 2);
console.log(result);
