# Pris

Key value pair based deep linking module.

## Setup

Simply include the **pris.js** script file and use the API.

### Example

```javascript
PRIS.set('bad', 'dudes');  
PRIS.get('bad');
```

## API

* **set** (key, value)  
  Store a key/value pair in the hash.  
    * key (String or Number)  
    * value (String or Number)  
* **get** (key)  
  Get a stored value for the given key.
    * key (String or Number)
* **remove** (key)  
  Remove the specified key/value pair.
    * key (String or Number)
* **bind** (callback, scope)  
  Bind a callback to hash change.  
    * callback (Function)
    * scope (Object, optional)
* **unbindAll**  
  Unbind all callbacks to hash change.

## Browser Compatibility
