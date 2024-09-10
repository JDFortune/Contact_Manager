export class View {
  constructor() {
    this.templates = {};
    this.registerTemplates();
    this.toolbar = document.querySelector('.toolbar');
    this.main = document.querySelector('main');
    this.searchFilter = this.toolbar.querySelector('input.filter');
    this.home = document.querySelector('.home-btn');
    this.filteredContacts;
  }

  addElementToMain(element) {
    this.main.appendChild(element);
  }

  addHTMLToMain(html) {
    this.main.insertAdjacentHTML('beforeend', html);
  }

  addToolbar() {
    this.addElementToMain(this.toolbar);
    this.updateToolbarTags();
  }

  clearMain() {
    this.main.innerHTML = '';
  }

  contactsCopy() {
    let json = JSON.stringify(this.contacts);
    let copy = JSON.parse(json);
    return copy;
  }

  filterContactsByTag(tag) {
    let contacts = this.contactsCopy();

    this.filteredContacts = contacts.filter(contact => {
      if (contact.tags) return contact.tags.includes(tag);
    });
  }

  formatPhoneNumbers() {
    let contacts = this.filteredContacts;
    if (contacts.length > 0) {
      contacts.forEach(contact => {
        if (contact.phone_number.length === 10) {
          contact.phone_number =
            contact.phone_number.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else {
          contact.phone_number =
            contact.phone_number.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
        }
      });
    }
  }

  formatTags() {
    let contacts = this.filteredContacts;
    if (contacts.length > 0) {
      contacts.forEach(contact => {
        if (contact.tags) {
          contact.tags = contact.tags.split(',');
        }
      });
    }
  }

  pushURL(path, title="Document") {
    history.pushState({page_id: 1, user_id: 1}, title, path);
  }

  resetFilteredContacts() {
    this.filteredContacts = this.contactsCopy();
  }

  registerTemplates() {
    document.querySelectorAll('[type$=handlebars]').forEach(script => {
      this.templates[script.id] = Handlebars.compile(script.innerHTML);
      if (script.dataset.type === 'partial') {
        Handlebars.registerPartial(script.id, script.innerHTML);
      }
    });
  }

  renderForm(templateValues, url) {
    let contactFormHTML = this.templates['form'](templateValues);
    this.clearMain();
    this.addHTMLToMain(contactFormHTML);
    this.pushURL(url);
  }

  renderHome() {
    this.clearMain();
    this.addToolbar();

    let contacts = this.filteredContacts;
    this.formatPhoneNumbers();
    this.formatTags();

    if (contacts.length > 0) {
      let contactHTML = this.templates['contacts']({contacts});
      this.addHTMLToMain(contactHTML);
    } else if (this.contacts.length === 0){
      let message = this.templates['no_contacts_message']();
      this.addHTMLToMain(message);
    }
    this.pushURL('/#contacts');
  }

  renderAddContactForm() {
    let newContactHTML = this.templates['form'](NEW_FORM);
    this.clearMain();
    this.addHTMLToMain(newContactHTML);
    this.pushURL('/#contacts/add');
  }

  resetToHome() {
    this.resetFilteredContacts();
    this.renderHome();
  }

  setContacts(contacts) {
    this.contacts = contacts;
    this.resetFilteredContacts();
    this.setTags();
  }

  setTags() {
    this.tags = [
      ...new Set(this.contacts.flatMap(({tags}) => {
        if (tags) return tags.split(',').map(tag => tag.trim());
      }).filter(tag => tag))
    ];
  }

  updateToolbarTags() {
    let tagsList = this.tags.map(tag => this.templates['contact_tags'](tag));
    let ul = this.toolbar.querySelector('ul');
    while (ul.lastChild) ul.removeChild(ul.lastChild);
    ul.insertAdjacentHTML('beforeend', tagsList.join(''));
  }

  bindFilterInput(handler) {
    this.toolbar.addEventListener('input', event => {
      handler(event);
    });
  }

  bindMainClick(handler) {
    // this.main
    document.addEventListener('click', event => {
      handler(event);
    });
  }

  bindSubmitForm(handler) {
    this.main.addEventListener('submit', event => {
      handler(event);
    });
  }
  
  bindValidateInput(handler) {
    this.main.addEventListener('focusout', event => {
      handler(event);
    });
  }

}