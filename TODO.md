WIP
---
build of app.pflow.dev - no wallets - minimal build/viewer

- [ ] can we present on canvas?
- [ ] develop a URL format ?modelType=petriNet

http://localhost:3000/

?modelType=petriNet
&version=v0
&place=place0&offset=0&initial=1&capacity=3&x=130&y=207
&transition=txn0&x=46&y=116
&transition=txn1&x=227&y=112
&transition=txn2&x=43&y=307
&transition=txn3&x=235&y=306
&source=txn0&target=place0
&source=place0&target=txn1&weight=3
&source=txn2&target=place0&weight=3&inhibit=true
&source=place0&target=txn3&inhibit=true
