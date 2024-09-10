Files of Notice:
- public/index.html
- public/javascripts/
	- view.js
	- controller.js
	- model.js
	- debounce.js

Other Notes:

1. The CSS is awful, I finally got it to look ok after many moons and did not want to worry about trying to clean it up and revise it.

2. I reorganized a lot of this project as I was getting used to the MVC structure. It feels a little long. Definitely where the Handlebars are concerned. I wondered if I could make it cleaner, but I did spend a bit of time cleaning up and re-organizing the js files, towards the end, moving methods from the Controller, that I felt were better suited for the View object. Hopefully this looks alright for a first attempt. I was pretty uncomforatable with a lot of the process, but I'd love to hear any insight or thoughts you have.

3. I delegated a lot of the events for this. Event later deciding to just move a single `click` listener to the document so and handle all of the different elements by identifying there `data-type` Attributes. In order to keep the handler clean-ish, I used a bunch of helper methods that did most of the heavy lifting and so the actuall event handler is largly just used for flow controll. Not sure if this is a recommended approach. And really not sure about how I feel about the overall look of my code in any case. But I hope it's acceptable.

Thanks for your time :)
- JD
