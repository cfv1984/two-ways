class BaseDirective
{
  get expandoId(){ return this._expandoId }
  get directiveAttribute(){ return this._directiveAttr }

  constructor(glueInstance, directiveName)
  {
    if(!directiveName){ throw new Error("This directive doesn't have a name"); }

    this._glue   = glueInstance;
    this._config = glueInstance.config;
    this._scope  = glueInstance.scope;
    this._expandoId = '__id-'
      + Date.now()
      + Math.floor(Math.random()*1024)
      + Math.floor(Math.random()*1024)
      + Math.floor(Math.random()*1024);
      this._directiveAttr = this._config.namespace + '-' + directiveName;
  }

  init(glueInstance)
  {
    this._glue.subscribe((newVal) => this.update(newVal));
  }

  update()
  {
    throw new Error("Unimplemented!");
  }
}

BaseDirective.directive = "BaseDirective";

BaseDirective.getInstance = (config = {})=> new BaseDirective(config);

module.exports = BaseDirective;
