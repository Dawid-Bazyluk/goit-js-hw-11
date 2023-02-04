import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('input');
const submitBtn = document.querySelector('button');
const gallery = document.querySelector('.gallery');
const btnMore = document.querySelector('.load-more');
const APIKEY = '3738917-e2fd90131b33d81f7486a9a18';

let page = 1;
let lightbox;

async function getPhotos() {
  const searchedVal = searchForm.value;
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${APIKEY}&q=${searchedVal}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    
    return [response.data.hits, response.data.totalHits];
  } catch (error) {
    console.error(error);
  }
}

function renderPhotos(photos) {
  const markup = photos
    .map(
      photo =>
        `<div class="photo-card">
      <a href="${photo.largeImageURL}">
        <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes ${photo.likes}</b>
        </p>
        <p class="info-item">
          <b>Views ${photo.views}</b>
        </p>
        <p class="info-item">
          <b>Comments ${photo.comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads ${photo.downloads}</b>
        </p>
      </div>
    </div>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

async function Submit(event) {
  event.preventDefault();
  page = 1;

  try {
    const photos = await getPhotos();
    if (photos[0].length > 0) {
      gallery.innerHTML = ' ';
      renderPhotos(photos[0]);
      btnMore.classList.remove('is-hidden');
      page += 1;
      Notiflix.Notify.success(`Hooray! We found ${photos[1]} images.`);
      lightbox = new SimpleLightbox('.gallery a');
      console.log(photos[0]);
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.log(error);
  }
}

submitBtn.addEventListener('click', Submit);
