class Carousel {

    constructor(visibleItems, navigation, dots, infinityloop, autoplay, speed, imgurl = [], videourl = []) {
        this.visibleItems = visibleItems;
        this.navigation = navigation;
        this.dots = dots;
        this.infinityloop = infinityloop;
        this.autoplay = autoplay;
        this.speed = speed;
        this.imgurl = imgurl;
        this.videourl = videourl;
    }

    moveSlides = (track, currentSlide, targetSlide) => {
        track.style.transform = `translateX(-${targetSlide.style.left})`;

        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');

    }

    changeDots = (currentDot, targetDot) => {
        currentDot.classList.remove('current-slide');
        targetDot.classList.add('current-slide');
    }

    moveslidetoRight = (track, dotContainer, inifintyloop) => {
        const currentSlide = track.querySelector('.current-slide');
        const slides = Array.from(track.children);
        const slideIndex = slides.findIndex(slide => slide === currentSlide);
        let currentDot, dots;

        if (dotContainer) {
            currentDot = dotContainer.querySelector('.current-slide');
            dots = Array.from(dotContainer.children);
        }

        if (slideIndex === (slides.length - 1) && inifintyloop) {

            const nextSlide = slides[0];

            this.moveSlides(track, currentSlide, nextSlide);

            if (dotContainer) {
                const nextDot = dots[0];
                this.changeDots(currentDot, nextDot);
            }

        } else if (slideIndex !== (slides.length - 1)) {
            const nextSlide = currentSlide.nextElementSibling;

            this.moveSlides(track, currentSlide, nextSlide);

            if (dotContainer) {
                const nextDot = currentDot.nextElementSibling;
                this.changeDots(currentDot, nextDot);
            }
        }
    }

    moveslidetoLeft = (track, dotContainer, inifintyloop) => {
        const currentSlide = track.querySelector('.current-slide');
        const slides = Array.from(track.children);
        const slideIndex = slides.findIndex(slide => slide === currentSlide);
        let currentDot, dots;

        if (dotContainer) {
            currentDot = dotContainer.querySelector('.current-slide');
            dots = Array.from(dotContainer.children);
        }

        if (slideIndex === 0 && inifintyloop) {

            const prevSlide = slides[slides.length - 1];
            this.moveSlides(track, currentSlide, prevSlide)

            if (dotContainer) {
                const prevDot = dots[dots.length - 1];
                this.changeDots(currentDot, prevDot);
            }

        } else if (slideIndex !== 0) {
            const prevSlide = currentSlide.previousElementSibling;
            this.moveSlides(track, currentSlide, prevSlide)

            if (dotContainer) {
                const prevDot = currentDot.previousElementSibling;
                this.changeDots(currentDot, prevDot);
            }
        }
    }

}

const visibleItemImageWidth = ['100%', '45%', '30%', '22%', '18%'];

let carousel = new Carousel(1, true, true, true, true, 3000, ['./images/scenery1.jpg', './images/scenery2.jpg', './images/scenery3.jpg'], ['./videos/movie.mp4']);

let carouselList;

let dotContainer;

let startTouch, endTouch;

let carouselModal;

let autoMoveSlides;

