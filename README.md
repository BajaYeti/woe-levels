# woe-levels-public
Public app to test GitHub Pages

## To deploy to GitHub Pages
 - https://youtu.be/Q9n2mLqXFpU?si=91REn4J6yImnTXAx

to install:
```
npm install gh-pages
```

Add the following to package.json:
root:
```
"homepage": "http://BajaYeti.github.io/woe-levels-public",
```


scripts:
```
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
```

to deploy, type:
```
npm run deploy
```

## Engine
- https://mermaid.js.org/syntax/sequenceDiagram.html#messages

``` mermaid
sequenceDiagram
    Log->>Input: input
    Input-->>Log: bad input
    Input->>Parse: OK input
    destroy Parse
    Parse->>Input: request
    Input-->>Log: bad request (unconditional response)
    Input->>Check: OK request
    destroy Check
    Check->>Input: response
    Input-->>Log: bad response
    Input->>Process: OK response
    destroy Process
    Process->>Input: result
    Input->>Log: result
```

