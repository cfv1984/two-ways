import BaseDirective from './base';
import makeGetter    from '../../util/makeGetter';
import makeSetter    from '../../util/makeSetter';

class EachDirective extends BaseDirective
{
  constructor(glueInstance){
    super(glueInstance, 'each');
  }

  update(newVal){
    var bindings = [].slice.call(document.querySelectorAll(`[${this.directiveAttribute}]`))
      .forEach(n => {
        let expression   = n.getAttribute(this.directiveAttribute),
            result       = makeGetter(expression)(this._glue.scope),
            frag         = document.createDocumentFragment(),
            expanded     = result
              .forEach(($item, $pos, $all) => {
                aggregateMarkup.call(this, frag, n, $item, $pos, $all)
              });
            n.parentNode.replaceChild(frag, n);
      });
  }
}

EachDirective.directive = "EachDirective";
EachDirective.getInstance = (config = {}) => new EachDirective(config);

function aggregateMarkup(docFragment, node, $item, $pos, $all)
{
  let child = firstChildElement(node).cloneNode();
  child[this.expandoId] = {$item, $pos, $all};
  docFragment.appendChild(child);
}

function valueWatcher(node, callback)
{
  if(!node) return;
  let old     = String(node.value),
      checker = function()
      {
        if(!node) return;
        if(old != String(node.value))
        {
          callback(node.value);
          old = String(node.value);
        }
        node[randomExpandoId].raf = requestAnimationFrame(checker);
      };
  node[randomExpandoId].raf = requestAnimationFrame(checker);
}

function appendChildren(parent, children)
{
  children.forEach(n => parent.appendChild(n));
}

function firstChildElement(n)
{
  for(var k of n.childNodes){
    if(k instanceof HTMLElement) return k;
  }
  return null;
}

module.exports = EachDirective;
