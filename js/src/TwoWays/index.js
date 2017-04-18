import * as polyfill     from './util/polyfill';
import defaults          from './defaults';
import merge             from './util/extend';
import is                from './util/is';
import hash              from './util/hash';
import builtinDirectives from './built-in/directives';
import makeGetter        from './util/makeGetter';

export default class TwoWays{
  get defaults(){ return defaults                     }
  get scope(){   return this._scope                   }
  get config(){  return merge(true, {}, this._config) }

  constructor(scope, config = {}){
    if(!is(config).pojo()) throw new Error("Config musts be a plain JS object");

    this._scope   = {};
    this._config  = merge(this.defaults, config||{});
    this._lastSum = hash(this._scope);
    builtinDirectives.forEach(builtin => registerBuiltin.call(this, builtin));
    this._watchHandle = requestAnimationFrame(() => this.watchForChanges());
    this._scope = scope;
  }

  watchForChanges(){
    var currentHash = hash(this._scope);
    if(currentHash !== this._lastSum)
    {
      this.notifyChanged();
    }

    this._lastSum     = currentHash;
    this._watchHandle = requestAnimationFrame(() => this.watchForChanges());
  }

  notifyChanged(){
    var currentHash = hash(this._scope);
    if(currentHash !== this._lastSum)
    {
      this._config.subscribers.forEach(fn => fn(this._scope));
    }
  }

  subscribe(fn, prop=null){
    let listener = fn;
    if(prop)
    {
      listener = (scope) => fn(makeGetter(prop)(scope));
    }
    this._config.subscribers.push(listener);
  }
}


function registerBuiltin(builtin)
{
    if(!this[builtin.directive])
    {
        this[builtin.directive] = builtin.getInstance(this);
        this[builtin.directive].init(this);
    }
}
