// const optionalRequire = require("optional-require")(require),
//     reactFontAwesome = optionalRequire('@fortawesome/react-fontawesome'),
//     core = optionalRequire('@fortawesome/fontawesome-svg-core'),
//     fas = optionalRequire('@fortawesome/free-solid-svg-icons');

// export const FontAwesomeIcon = reactFontAwesome && reactFontAwesome.FontAwesomeIcon,
//     faMinusCircle = fas && fas.faMinusCircle, 
//     faPlusCircle = fas && fas.faPlusCircle;

// if (core) {
//     core.library.add(fas.faMinusCircle, fas.faPlusCircle);
// }

const IconDefElTypes = [
    Number,
    Number,
    el => Array.isArray(el) && el.every(str => str && str.constructor === String),
    String,
    String
];

export function mightBeFAIcon(obj) {
    if (!obj) {
        return false;
    }

    if (obj.constructor === String) {
        return /^[a-z0-9][a-z0-9\-]*$/i.test(obj);
    }

    if (Array.isArray(obj)) {
        return obj.every(str => str.constructor === String);
    }

    if (!(obj instanceof Object) || !obj.iconName) {
        return false;
    }
    
    switch (obj.prefix) {
        case 'fas':
        case 'far':
        case 'fab':
            break;

        default: 
            return false;
    }

    let iconDef = obj.icon;

    if (!Array.isArray(iconDef) || iconDef.length !== 5) {
        return false;
    }

    return iconDef.every((val, idx) => {
        if (idx === 2) {
            return IconDefElTypes[2](val);
        } else {
            return val && val.constructor === IconDefElTypes[idx];
        }
    });
}