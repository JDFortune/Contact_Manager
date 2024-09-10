import { View } from './view.js';
import { Model } from './model.js';
import { debounce } from './debounce.js';

const NEW_FORM = {url: '/api/contacts', method: 'POST', title: 'Create Contact'};
const UPDATE_FORM = {method: 'PUT', title: 'Update Contact'};

class Controller {
  constructor() {
    this.view = new View();
    this.model = new Model();
    this.toolbarInputEventHandler = debounce(this.toolbarInputEventHandler.bind(this), 300);
    this.init();
  }

  async init() {
    await this.updateContacts();
    this.view.renderHome();
    this.view.bindFilterInput(this.toolbarInputEventHandler);
    this.view.bindMainClick(this.mainClickEventHandler.bind(this));
    this.view.bindSubmitForm(this.submitFormEventHandler.bind(this));
    // this.view.bindHomeButton(this.homeClickEventHandler.bind(this));
    this.view.bindValidateInput(this.validateInputOnFocusOutHandler.bind(this));
  }

  async updateContacts() {
    let contacts = await this.model.fetchContacts();
    this.view.setContacts(contacts);
  }

  async deleteContact(e) {
    let confirmDelete = confirm('Are you sure you want to delete this contact');
    if (confirmDelete) {
      await this.model.deleteContact(e.target.getAttribute('href'));
      await this.updateContacts();
      this.view.resetToHome();
    }
  }

  mainClickEventHandler(e) {
    switch (e.target.dataset.type) {
      case 'home':
        e.preventDefault();
        this.view.resetToHome();
        break;
      case 'tag':
        this.view.filterContactsByTag(e.target.textContent);
        this.view.renderHome();
        break;
      case 'add_contacts':
        this.view.renderForm(NEW_FORM, '/#contacts/add');
        break;
      case 'delete':
        e.preventDefault();
        this.deleteContact(e);
        break;
      case 'edit':
        e.preventDefault();
        let contactInfo = this.#getContactInfoForEditForm(e.target);
        let templateValues = Object.assign({}, UPDATE_FORM, contactInfo);
        this.view.renderForm(templateValues, `/#contacts/edit/${contactInfo.id}`);
        break;
      case 'cancel':
        this.view.resetToHome();
        break;
    }
  }

  async submitFormEventHandler(e) {
    e.preventDefault();
    
    let form = e.target;
    let data = new FormData(form);
    let json = JSON.stringify(this.#formDataToJson(data));

    let method = form.getAttribute('method');
    let url = form.action;
    
    try {
      await this.model.sendData(method, url, json);
      await this.updateContacts();
      this.view.resetToHome();
    } catch (error) {
      console.log(error);
    }
  }

  toolbarInputEventHandler(e) {
    let searchValue = e.target.value;
    this.view.filteredContacts = this.#nameIncludes(searchValue, this.view.contacts);
    this.view.renderHome();
    this.view.pushURL(`/#contacts/filter/search/${searchValue}`);
    if (this.view.filteredContacts.length === 0 && searchValue.length > 0) {
      this.#setNoMatchesFilterMessage(searchValue);
    }
    e.target.focus();
  }

  validateInputOnFocusOutHandler(e) {
    let el = e.target;
    let form = e.target.closest('form');
    if (el.tagName === "INPUT" && el.hasAttribute('pattern')){
      this.#checkInputsValidity(form);
    }
  }

  #checkInputsValidity(form) {
    let inputs = [...form.querySelectorAll('input')];
    let submit = form.querySelector('[type=submit]');

    let formIsValid = true;
    inputs.forEach(input => {
      let span = input.nextElementSibling;
      if (!input.checkValidity() && input.value.length > 0) {
        formIsValid = false;
        span.textContent = span.dataset.message;
      } else {
        span.textContent = '';
      }
    });

    if (!formIsValid) {
      submit.setAttribute('disabled', true);
    } else {
      if (submit.hasAttribute('disabled')) submit.removeAttribute('disabled');
    }
  }

  #formDataToJson(formData) {
    let json = {};

    for (let pair of formData.entries()) {
      json[pair[0]] = pair[1];
    }

    return json;
  }

  #getContactInfoForEditForm(target) {
    let contactValues = {};
    let li = target.closest('li');
    contactValues.full_name = li.querySelector('.name').textContent;
    contactValues.phone_number = li.querySelector('.phone_number').textContent
                                   .match(/\d+/g).join('');
    contactValues.email = li.querySelector('.email').textContent;

    contactValues.url = target.getAttribute('href');
    contactValues.id = target.dataset.id;

    let tags = [...li.querySelectorAll('.tag')];
    if (tags.length > 0) {
      tags = tags.map(tag => tag.textContent);
      contactValues.tags = tags.join(',');
    }
    
    return contactValues;
  }

  #nameIncludes(filterValue, contacts) {
    let copy = JSON.stringify(contacts);
    contacts = JSON.parse(copy);

    if (filterValue.length === 0) return contacts;
    return contacts.filter(contact => {
      return contact.full_name.toLowerCase().includes(filterValue.toLowerCase());
    });
  }

  #setNoMatchesFilterMessage(value) {
    let messageHTML = this.view.templates['no_matching_contacts_message']({value});
    this.view.addHTMLToMain(messageHTML);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new Controller();
});
