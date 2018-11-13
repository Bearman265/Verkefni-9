// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let domains;

  function displayDomain(domainsList) {
    if(domainsList.length ===0) {
      displayError('Lén er ekki skráð');
      return;
    }

    const [{domain,registered,lastChange,expires,registrantname,email,address,country}] = domainsList;
    const dl = document.createElement('dl');

    const lenElement = document.createElement('dt');
    lenElement.appendChild(document.createTextNode('Lén'));
    dl.appendChild(lenElement);
    const lenValueElement = document.createElement('dd');
    lenValueElement.appendChild(document.createTextNode(domain));
    dl.appendChild(lenValueElement);

    const skraElement = document.createElement('dt');
    skraElement.appendChild(document.createTextNode('Skráð'));
    dl.appendChild(skraElement);
    const skraValueElement = document.createElement('dd');
    skraValueElement.appendChild(document.createTextNode(date(registered)));
    dl.appendChild(skraValueElement);

    const breytaElement = document.createElement('dt');
    breytaElement.appendChild(document.createTextNode('Síðast breytt'));
    dl.appendChild(breytaElement);
    const breytaValueElement = document.createElement('dd');
    breytaValueElement.appendChild(document.createTextNode(date(lastChange)));
    dl.appendChild(breytaValueElement);

    const expElement = document.createElement('dt');
    expElement.appendChild(document.createTextNode('Rennur út'));
    dl.appendChild(expElement);
    const expValueElement = document.createElement('dd');    
    expValueElement.appendChild(document.createTextNode(date(expires)));
    dl.appendChild(expValueElement);

    
    if(registrantname != []) {
      const regElement = document.createElement('dt');
      regElement.appendChild(document.createTextNode('Skráningaraðili'));
      dl.appendChild(regElement);

      const regValueElement = document.createElement('dd');
      regValueElement.appendChild(document.createTextNode(registrantname));
      dl.appendChild(regValueElement);
    } 
    if(email != []) {
      const emailElement = document.createElement('dt');
      emailElement.appendChild(document.createTextNode('Netfang'));
      dl.appendChild(emailElement);

      const emailValueElement = document.createElement('dd');
      emailValueElement.appendChild(document.createTextNode(email));
      dl.appendChild(emailValueElement);
    }
    if(address !=[]) {
      const addressElement = document.createElement('dt');
      addressElement.appendChild(document.createTextNode('Heimilisfang'));
      dl.appendChild(addressElement);

      const addressValueElement = document.createElement('dd');
      addressValueElement.appendChild(document.createTextNode(address));
      dl.appendChild(addressValueElement);
    }
    if(country != []) {
      const countryElement = document.createElement('dt');
      countryElement.appendChild(document.createTextNode('Land'));
      dl.appendChild(countryElement);

      const countryValueElement = document.createElement('dd');
      countryValueElement.appendChild(document.createTextNode(country));
      dl.appendChild(countryValueElement);
    }    

    const container = domains.querySelector('.results');
    
    while(container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(dl);
  }

  function displayError(error){
    const container = domains.querySelector('.results');
    while(container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(document.createTextNode(error));
  }

  function loadingBar(){
    const loadingElement = document.createElement('div');
    loadingElement.setAttribute('class', 'loading');
    const img = document.createElement('img');
    img.setAttribute('src', 'img/loading.gif');
    loadingElement.appendChild(img);

    const texti = document. createElement('p');
    texti.appendChild(document.createTextNode('Leita að léni...'))
    loadingElement.appendChild(texti);

    const contain = domains.querySelector('.results');
    contain.appendChild(loadingElement);
  }

  function fetchData(domain) {
    const contain = domains.querySelector('.results');
    fetch(`${API_URL}${domain}`)
      .then(
        loadingBar()
      )
      .then((response)=> {
        if(response.ok) {
          return response.json();
        }
        throw new Error('Villa kom upp');
      })
      .then ((data) => {
        contain.removeChild(contain.firstChild);
        displayDomain(data.results);
      })
      .catch((error) => {
        displayError('Lén verður að vera strengur');
        console.error(error);
      })
  }

  function date(x) {
    var t = new Date(x);
    d = t.getDate();
    if(d<9) {
      d='0'+d;
    }
    m = (t.getMonth()+1);
    if(m<9) {
      m='0'+m;
    }
    y = t.getFullYear();
    return (y +'-'+m +'-'+ d);
  }

  function onSumbit(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');

    fetchData(input.value);
  }

  function init(_domains) {
    domains = _domains;

    const form = domains.querySelector('form');
    form.addEventListener('submit', onSumbit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');

  program.init(domains);
});