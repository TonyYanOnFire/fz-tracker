module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-recommended",
        './.eslintrc-auto-import.json',
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        'space-before-function-paren': ["error", "always"],
        "semi": [2, 'never'],
        "no-extra-semi": "error",
        "key-spacing": ["error", { "afterColon": true, "mode": "strict" }],

        "vue/html-closing-bracket-newline": ["error", {
            "singleline": "never",
            "multiline": "never"
        }],

        "comma-dangle": ["error", "always-multiline"],
        "object-property-newline": ["error", {
            "allowAllPropertiesOnSameLine": false
        }],
    }
}
