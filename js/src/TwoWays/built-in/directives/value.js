import {BaseDirective} from './base';
import {makeGetter}    from '../../util/makeGetter';
import {makeSetter}    from '../../util/makeSetter';

class ValueDirective extends BaseDirective
{
  constructor(glueInstance)
  {
    super(glueInstance, 'value');
  }

  update(newVal){
    let onEachTelltale = this._glue.EachDirective.directiveAttribute,
        bindings       = [].slice.call(document.querySelectorAll(`[${this.directiveAttribute}]`))
          .forEach(n => syncValue.call(this, n));
  }
}

ValueDirective.directive = "ValueDirective";
ValueDirective.getInstance = (config = {}) => new ValueDirective(config);

function syncValue(node)
{
  var expression   = node.getAttribute(this.directiveAttribute),
      result = makeGetter(expression)(this._glue.scope);
      node[this.expandoId] = node[this.expandoId] || {raf: -1,onEach:false};
      (node.value != result) && (node.value = result);

    if(node[this.expandoId].raf < 0)
    {
      let updateValue = (val) => makeSetter(expression)(
        this._glue.scope,
        ['number','range'].indexOf(node.type) > -1? parseInt(node.value, 10) : node.value,
        () => this._glue.notifyChanged()
      );
      valueWatcher(this.expandoId, node, updateValue);
    }
}

function valueWatcher(expandoId, node, callback)
{
  if(!node) return;
  var old     = String(node.value),
    checker   = function()
    {
      if(!node) return;
      if(old != String(node.value)){
        callback(node.value);
        old = String(node.value);
      }
      node[expandoId].raf = requestAnimationFrame(checker);
    };
  node[expandoId].raf = requestAnimationFrame(checker);
}

module.exports = ValueDirective;
