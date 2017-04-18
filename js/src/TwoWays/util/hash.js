module.exports = function hash(o){
  var str =  JSON.stringify(o, function(k, v){
    if(!!k && v === o)        return null;
    if(v instanceof RegExp)   return v.toString();
    if(v instanceof Function) return v.toString();
    return v;
  });


  var hash = 5381,
      index = str.length;

  while (index) {
      hash = (hash * 33) ^ str.charCodeAt(--index);
  }

  return (hash >>> 0).toString(32);

  return hash;
}
