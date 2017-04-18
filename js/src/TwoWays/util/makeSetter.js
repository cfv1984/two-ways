export default function makeSetter(expr){
   return new Function('ctx', 'newVal', 'done', `
    ctx.${expr} = newVal;
    done();
   `);
}
