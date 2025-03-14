# pflow-app

While pflow.xyz/editor is a great tool for creating and editing pflow files,
it has evolved into a very complex react app.

The intention here is to re-think the viewing and sharing experience,
and extract some of the features from pflow.dev.

*Status* : Pre-Alpha

https://pflow-app.fly.dev/

## Goals

* allow for an infinite canvas viewing experience
  * scaling of diagrams is not mobile friendly
* improve rendering to better support large models
  * current react app makes browser lag when loading sudoku (large model)
* build in better import/export tools
  * export to gno.land
  * export to solidity
  * export to js/ts
* support analysis
  * export to julia (jupyter notebook)

## Embedding model in html

See [widget.html](./widget.html) for an example of how to next the pflow viewer in an html page.

[embed-example](https://pflow.dev/embed/?m=petriNet&v=v0&p=place0&i=1&c=3&o=0&x=130&y=207&p=place1&i=0&c=0&o=1&x=395&y=299&t=txn0&x=46&y=116&t=txn1&x=227&y=112&t=txn2&x=43&y=307&t=txn3&x=235&y=306&s=txn0&e=place0&w=1&s=place0&e=txn1&w=3&s=txn2&e=place0&n=1&w=3&s=place0&e=txn3&n=1&w=1&s=txn3&e=place1&w=1)
