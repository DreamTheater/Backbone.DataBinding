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
<form id="userProfile">
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
var userProfile = new Backbone.View({
    el: '#userProfile',
    model: user
});
```

### Add bindings
#### model.binding(event, selector, binding, [options])
```js
userProfile.binding('change', '[name="email"]', 'value:email', { validate: true });
userProfile.binding('change', '[name="activated"]', 'checked:activated');
userProfile.binding('change', '[name="gender"]', 'checked:gender');
userProfile.binding('change', '[name="status"]', 'value:status');
userProfile.binding('change', '[name="interests"]', 'checked:interests');
userProfile.binding('change', '[name="notes"]', 'value:notes');
```

## Changelog
### 0.1.1
  - Method `addBinding` renamed to `binding`

### 0.1.0
  - Initial release
