# Woe Levels
A React.js SPA 2text adventure/interactive fiction" engine with simple verb/noun parser.

## To deploy to GitHub Pages
 - https://youtu.be/Q9n2mLqXFpU?si=91REn4J6yImnTXAx

To install gh-pages:
```
npm install gh-pages
```

Then add the following to package.json:
root:
```
"homepage": "http://BajaYeti.github.io/woe-levels",
```

Update scripts section of package.json:
```
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
```

To deploy, type:
```
npm run deploy
```

## Engine Sequence Diagram
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

