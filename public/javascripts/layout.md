Model
- All of the AJAX requests

View
- has access to all of the elements that are in the browser
  - bindMethods that set up the event listeners are defined here
- creates the templates

- sends templates to 


Controller
- event handlers are defined on this object
- initialize method will call the bind method on the collaborator `view` object and pass the handers defined on this object.


