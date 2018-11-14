bootstrap-react-numeric-up-down
===============================

Installation
------------

```bash
npm install bootstrap-react-numeric-up-down
```

Optionally:

```bash
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
```

Usage
-----

```jsx
import NumericUpDown from 'bootstrap-react-numeric-up-down';

export default function MyComponent({value, min, max, step, ...otherProps}) {
    return (
        <NumericUpDown value={value} min={min} max={max} step={step} {...otherProps} />
    );
};
```

Properties
----------

| name                          | type                                | default                                                                         | description                                                                                                                                   |
|-------------------------------|-------------------------------------|---------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| inputColor                    | string?                             | `null`                                                                          | The bootstrap theme for coloring the `<input>`.                                                                                               |
| iconColor                     | string?                             | `null`                                                                          | The bootstrap theme for coloring the button icons.                                                                                            |
| min                           | (number\|string)?                   | `-Infinity`                                                                     | The `min` value applied to the `<input>`.                                                                                                     |
| max                           | (number\|string)?                   | `Infinity`                                                                      | The `max` value applied to the `<input>`.                                                                                                     |
| step                          | (number\|string)?                   | `1`                                                                             | The `step` value applied to the `<input>`.                                                                                                    |
| minusIcon                     | (string\|element\|object)?          | `faMinusCircle` if @fortawesome optional dependencies are installed, else `'-'` | The text or icon to use for the minus button.                                                                                                 |
| plusIcon                      | (string\|element\|object)?          | `faPlusCircle` if @fortawesome optional dependencies are installed, else `'+'`  | The text or icon to use for the minus button.                                                                                                 |
| disabled                      | bool?                               | `false`                                                                         | The `disabled` property assigned to the `<input>`.  If set, also disabled the plus and minus buttons.                                         |
| value                         | (number\|string)?                   | `undefined`                                                                     | The `value` property applied the `<input>`.                                                                                                   |
| onChange                      | function?                           | `undefined`                                                                     | The callback called when the value of the `<input>` changes.                                                                                  |
| inputAlign                    | `'left'` \| `'center'` \| `'right'` | `'center'`                                                                      | The text-alignment of the `<input>`.                                                                                                          |
| allowManualInputWithNaNBounds | boolean?                            | `false`                                                                         | By default, if the `min` is greater than the `max`, the  `<input>` is disabled.  If set, it will not be disabled. (Your mileage may vary.)    |

Sorry I don't have time to add better explanations for the functionality.