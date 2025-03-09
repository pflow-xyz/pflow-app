build of app.pflow.dev - no wallet connector - minimal build/viewer

WIP
---

BACKLOG
-------
- [ ] test svg image generation on dark mode
 
ICEBOX
------
- [ ] add new sqlite storage
- [ ] can we present on canvas? try out zoom/in out
- [ ] backport to pflow.xyz - consider how to store legacy petri-net data to make it compatible with minURL
 
DONE
----
- [x] find a better way to nest the UI rather than embedding in code - A: svg object tag!!
- [x] should we stick w/ SVG? - do we even need react? we can use SVG + object tag
- [x] install new minURL format + convert to cid
- [x] develop a URL format ?m=petriNet
- [x] refactor SVG generation to be dark-mode compatible i.e. don't assume white background
  [![pflow](https://pflow.dev/img/zb2rhbzaEAGY4L6SpmAByfdYr6jt945NmNY6zVZ1mWHK8Jjcb.svg)](https://pflow.dev/p/zb2rhbzaEAGY4L6SpmAByfdYr6jt945NmNY6zVZ1mWHK8Jjcb/)