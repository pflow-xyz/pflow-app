# pflow-app

While pflow.xyz/editor is a great tool for creating and editing pflow files,
it has evolved into a very complex react app.

The intention here is to re-think the viewing and sharing experience,
and extract some of the features from pflow.dev.

*Status* : POC

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
