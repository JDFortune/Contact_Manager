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

3. I delegated a lot of the events for this. Even later deciding to just move a single `click` listener to the document and handle all of the different elements by identifying there `data-type` Attributes. In order to keep the handler clean-ish, I used a bunch of helper methods that did most of the heavy lifting and the actuall event handler is largly just used for flow control. Not sure if this is a recommended approach. And really not sure about how I feel about the overall look of my code in general. But I hope it's acceptable.

4. The only event handler that I debounce is the Search Filter. Everything else, I figure won't fire quick enough to warrant debouncing.

5. For the form validation, I used the `pattern` attribute of the `input` elements and `.checkValidity()` method provided by the Web API to check that the values match the patterns. That was actually an area that I struggled with for how often to validate. At first, I was validating every key stroke and that was excessive. Not to mention that I needed to have all of the inputs validated to determine if the submit button should be enabled/disabled. I eventually landed on using a `focusout` event listener to test the input after the user swithed to a new target. Another way I could have handled it was to use a `keydown` event listener with `preventDefault` to decide whether or not to even allow the key, if it didn't match the allowed input. But that would largely only work for the name and phone number and there would still need to be the focus out validation for determining the if the final value was valid. Adding in the `keydown` listener would make the validation a little smoother and quicker acting and probably wouldn't be too resource expensive, since the code is on the browser side, so that would have been a good idea, I think.

Thanks for your time :)
- JD
