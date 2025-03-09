build of app.pflow.dev - no wallet connector - minimal build/viewer

WIP
- [ ] render w/ SVG only: pflow.svg?m=PetriNet&v=v0&p=place0&o=0&i=1&c=3&x=130&y=207&p=place1&o=1&i=0&c=0&x=395&y=299&t=txn0&x=46&y=116&t=txn1&x=227&y=112&t=txn2&x=43&y=307&t=txn3&x=235&y=306&s=txn0&e=place0&w=1&s=place0&e=txn1&w=3&s=txn2&e=place0&w=3&n=1&s=place0&e=txn3&w=1&n=1&s=txn3&e=place1&w=1
- [ ] update object.data vs live updates inside an embedded SVG using  postMessage().
- [ ] Build viewer -> HTML -> Object -> SVG -> metadata -> CDATA

BACKLOG
-------
- [ ] test svg image generation on dark mode
- [ ] setup svg badges - does it need? Access-Control-Allow-Origin: *

 
ICEBOX
------
- [ ] can/should we present on canvas? try out zoom/in out
- [ ] add new sqlite storage
- [ ] backport to pflow.xyz - consider how to store legacy petri-net data to make it compatible with minURL
 
DONE
----
- [x] find a better way to nest the UI rather than embedding in code - A: svg object tag!!
- [x] should we stick w/ SVG? - do we even need react? we can use SVG + object tag
- [x] install new minURL format + convert to cid
- [x] develop a URL format ?m=petriNet
- [x] refactor SVG generation to be dark-mode compatible i.e. don't assume white background
  [![pflow](https://pflow.dev/img/zb2rhbzaEAGY4L6SpmAByfdYr6jt945NmNY6zVZ1mWHK8Jjcb.svg)](https://pflow.dev/p/zb2rhbzaEAGY4L6SpmAByfdYr6jt945NmNY6zVZ1mWHK8Jjcb/)