document.addEventListener('DOMContentLoaded', () => {
    let divCarousel = document.querySelector(".carousel#custom-carousel")
    let fragment = document.createDocumentFragment('div');
    if (!divCarousel) {
        return;
    } else {

        const carouselWidth = divCarousel.getBoundingClientRect().width;

        if (carousel.navigation) {
            let leftButton = document.createElement('button');
            leftButton.innerHTML = `<i class="fas fa-chevron-left"></i>`;
            leftButton.className = 'carousel-button left';
            leftButton.setAttribute('onclick', 'leftButton();');
            fragment.appendChild(leftButton);
        }

        let carouselContent = document.createElement('div');
        carouselContent.className = 'carousel-container';
        carouselModal = document.createElement('div');
        carouselModal.className = 'modal';
        carouselContent.appendChild(carouselModal);
        carouselList = document.createElement('ul');
        carouselList.className = 'carousel-track';

        const totalImgLoops = parseInt(carousel.imgurl.length / carousel.visibleItems);
        const extraImages = carousel.imgurl.length - (totalImgLoops * carousel.visibleItems);
        const imageSlides = extraImages > 0 ? 1 + totalImgLoops : totalImgLoops;

        let imageCounter = 0;

        let listContent = "";

        if (carousel.imgurl.length > 0) {

            for (let i = 0; i < totalImgLoops; i++) {
                if (i == 0) {
                    listContent += `<li class="carousel-slide current-slide" style=" left: ${carouselWidth * i}px;" ontouchstart="start(event);" ontouchmove = "drag(event);">`;
                }
                else {
                    listContent += `<li class="carousel-slide" style=" left: ${carouselWidth * i}px;" ontouchmove = "drag(event);">`;
                }
                for (let j = 0; j < carousel.visibleItems; j++) {
                    listContent += `<img src="${carousel.imgurl[imageCounter]}" class="carousel-image" ondblclick = "openModal(this, false);" style="width: ${visibleItemImageWidth[carousel.visibleItems - 1]}; height: ${visibleItemImageWidth[carousel.visibleItems - 1]};">`;
                    imageCounter++;
                }
                listContent += `</li>`;
            }

            if (extraImages > 0) {
                listContent += `<li class="carousel-slide" style=" left: ${carouselWidth * totalImgLoops}px; ontouchstart = "start(event);" ontouchmove = "drag(event);">`;
                for (let i = 0; i < extraImages; i++) {
                    listContent += `<img src="${carousel.imgurl[imageCounter]}" class="carousel-image" ondblclick = "openModal(this, false);" style='width: ${visibleItemImageWidth[extraImages - 1]}; height: ${visibleItemImageWidth[extraImages - 1]};'>`;
                    imageCounter++;
                }
                listContent += `</li>`;
            }

            carouselList.innerHTML = listContent;
        }

        if (carousel.videourl.length > 0) {
            carousel.videourl.forEach((video, index) => {
                if (index == 0 && carousel.imgurl.length == 0) {
                    carouselList.innerHTML += `<li class="carousel-slide current-slide" style = "left: ${carouselWidth * (imageSlides + index)}px " ontouchmove = "drag(event);">
                    <video class="carousel-video" controls controlslist="nofullscreen nodownload noremoteplayback" onplaying="pauseSlide(event)" onpause="resumeSlide(event)" ondblclick="openModal(this,true)">
                        <source src="${video}" type="video/mp4">
                    </video>
                </li>`
                } else {
                    carouselList.innerHTML += `<li class="carousel-slide" style = "left: ${carouselWidth * (imageSlides + index)}px" ontouchmove = "drag(event);">
                    <video class="carousel-video" controls controlslist="nofullscreen nodownload noremoteplayback" onplaying="pauseSlide(event)" onpause="resumeSlide(event)" ondblclick="openModal(this,true)">
                        <source src="${video}" type="video/mp4">
                    </video>
                </li>`
                }
            })
        }

        carouselList.innerHTML += `</ul>`;

        carouselContent.appendChild(carouselList);
        fragment.appendChild(carouselContent);

        if (carousel.navigation) {
            let rightButton = document.createElement('button');
            rightButton.innerHTML = `<i class="fas fa-chevron-right"></i>`;
            rightButton.className = 'carousel-button right';
            rightButton.setAttribute('onclick', 'rightButton()');
            fragment.appendChild(rightButton);
        }

        if (carousel.dots) {
            dotContainer = document.createElement('div');
            dotContainer.className = 'carousel-nav';
            dotContainer.setAttribute('onclick', 'dot(event);')
            let totalElements = imageSlides + carousel.videourl.length;
            dotContainer.innerHTML = `<button class="carousel-indicator current-slide"></button>`;
            for (let i = 1; i < totalElements; i++) {
                dotContainer.innerHTML += `<button class="carousel-indicator"></button>`;
            }
            fragment.appendChild(dotContainer);
        }

        divCarousel.appendChild(fragment);

        if (carousel.autoplay) {
            autoMoveSlides = setInterval(carousel.moveslidetoRight, carousel.speed, carouselList, dotContainer, carousel.infinityloop);
        }
    }
})

