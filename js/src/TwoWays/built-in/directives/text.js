import {BaseDirective} from './base';
import makeGetter      from './../../util/makeGetter';
import merge           from './../../util/extend';

console.log(BaseDirective);

class TextDirective extends BaseDirective
{
  constructor(glueInstance){
    super(glueInstance, 'text');
  }

  update(newVal){
    [].slice.call(document.querySelectorAll(`[${this.directiveAttribute}]`))
      .forEach(n => {
        n[this.expandoId] = n[this.expandoId] || {onEachBlock:null, prevVal:null};
        const expressionValue = makeGetter(n.getAttribute(this.directiveAttribute));
        if(!isOnEachBlock.call(this, n))
        {
          return setTextNormally.call(this, expressionValue, n);
        }
        return setTextInScope.call(this, expressionValue, n);
      });
  }
}

TextDirective.directive = "TextDirective";
TextDirective.getInstance = (config = {}) => new TextDirective(config);

function setTextNormally(getter, node)
{
  let val = getter(this._glue.scope);
  if(val != node[this.expandoId].prevVal)
  {
    node[this.expandoId].prevVal = val;
    node.innerHTML = val;
  }
}

function setTextInScope(getter, node)
{
  let val = getter(node[this._glue.EachDirective.expandoId]);
  if(val != node[this.expandoId].prevVal)
  {
    node[this.expandoId].prevVal = val;
    node.innerHTML = val;
  }
}

function isOnEachBlock(node)
{
  return node[this._glue.EachDirective.expandoId];
}


module.exports = TextDirective;
