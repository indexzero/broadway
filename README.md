# broadway 

## Motivation / Goals
1. No more bin/* scripts
2. Well-defined entry points for modules
3. Composeable modules 

## Simple application

app/
  users
  bookmarks
  index.js
  
## Complex application

app/
  users/    --> shared resource
  files/    --> used by uploader only
  api/      --> entry point
  uploader/ --> entry point
  index.js
