[lnk]: https://travis-ci.org/DreamTheater/Backbone.DataBinding
[img]: https://secure.travis-ci.org/DreamTheater/Backbone.DataBinding.png

# Backbone.DataBinding [![Build Status][img]][lnk]
The plugin is for bidirectional binding between views and models.

**Dependencies:**

  - [Backbone](https://github.com/documentcloud/backbone) `>= 1.0.0`
  - [Underscore](https://github.com/documentcloud/underscore) `>= 1.4.4`

## Reference API
### Backbone.ViewModel
#### Static members
  - Object `readers`
    - Function `html` - Gets an inner HTML value of the element. Returns the string.
    - Function `text` - Gets an inner HTML value of the element, escaping HTML characters. Returns the string.
    - Function `value` - Gets a value of the element. Returns the string.
    - Function `checked` - Gets a value of the element (applicable only to `checkbox` and `radio` types). Returns the boolean, string or array of strings when multiple elements.
  - Object `writers`
    - Function `html` - Assigns an inner HTML value to the element.
    - Function `text` - Assigns an inner HTML value to the element, escaping HTML characters.
    - Function `value` - Assigns a value to the element.
    - Function `checked` - Assigns a value to the element (applicable only to `checkbox` and `radio` types).

#### Instance members
  - Function `binding(selector, binding, event, options)`
    - String `selector` - Selector string to filter the descendants of the selected elements that trigger the event. If the selector is `null`, the event is always triggered when it reaches the selected element.
    - String `binding` (`type:attribute`)
      - `type` - Binding type (e. g. `html`, `text`, `value`, `checked` or any other HTML attribute).
      - `attribute` - Model's attribute that would be linked to this element.
    - String `event` - Event type (e. g. `change`, `input`).
    - Object `options` - Object that would be passed as the argument `options` to the method `set` each time when value sets to the model (e. g. `{ validate: true }` to validate current value).
  - Function `delegateBindings(bindings)`
    - Object `bindings`
  - Function `undelegateBindings()`
  - Function `syncToModel()`

### Backbone.ViewCollection
#### Instance members
  - Backbone.ViewModel `view`
  - Function `get(object)`
    - Object `object`
  - Function `at(index)`
    - Number `index`
  - Function `syncToCollection()`

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

### Create view
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

    <select name="favoriteDaysOfWeek[]" multiple>
        <option value="MONDAY">Monday</option>
        <option value="TUESDAY">Tuesday</option>
        <option value="WEDNESDAY">Wednesday</option>
        <option value="THURSDAY">Thursday</option>
        <option value="FRIDAY">Friday</option>
        <option value="SATURDAY">Saturday</option>
        <option value="SUNDAY">Sunday</option>
    </select>

    <input type="checkbox" name="favoriteColors[]" value="RED">
    <input type="checkbox" name="favoriteColors[]" value="ORANGE">
    <input type="checkbox" name="favoriteColors[]" value="YELLOW">
    <input type="checkbox" name="favoriteColors[]" value="GREEN">
    <input type="checkbox" name="favoriteColors[]" value="BLUE">
    <input type="checkbox" name="favoriteColors[]" value="INDIGO">
    <input type="checkbox" name="favoriteColors[]" value="VIOLET">

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
profile.binding('[name="email"]', 'value:email', 'change', { validate: true });
profile.binding('[name="gender"]', 'checked:gender', 'change');
profile.binding('[name="status"]', 'value:status', 'change');
profile.binding('[name="hasChildren"]', 'checked:hasChildren', 'change');
profile.binding('[name="favoriteDaysOfWeek[]"]', 'value:favoriteDaysOfWeek', 'change');
profile.binding('[name="favoriteColors[]"]', 'checked:favoriteColors', 'change');
profile.binding('[name="notes"]', 'value:notes', 'change');
```

## Changelog
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
