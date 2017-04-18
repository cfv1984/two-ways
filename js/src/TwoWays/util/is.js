export default function(obj){
  const undef   = () =>  typeof(obj) == 'undefined';
  const pojo    = () => !undef() && obj.constructor === Object;
  const array   = () => !undef() && obj instanceof Array;

  return {
    undef, pojo, array
  }
}
