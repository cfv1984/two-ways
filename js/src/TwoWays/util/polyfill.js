if(![].map)
{
  Array.prototype.map = function(fn)
  {
    var buffer = [];
    for(var i=0,j=this.length;i<j;i++)
    {
      buffer[i] = fn(this[i], i, this);
    }
    return buffer;
  };
}

if(![].forEach)
{
  Array.prototype.forEach = function(fn){
    this.map(fn);
  };
}

if(![].filter)
{
    Array.prototype.filter = function(fn)
    {
      var buffer = [];
      this.forEach(function(el,pos,all){
        if(fn(el, pos, all)){ buffer.push(el) }
      });
      return buffer;
    }
}

if(!Object.keys)
{
  Object.keys = function(obj)
  {
    var buffer = [];
    for(var k in obj){ buffer.push(k) }
    return buffer;
  }
}
if(!Object.getOwnPropertyNames)
{
  Object.getOwnPropertyNames = function()
  {
    Object.keys = function(obj){
      var buffer = [];
      for(var k in obj){ buffer.push(k) }
      return buffer;
    }
  }
}

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}
