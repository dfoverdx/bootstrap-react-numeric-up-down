module.exports = {
    "presets": [
        [
            "@babel/preset-env", 
            { 
                // "modules": false 
            }
        ],
        "@babel/preset-react"
    ],
    "plugins": [
        ["styled-jsx/babel", { "sourceMaps": false }],
        "@babel/plugin-proposal-class-properties"
    ],
    "env": {
        "test": {
            "retainLines": true,
            "sourceMaps": "both"
        }
    }
};