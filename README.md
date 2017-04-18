# Two Ways

Just a one-and-two-way data binding library for browser Javascript

## Introduction 

It was apparently a pain to do two-way data binding for small projects without bringing an entire jungle of code around with this feature, so I built my own. It spans the entire document now, and uses a single object as a data source / scope, although both things might change in the future to simplify integration with other tools

## Basic Usage

There's a couple of steps involved in making use of **Two Ways** now. 

Include ```two-ways.js``` somewhere at the bottom of your document, or just ```import TwoWays from 'two-ways' ```if you're using some bundling software like browserify or webpack. 

Then make a new instance of the thing like

```javascript

var watchable = new TwoWays({
  property:  "value",
  arrayProp: [1,2,3,4],
  objProp:   {a:1,b:2},
  evtHandler:    function(e){e.preventDefault(); alert("Heyoo") }
});
```

And you're all set! To react to changes in the watchable you can do

``` javascript
watchable.subscribe((state) => console.log("This is the current state of the object", state))
```

Or if you're only interested in watching a specific property you can do

````javascript
watchable.subscribe((objProp) => console.log("objProp now", objProp), 'objProp');
````

This object can also be accessed through

```javascript
var propNow = watchable.scope.arrayProp;
```

*Warning: this will probably be soon moved upwards, straight to the watchable object.*

### Binding to HTML

The real reason you're here is probably to use this in conjunction with HTML. There are a couple of bindings, all by default prefixed by ```g-``` for no reason other than the library was originally called Glue and the namespace is now pretty much deserted. You can change this to anything else by passing a second object to the **TwoWays** constructor like so: ```new TwoWays({/**/}, {namespace: 'awesomesauce'})```.

I will use the ```g-``` prefix here as it's the default.

### Binding Text 

To bind some node's innerHTML to a variable, add a ```g-text="some.variable"``` attribute, where some.variable is the path to your text inside the watchable object. In this case, assume it's going to look like

```javascript
var watchable = new TwoWays({some: {variable: 'This is the text'}});
```

This will turn the innerHTML of your tag into ```This is the text```, or any future value this variable might hold too, as it's now bound to the watchable object. Of course this value can also be a function that produces fancier output, or even a small piece of Javascript rendering a string. 

### Binding Values

To bind some input's value to a variable, add a ```g-value="some.variable"``` attribute, which will accordingly sync your variable and this input throughout its life. 

Say you have a watchable like this one:

```javascript
var watchable = new TwoWays({some:{variable:3}});
```

And an input like:

```html
<input type="range" min="0" max="10" step="1" g-value="some.variable">
```

The initial value is going to wind up set as "3" and every time the range is set, the variable will hold the current value. Obviously, this can be used in conjunction to ```g-text``` to produce markup that reacts to this input.

### Other bindings

For RAD and no reason other than I actually needed these at the moment there's two other default bindings that you can attach, one for event handlers and one to render simple (not nested) lists of things.

#### Binding Events and Handlers

To add an event handler you can use ```g-on="click: some.handler"``` which is going to add an event handler on click right into that element. It is also possible to bind several handlers at once, like ```g-on="click: some.handler; touchstart: some.otherHandler"``` . The event handlers will be called with the watchable as first parameter, and executing them triggers a re-evaluation of the object's state, just in case you actually did change anything. 

#### Auto-rendering lists of things

There is a binding, ```g-each="arrayProp"``` which is both special and specially subject to change in the near future. It will repeat, for every thing inside an array, the first child it is holding, and give ```g-text``` a special behavior, adding magic variables called ```$item```,```$pos``` and ```$all``` just within the context of the ```g-each``` call.  

in practice this means that you can now do this

```html
        <ul g-each="example.listValues">
          <li g-text="$pos + '-' + $item"></li>
        </ul>
```

Although the value binding is not supported in context, and I have 0 idea if the event handler binding supports it either, as I have had no real need to support this yet. *Warning: Expect this to change in the near future*.

Any issues / PR's/criticism are super welcome! 





