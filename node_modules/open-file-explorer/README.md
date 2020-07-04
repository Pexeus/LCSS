# nodejs-open-file-explorer
This module helps in opening explorer/finder in your OS programatically providing a very simple function to call.

## Installation

1. npm
```sh
npm install open-file-explorer --save
```
2. Yarn
```sh
yarn add open-file-explorer
```

## Usage

```javascript
const openExplorer = require('open-file-explorer');
const path = 'C:\\Users';
openExplorer(path, err => {
    if(err) {
        console.log(err);
    }
    else {
        //Do Something
    }
});
```

