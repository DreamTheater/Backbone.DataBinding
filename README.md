[npm-badge]: https://badge.fury.io/js/backbone.databinding.png
[npm-link]: https://badge.fury.io/js/backbone.databinding

[travis-badge]: https://secure.travis-ci.org/DreamTheater/Backbone.DataBinding.png
[travis-link]: https://travis-ci.org/DreamTheater/Backbone.DataBinding

# Backbone.DataBinding [![NPM Version][npm-badge]][npm-link] [![Build Status][travis-badge]][travis-link]
The plugin implements a bidirectional data binding between views and models/collections.

**Dependencies:**

  - [Backbone](https://github.com/documentcloud/backbone) `>= 1.0.0`
  - [Underscore](https://github.com/documentcloud/underscore) `>= 1.5.1`

## Getting Started
### Create view and model
Define the view and the model. They should be an instances of `Backbone.View`/`Backbone.Model` or their inheritors.
```js
var view = new Backbone.View(), model = new Backbone.Model();
```

### Create model binder
`Backbone.ModelBinder` is a decorator. Just pass the view and the model into constructor of class to getting started.
```js
var modelBinder = new Backbone.ModelBinder(view, model);
```

### Define bindings
Use `modelBinder.define(binding, options)` method to define bindings between your view and model. If you want to define a lot of bindings in one action use `modelBinder.define(bindings)` option.

#### Binding types
##### Type `html`
```html
<output name="output-html"></output>
```
```js
modelBinder.define('html: output-html', {
    selector: '[name="output-html"]'
});

model.set('output-html', 'HTML');
```

##### Type `text`
```html
<output name="output-text"></output>
```
```js
modelBinder.define('text: output-text', {
    selector: '[name="output-text"]'
});

model.set('output-text', 'Text');
```

##### Type `value`
###### Text input
```html
<input type="text" name="text-input-value">
```
```js
modelBinder.define('value: text-input-value', {
    selector: '[name="text-input-value"]'
});

model.set('text-input-value', 'Value');
```

###### Text area
```html
<textarea name="textarea-value"></textarea>
```
```js
modelBinder.define('value: textarea-value', {
    selector: '[name="textarea-value"]'
});

model.set('textarea-value', 'Text');
```

###### Single select
```html
<select name="single-select-value">
    <option value="A">Option A</option>
    <option value="B">Option B</option>
</select>
```
```js
modelBinder.define('value: single-select-value', {
    selector: '[name="single-select-value"]'
});

model.set('single-select-value', 'A');
```

###### Multiple select
```html
<select name="multiple-select-value" multiple>
    <option value="A">Option A</option>
    <option value="B">Option B</option>
</select>
```
```js
modelBinder.define('value: multiple-select-value', {
    selector: '[name="multiple-select-value"]'
});

model.set('multiple-select-value', ['A', 'B']);
```

##### Type `checked`
###### Single checkbox
```html
<input type="checkbox" name="single-checkbox-input-checked">
```
```js
modelBinder.define('checked: single-checkbox-input-checked', {
    selector: '[name="single-checkbox-input-checked"]'
});

model.set('single-checkbox-input-checked', true);
```

###### Multiple checkboxes
```html
<input type="checkbox" name="multiple-checkbox-input-checked" value="A">
<input type="checkbox" name="multiple-checkbox-input-checked" value="B">
```
```js
modelBinder.define('checked: multiple-checkbox-input-checked', {
    selector: '[name="multiple-checkbox-input-checked"]'
});

model.set('multiple-checkbox-input-checked', ['A', 'B']);
```

###### Radio buttons
```html
<input type="radio" name="radio-input-checked" value="A">
<input type="radio" name="radio-input-checked" value="B">
```
```js
modelBinder.define('checked: radio-input-checked', {
    selector: '[name="radio-input-checked"]'
});

model.set('radio-input-checked', 'A');
```

##### Type `visible`
```html
<button type="button" name="button-visible">Visible</button>
```
```js
modelBinder.define('visible: button-visible', {
    selector: '[name="button-visible"]'
});

model.set('button-visible', true);
```

##### Type `hidden`
```html
<button type="button" name="button-hidden">Hidden</button>
```
```js
modelBinder.define('hidden: button-hidden', {
    selector: '[name="button-hidden"]'
});

model.set('button-hidden', true);
```

##### Type `enabled`
```html
<button type="button" name="button-enabled">Enabled</button>
```
```js
modelBinder.define('enabled: button-enabled', {
    selector: '[name="button-enabled"]'
});

model.set('button-enabled', true);
```

##### Type `disabled`
```html
<button type="button" name="button-disabled">Disabled</button>
```
```js
modelBinder.define('disabled: button-disabled', {
    selector: '[name="button-disabled"]'
});

model.set('button-disabled', true);
```

#### Option `selector`
Specify selector to find element in the view's DOM tree. Leave selector empty to bind attribute to the root element of the view.
```js
modelBinder.define('...', {
    selector: 'div.foo' // Any jQuery selector
});
```

#### Option `event`
Specify events that you want to listen (by default equal to `'change'`).
```js
modelBinder.define('...', {
    event: 'change input keyup' // Space separated event list
});
```

#### Options `getter` and `setter`
If you want to define one-way binding you can disable `getter` (view-to-model binding) or `setter` (model-to-view binding).
```js
modelBinder.define('...', {
    getter: false // In this case the model will not synchronizes with the element
});
```
```js
modelBinder.define('...', {
    setter: false // In this case the element will not synchronizes with the model
});
```

### Create view and collection
Define the view and the collection. They should be an instances of `Backbone.View`/`Backbone.Collection` or their inheritors.
```js
var view = new Backbone.View(), collection = new Backbone.Collection();
```

### Create collection binder
`Backbone.CollectionBinder` is a decorator. Just pass the view and the collection into constructor of class to getting started. Don't forget about options.
```js
var collectionBinder = new Backbone.CollectionBinder(view, collection, {
    view: Backbone.View.extend({ ... }),
    dummy: Backbone.View.extend({ ... }),

    selector: '...'
});
```

#### Option `view`
It should be an instance of `Backbone.View` or its inheritor. It will represent each model in collection.

#### Option `dummy`
It should be an instance of `Backbone.View` or its inheritor. It will used in case if collection is empty and no items to be shown.

#### Option `selector`
If specified, views will be inserted into element corresponding this selector. If not, views will be inserted just to the root element of the view.

### Start listening
By default `Backbone.CollectionBinder` listens four collection events: `add`, `remove`, `reset` and `sort`.
```js
collectionBinder.listen();
```

If you don't want to listen some events you should use an additional options.
```js
collectionBinder.listen({
    sort: false // In this case DOM will not react on collection's sorting
});
```

## Changelog
### 0.4.0
  - `Backbone.ModelBinder` and `Backbone.CollectionBinder` configures with any model/collection

### 0.3.9
  - Fixed `checked` binding
  - Using `attr()` instead of `prop()` for standard bindings

### 0.3.7
  - Renaming `types` to `handlers`
  - Method `refresh` moved from view to binders
  - Removed backward reference to binders

### 0.3.4
  - Fixed `visible`, `hidden`, `enabled`, `disabled` bindings

### 0.3.3
  - Plugin implemented as decorator, not a class
  - Readers and writers merged into types
  - Added new binding types `hidden`, `enabled`, `disabled`
  - A lot of fixes

### 0.2.9
  - Readers and writers runs in context `this`
  - Added binding type `visible`

### 0.2.7
  - Method `reset` renamed to `syncToCollection`
  - Changed signature of method `binding`

### 0.2.5
  - Added public method `reset` for refreshing a list manually

### 0.2.4
  - Added views allocation inside the root element

### 0.2.3
  - Methods `sort` and `reset` are private

### 0.2.2
  - `ViewCollection` is sortable
  - Method `reset` is public
  - Removed binding type `data`

### 0.1.9
  - Items removes via collection's listener and not model's
  - Added binding type `data`

### 0.1.7
  - Properties `readers` and `writers` are static

### 0.1.6
  - Removed CommonJS support
  - Databinding moved to `Backbone.ViewModel` class
  - Added `Backbone.ViewCollection` class

### 0.1.3
  - Added CommonJS support

### 0.1.2
  - Methods `delegateBindings` and `undelegateBindings` are public

### 0.1.1
  - Method `addBinding` renamed to `binding`

### 0.1.0
  - Initial release
