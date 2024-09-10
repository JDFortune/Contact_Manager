export class Model {
  fetchData(url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.send();
    
      xhr.onload = () => {
        resolve(xhr.response);
      }
    });
  }

  async fetchContacts() {
    return await this.fetchData('/api/contacts');
  }

  createContact(url, data) {
    this.sendData('POST', url, data)
      .then(alert('Contact successfully created.'))
      .catch(err => console.error(err));
  }

  deleteContact(url) {
    this.sendData('DELETE', url)
      .then(() => alert('Contact successfully deleted.'))
      .catch(err => console.error(err));
  }

  updateContact(url, data) {
    this.sendData('PUT', url, data)
      .then(() => alert('Contact updated!'))
      .catch(err => console.error(err));
  }

  sendData(method, url, data = null) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open(method, url);

      if (method === 'POST' || method === 'PUT') {
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        if (typeof data !== 'string') data = JSON.stringify(data);
        xhr.send(data);
      } else {
        xhr.send()
      }

      xhr.onload = () => {
        if (xhr.status === 201 || xhr.staus === 204) {
          resolve();
        } else {
          reject(xhr.responseText);
        }
      }

      xhr.onerror = () => reject('boop');
    });
  }
}