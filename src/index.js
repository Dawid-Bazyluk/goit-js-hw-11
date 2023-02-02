import './css/styles.css';
import { fetchCountries } from './fetchCountries';
const debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

searchBox.addEventListener('input', debounce(searchingBoxVal, DEBOUNCE_DELAY));

function searchingBoxVal() {
  fetchCountries(searchBox.value.trim())
    .then(countries => renderingResults(countries))
    .catch(err => {
      if (searchBox.value !== '') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      console.log('Error:', err);
    });
}

function renderingResults(countries) {
  if (countries.length > 10) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length >= 2 && countries.length <= 10) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';

    const markup = countries
      .map(country => {
        return `<li class="country-list__item">
      <img class="country-list__item-flag" src="${country.flags.svg}" alt="${country.flags.alt}">
      <p country-list__item-text> ${country.name.common}</p>
      </li>`;
      })
      .join('');

    countryList.innerHTML = markup;
    console.log(countries);
  } else if (countries.length === 1) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';

    const oneCountryMarkup = countries.map(country => {
      return `<div class="country-info__heading">
      <img class="country-info__flag" src="${country.flags.svg}" alt="${
        country.flags.alt
      }"><h2>
       ${country.name.common}<h2></div>
      <p class="country-info__item"><span class="country-info__label">Capital:</span> ${
        country.capital
      }</p>
      <p class="country-info__item"><span class="country-info__label">Population:</span> ${country.population.toLocaleString()}</p>
      <p class="country-info__item"><span class="country-info__label">Languages:</span> ${Object.values(
        country.languages
      ).join(', ')}</p>`;
    });

    countryInfo.innerHTML = oneCountryMarkup;
  } else {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
}
