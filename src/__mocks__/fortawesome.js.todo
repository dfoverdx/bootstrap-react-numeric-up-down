const fortawesome = jest.requireActual('../fortawesome'),
    mock = new Proxy(fortawesome, {
        get(target, prop, receiver) {
            switch (prop) {
                case 'FontAwesomeIcon':
                    if (!reactFontawesomeInstalled) {
                        return null;
                    }
                    break;
            }
    
            return Reflect.get(target, prop, receiver)
        }
    });

let reactFontawesomeInstalled = true,
    fasInstalled = true;

mock.__setReactFontawesomeInstalled = function (isInstalled) {
    reactFontawesomeInstalled = isInstalled;
}

// fortawesomeMock.__setfasInstalled = function (isInstalled) {
//     if (isInstalled) {
//         fortawesomeMock.faMinusCircle = fortawesome.faMinusCircle;
//         fortawesomeMock.faPlusCircle = fortawesome.faPlusCircle;
//     } else {
//         fortawesomeMock.faMinusCircle = null;
//         fortawesomeMock.faPlusCircle = null;
//     }
// }

module.exports = mock;