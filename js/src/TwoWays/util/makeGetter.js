export default function makeGetter(expr){
  if(expr.indexOf('$') > -1){ //special case the fuck out of this
    expr = expr.replace(/\$/g,'scope.\$');
  }
  else{
    expr = 'scope.'+expr;
  }
   return new Function('scope', `return ${expr}`);
}
