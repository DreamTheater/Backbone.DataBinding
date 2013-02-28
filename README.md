[lnk]: https://travis-ci.org/DreamTheater/Backbone.DataBinding
[img]: https://secure.travis-ci.org/DreamTheater/Backbone.DataBinding.png

# Backbone.DataBinding [![Build Status][img]][lnk]
The plugin is for bidirectional binding between views and models.

**Dependencies:**

  - [Backbone](https://github.com/documentcloud/backbone) `>= 0.9.10`
  - [Underscore](https://github.com/documentcloud/underscore) `>= 1.4.4`

## Reference API
### Backbone.ViewModel
#### Static members
  - Object `readers`
    - Function `html`
    - Function `text`
    - Function `value`
    - Function `checked`
  - Object `writers`
    - Function `html`
    - Function `text`
    - Function `value`
    - Function `checked`

#### Instance members
  - Function `binding(event, selector, binding, options)`
    - String `event`
    - String `selector`
    - String `binding`
    - Object `options`
  - Function `delegateBindings(bindings)`
    - Object `bindings`
  - Function `undelegateBindings()`
  - Function `syncToModel()`

### Backbone.ViewCollection
#### Instance members
  - Function `get(object)`
    - Object `object`
  - Function `at(index)`
    - Number `index`

## Getting Started
### Create model
```js
var user = new Backbone.Model({
    email: 'dnemoga@gmail.com',
    gender: 'MALE',
    status: 'SINGLE',
    hasChildren: false,
    favoriteDaysOfWeek: ['FRIDAY', 'SATURDAY'],
    favoriteColors: ['RED', 'BLUE', 'VIOLET'],
    notes: 'I like JavaScript!'
});
```

### Create view of model
```html
<form id="profile">
    <input type="text" name="email">

    <input type="radio" name="gender" value="MALE">
    <input type="radio" name="gender" value="FEMALE">

    <select name="status">
        <option value="SINGLE">Single</option>
        <option value="MARRIED">Married</option>
    </select>

    <input type="checkbox" name="hasChildren">

    <select name="favoriteDaysOfWeek" multiple>
        <option value="MONDAY">Monday</option>
        <option value="TUESDAY">Tuesday</option>
        <option value="WEDNESDAY">Wednesday</option>
        <option value="THURSDAY">Thursday</option>
        <option value="FRIDAY">Friday</option>
        <option value="SATURDAY">Saturday</option>
        <option value="SUNDAY">Sunday</option>
    </select>

    <input type="checkbox" name="favoriteColors" value="RED">
    <input type="checkbox" name="favoriteColors" value="ORANGE">
    <input type="checkbox" name="favoriteColors" value="YELLOW">
    <input type="checkbox" name="favoriteColors" value="GREEN">
    <input type="checkbox" name="favoriteColors" value="BLUE">
    <input type="checkbox" name="favoriteColors" value="INDIGO">
    <input type="checkbox" name="favoriteColors" value="VIOLET">

    <textarea name="notes"></textarea>
</form>
```
```js
var profile = new Backbone.ViewModel({
    el: '#profile',
    model: user
});
```

### Define bindings
```js
profile.binding('change', '[name="email"]', 'value:email', { validate: true });
profile.binding('change', '[name="gender"]', 'checked:gender');
profile.binding('change', '[name="status"]', 'value:status');
profile.binding('change', '[name="hasChildren"]', 'checked:hasChildren');
profile.binding('change', '[name="favoriteDaysOfWeek"]', 'value:favoriteDaysOfWeek');
profile.binding('change', '[name="favoriteColors"]', 'checked:favoriteColors');
profile.binding('change', '[name="notes"]', 'value:notes');
```

## Changelog
### 0.1.7
  - Properties `readers` and `writers` is static

### 0.1.6
  - Removed CommonJS support
  - Databinding moved to `Backbone.ViewModel` class
  - Added `Backbone.ViewCollection` class

### 0.1.3
  - Added CommonJS support

### 0.1.2
  - Methods `delegateBindings` and `undelegateBindings` is public

### 0.1.1
  - Method `addBinding` renamed to `binding`

### 0.1.0
  - Initial release
