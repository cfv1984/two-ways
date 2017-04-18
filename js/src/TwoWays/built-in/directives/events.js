import BaseDirective from './base';
import makeGetter    from '../../util/makeGetter';
import merge         from '../../util/extend';

export default class EventsDirective extends BaseDirective
{
  constructor(glueInstance){
    super(glueInstance, 'on');
  }

  init(glueInstance)
  {
    super.init(glueInstance);
    this._raf = requestAnimationFrame(() => bindToHandlers.call(this));
  }

  update(newVal) { return this }

}

EventsDirective.directive = "EventsDirective";
EventsDirective.getInstance = (config = {}) => new EventsDirective(config);

function bindToHandlers(){
  [].slice.call(document.querySelectorAll(`[${this.directiveAttribute}]`))
    .filter((n) => !n[this.expandoId])
    .map((n) => {
      let attributePairs = parseAttribute.call(this, n.getAttribute(this.directiveAttribute));
      return n[this.expandoId] = attributePairs.map(p => {
        return {
          evt: p[0],
          handler: makeGetter(p[1])(this._glue.scope),
          node: n
        }
      })
    })
    .forEach(bundle => {
      bundle.forEach(b => b.node.addEventListener(
        b.evt,
        (evt) => {
          b.handler.call(this._glue.scope, evt);
          this._glue.notifyChanged();
        }
      ))
    });
    this._raf = requestAnimationFrame(() => bindToHandlers.call(this));
}

function parseAttribute(attr){
  return attr.split(';')
    .map(a=>a.split(/:[\s]?/g))
    .map(s=>s.map(f=>String(f).trim()));
}