const rightButton = () => {
    if (carousel.autoplay)
        clearInterval(autoMoveSlides);
    carousel.moveslidetoRight(carouselList, dotContainer, carousel.infinityloop);

    if (carousel.autoplay)
        autoMoveSlides = setInterval(carousel.moveslidetoRight, carousel.speed, carouselList, dotContainer, carousel.infinityloop);
};

const leftButton = () => {
    if (carousel.autoplay)
        clearInterval(autoMoveSlides);

    carousel.moveslidetoLeft(carouselList, dotContainer, carousel.infinityloop);

    if (carousel.autoplay)
        autoMoveSlides = setInterval(carousel.moveslidetoRight, carousel.speed, carouselList, dotContainer, carousel.infinityloop);
}

const pauseSlide = (event) => {
    clearInterval(autoMoveSlides);
    if (event.target.className !== 'carousel-image') {
        return;
    } else {
        event.target.children[0].style.display = 'flex';
        event.target.children[0].classList.add('hidden-element');
    }
}

const resumeSlide = (event) => {
    autoMoveSlides = setInterval(carousel.moveslidetoRight, carousel.speed, carouselList, dotContainer, carousel.infinityloop);
}

const dot = (event) => {
    const targetDot = event.target.closest('button');

    if (!targetDot) {
        return;
    }

    const slides = Array.from(carouselList.children);
    const dots = Array.from(dotContainer.children);

    const currentSlide = carouselList.querySelector('.current-slide');
    const currentDot = dotContainer.querySelector('.current-slide');

    const targetIndex = dots.findIndex(dot => dot === targetDot)
    const targetSlide = slides[targetIndex];

    carousel.moveSlides(carouselList, currentSlide, targetSlide);

    carousel.changeDots(currentDot, targetDot);
}

const closeModal = (event) => {
    event.target.parentElement.style.visibility = 'hidden';
}

const openModal = (element, isVideo) => {
    if (!isVideo) {
        carouselModal.innerHTML = `<img src='${element.src}' alt='${element.src}' class="modal-image">
        <span class='cross' onclick="closeModal(event);">&#10005;</span>`;
    } else {
        carouselModal.innerHTML = `<video class="modal-video" controls controlslist="nofullscreen nodownload noremoteplayback" ondblclick="openModal(this,true)">
        <source src="${element.children[0].src}" type="video/mp4">
    </video>
    <span class='cross' onclick="closeModal(event);">&#10005;</span>`;
    }
    carouselModal.style.visibility = 'visible';
}

const start = (event) => {
    let x = event.touches[0].clientX;
    startTouch = x;
}

const drag = (event) => {
    let x = event.touches[0].clientX;
    endTouch = x;
    if (startTouch > endTouch) {
        console.log('dragged left');
        if (carousel.autoplay)
            clearInterval(autoMoveSlides);
        carousel.moveslidetoLeft(carouselList, dotContainer, carousel.infinityloop);

        if (carousel.autoplay)
            autoMoveSlides = setInterval(carousel.moveslidetoRight, carousel.speed, carouselList, dotContainer, carousel.infinityloop);
    }
    else if (startTouch < endTouch) {
        console.log('dragged right');
        if (carousel.autoplay)
            clearInterval(autoMoveSlides);

        carousel.moveslidetoRight(carouselList, dotContainer, carousel.infinityloop);

        if (carousel.autoplay)
            autoMoveSlides = setInterval(carousel.moveslidetoRight, carousel.speed, carouselList, dotContainer, carousel.infinityloop);
    }
}