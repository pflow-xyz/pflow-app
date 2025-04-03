# 🧭 User-Facing TODOs for Visual Petri Net Tools on Gno.land

## 1. 🔍 Viewer for Minified Petri Nets
- [ ] Build a visual viewer that loads models from `?m=` URLs  
  → Users can share Petri-net models via short links  
  → Display token state, transition names, and flow in SVG

## 2. 🔁 Interactive Action Queueing
- [ ] Let users stack actions visually via markdown links (`?add=t1`)  
  → Each click updates the URL state (i.e., queued transitions)  
  → Show pending transitions as part of the SVG output (e.g. grayed arrows)

## 3. 🧪 Simulate Before You Commit
- [ ] “Simulate Proposal” flow for DAO participants  
  → Users click transitions to see what *would* happen  
  → Output is a rendered image + full queue preview (tokens, balances)

## 4. 🧱 Pre-Built Visual DAO Templates
- [ ] Provide visual templates for common DAO actions:
  - Treasury proposal (spending + voting)
  - Validator delegation flow
  - Contract deploy + governance approval  
  → Each template is a Petri-net-backed SVG + markdown shell

## 5. 🧰 Markdown-as-Interface
- [ ] Use only Gno-land-compatible markdown + links  
  → Actions shown as links: `[Add T1](?add=t1)`, `[Commit](?fire=all)`  
  → Images rendered from updated Petri-net state (SVG snapshots)
