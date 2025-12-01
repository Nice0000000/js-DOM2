const API_URL = 'https://picsum.photos/v2/list';
const LIMIT = 4;
let currentPage = Math.floor(Math.random() * 50) + 1; 

const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');

const btnLoad = document.getElementById('btn-load');
const btnClear = document.getElementById('btn-clear');
const btnRemove = document.getElementById('btn-remove');
const btnReverse = document.getElementById('btn-reverse');

async function fetchImages() {
    toggleLoader(true);
    try {
        const response = await fetch(`${API_URL}?page=${currentPage}&limit=${LIMIT}`);
        if (!response.ok) throw new Error('Помилка мережі');
        
        const data = await response.json();
        renderGallery(data);
        
        currentPage++;
    } catch (err) {
        console.error(err);
        alert('Упс! Щось пішло не так при завантаженні.');
    } finally {
        toggleLoader(false);
    }
}

function renderGallery(images) {
    images.forEach(imgData => {
        const card = document.createElement('figure');
        card.className = 'card';

        card.innerHTML = `
            <img src="${imgData.download_url}" alt="Photo by ${imgData.author}" loading="lazy">
            <figcaption class="card-info">
                <span>© ${imgData.author}</span>
            </figcaption>
        `;

        gallery.appendChild(card);
    });
}

function clearGallery() {
    gallery.innerHTML = '';
}

function removeLast() {
    const lastItem = gallery.lastElementChild;
    if (lastItem) {
        lastItem.style.opacity = '0';
        lastItem.style.transform = 'scale(0.9)';

        setTimeout(() => {
            if(gallery.contains(lastItem)) gallery.removeChild(lastItem);
        }, 300);
    }
}

function reverseGallery() {
    const cards = Array.from(gallery.children);
    if(cards.length === 0) return;

    gallery.innerHTML = '';

    cards.reverse().forEach(card => {
        card.style.animation = 'none';
        card.offsetHeight; 
        card.style.animation = 'fadeIn 0.6s ease-out forwards';
        
        gallery.appendChild(card);
    });
}

function toggleLoader(show) {
    if (show) loader.classList.remove('hidden');
    else loader.classList.add('hidden');
}

window.addEventListener('DOMContentLoaded', fetchImages);
btnLoad.addEventListener('click', fetchImages);
btnClear.addEventListener('click', clearGallery);
btnRemove.addEventListener('click', removeLast);
btnReverse.addEventListener('click', reverseGallery);