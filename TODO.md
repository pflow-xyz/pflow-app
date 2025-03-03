build of app.pflow.dev - no wallet connector - minimal build/viewer

WIP
---

BACKLOG
-------
- [ ] can we present on canvas? try out zoom/in out
- [ ] should we stick w/ SVG? - do we even need react?
 
- [ ] find a better way to nest the UI rather than embedding in code
- [ ] add new sqlite storage
- [ ] backport to pflow.xyz - consider how to store legacy petri-net data to make it compatible with minURL
- [ ] test svg image generation on dark mode
 
DONE
----
- [x] install new minURL format + convert to cid
- [x] develop a URL format ?m=petriNet
- [x] refactor SVG generation to be dark-mode compatible i.e. don't assume white background
