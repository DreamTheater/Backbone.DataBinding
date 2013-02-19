[lnk]: https://travis-ci.org/DreamTheater/Backbone.DataBinding
[img]: https://secure.travis-ci.org/DreamTheater/Backbone.DataBinding.png

# Backbone.DataBinding [![Build Status][img]][lnk]
The plugin is for bidirectional binding between views and models.

**Dependencies:**

  - [Backbone](https://github.com/documentcloud/backbone) `>= 0.9.10`
  - [Underscore](https://github.com/documentcloud/underscore) `>= 1.4.4`

## Getting started
### Create model
```js
var user = new Backbone.Model({
    email: 'dnemoga@gmail.com',
    activated: true,
    gender: 'MALE',
    status: 'SINGLE',
    interests: ['MOVIES', 'MUSIC'],
    notes: 'I like JavaScript!'
});
```

### Create view
```html
<form id="profile">
    <input type="text" name="email">

    <input type="checkbox" name="activated">

    <input type="radio" name="gender" value="MALE">
    <input type="radio" name="gender" value="FEMALE">

    <select name="status">
        <option value="SINGLE">Single</option>
        <option value="MARRIED">Married</option>
    </select>

    <select name="interests" multiple>
        <option value="BOOKS">Books</option>
        <option value="MUSIC">Music</option>
        <option value="MOVIES">Movies</option>
        <option value="DANCES">Dances</option>
        <option value="SPORT">Sport</option>
    </select>

    <textarea name="notes"></textarea>
</form>
```

```js
var profile = new Backbone.View({
    el: '#profile',
    model: user
});
```

### Add bindings
#### model.binding(event, selector, binding, [options])
```js
profile.binding('change', '[name="email"]', 'value:email', { validate: true });
profile.binding('change', '[name="activated"]', 'checked:activated');
profile.binding('change', '[name="gender"]', 'checked:gender');
profile.binding('change', '[name="status"]', 'value:status');
profile.binding('change', '[name="interests"]', 'value:interests');
profile.binding('change', '[name="notes"]', 'value:notes');
```

## Changelog
### 0.1.2
  - Methods `delegateBindings` and `undelegateBindings` is public

### 0.1.1
  - Method `addBinding` renamed to `binding`

### 0.1.0
  - Initial release
