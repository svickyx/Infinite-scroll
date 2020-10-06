const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

//set up unsplash API url
const accessKey = 'A8RifSLUOTvNbB8zirT2qNyqhBX_jPsds5GxvKPGj-Y';
const count = 30;
const unsplashApiUrl = `https://api.unsplash.com/photos/random/?client_id=${accessKey}&count=${count}`;

// Fetch -- get data(photosArray) -- display photos by forEach method
// 1) when we fetch from unsplashApi, we get response and data, we name the data as photosArray, that's why use let instead of const to set photosArray as an empty array first. 
let photosArray = [];
let loadedImage = 0;
let totalLoadedImage = 0;
let imageLoadFinished = false;

// 2. in this function, use loadedImage, totalImage and imageLoadFinished to make imageLoadFinished to be true
// 3. and then, when user trigger 'scroll' event listener and imageLoadFinished is true, it will trigger getUnsplashPhoto() to run again(and imageLoadedFinished should change to false), and trigger displayPhotos(), and trigger loadNewImage(), on and on forever...
function loadNewImages() {
    loadedImage++;
    if(loadedImage === totalLoadedImage){
        imageLoadFinished = true;
        loader.hidden = true;
        //loader will always show up, but will hide after the imageLoadFinished is true (which means, loader will only show up once when it's the first time to load image)
    }
}

// 2) create displayPhotos function
function displayPhotos() {
    loadedImage = 0;
    totalLoadedImage = photosArray.length;
    //run function for each object in photosArray, and use js to write html elements for displayPhotos
    photosArray.forEach((photo)=> {
        // create <a> to link to unsplash
        const item = document.createElement('a');
        // photosArray has many many attributes, and we will take only some of them and give it to item, 
        // photo.link.html is a link that user click the image, he will be take to unsplash website to view that image
        item.setAttribute('href', photo.links.html);
        // open the image in another tab
        item.setAttribute('target', '_blank');

        // create <img> for photo
        const img = document.createElement('img');
        img.setAttribute('src', photo.urls.regular);
        img.setAttribute('alt', photo.alt_description);
        img.setAttribute('title', photo.alt_description); 

        // Image Loading Scroll Effects
        //1. add event listener for <img>, and add loadNewImage function, go to loadNewImage function
        img.addEventListener('load', loadNewImages);
        
        // <image-container> <a-item> <img /> </a> </image-container>
        item.append(img);
        imageContainer.append(item);

    })
}

//------------ ******  a better clean way to setAttribute   *******-----------------//
// // 1) write a function called setAttributeToElements
// function setAttributeToElements(element, attributes) {
//     for (const key in attributes){
//         element.setAttribute(key, attributes[key]);
//     }
// }
// // 2) instead of writing item.setAttribute('href', photo.links.html), use setAttributeToElements function
// setAttributeToElements(item, {
//     href: photo.links.html,
//     target: '_blank'
// });
//------------ ******  a better clean way to setAttribute   *******-----------------//


// create a async function for geting photo from unsplash API
async function getUnsplashPhoto() {
    try{
        const response = await fetch(unsplashApiUrl);
        photosArray = await response.json();
        displayPhotos();
    }catch (error) {

    }
}

// scroll implementation, use event listener 'scroll' method from window, when user scroll all the first-loaded image, it will trigger 'scroll' event and load one more time for more photos to show
// window.innerHeight is the height of the browser
// window.scrollY is the distance from the top of the page the user has scrolled
// offsetHeight is the combined height of all the images that load first time
// the reason to subtract 1000px is because almost all the browser's height is less than 1000px
window.addEventListener('scroll', ()=> {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && imageLoadFinished) {
        imageLoadFinished = false;
        getUnsplashPhoto();
    }
})


// Load the function
getUnsplashPhoto();