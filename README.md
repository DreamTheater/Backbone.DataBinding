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
    interests: ['MOVIE', 'MUSIC']
});
```

### Create view
```html
<form name="userProfile">
    <input type="text" name="email">

    <input type="checkbox" name="activated">

    <input type="radio" name="gender" value="MALE">
    <input type="radio" name="gender" value="FEMALE">

    <select name="status">
        <option value="SINGLE">Single</option>
        <option value="MARRIED">Married</option>
    </select>

    <input type="checkbox" name="interests" value="MOVIE">
    <input type="checkbox" name="interests" value="MUSIC">
    <input type="checkbox" name="interests" value="SPORT">
    <input type="checkbox" name="interests" value="DANCE">
</form>
```

```js
var userProfile = new Backbone.View({
    el: '[name="userProfile"]',
    model: user
});
```

### Add bindings
#### model.addBinding(event, selector, binding, [options])
```js
userProfile.addBinding('change', '[name="email"]', 'value:email', { validate: true });
userProfile.addBinding('change', '[name="activated"]', 'checked:activated');
userProfile.addBinding('change', '[name="gender"]', 'checked:gender');
userProfile.addBinding('change', '[name="status"]', 'value:status');
userProfile.addBinding('change', '[name="interests"]', 'checked:interests');
```

## Changelog
### 0.1.0
  - Initial release
