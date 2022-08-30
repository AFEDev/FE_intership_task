import { handleApiRequests } from "./api.js";

const checkboxGreyscale = document.getElementById("greyscale_image_cb");
const blurLevelInput = document.getElementById("blur_image_rg");
const imageContainer = document.getElementById("container_sidebar_id");

window.onload = function () {
  renderImagesList().then(imagesOnClickEvent);

  document
    .querySelectorAll(".container_sidebar_image")
    .forEach((image) => image.addEventListener("click", imageOnClickHandler));
};

checkboxGreyscale.addEventListener("change", checkToGrayscale);

imageContainer.addEventListener("scroll", handleInfiniteScroll);

blurLevelInput.addEventListener("change", getBluredImage);

async function renderImagesList() {
  const imagesData = await handleApiRequests.fetchImagesList();
  if (!imagesData.length) {
    return;
  }

  handleApiRequests.updateImagesList(imagesData);

  const html = handleApiRequests.imagesList.length
    ? handleApiRequests.imagesList.map(toCard).join(" ")
    : `<div class="container_sidebar_image"><p>There are no images on page</p></div>`;

  const sidebar = document.getElementById("container_sidebar_id");
  sidebar.innerHTML = html;
}

function toCard(image) {
  return `
      <div class="container_sidebar_image" image-id=${image.id} style='background-image:url(${image.resized_image})'>
      </div>
      `;
}

const imagesOnClickEvent = () => {
  document
    .querySelectorAll(".container_sidebar_image")
    .forEach((image) => image.addEventListener("click", imageOnClickHandler));
};

function handleInfiniteScroll() {
  const imageContainer = document.getElementById("container_sidebar_id");
  const endOfPage =
    imageContainer.scrollTop + imageContainer.clientHeight >=
    imageContainer.scrollHeight;

  if (endOfPage) {
    handleApiRequests.addPage();
    renderImagesList().then(imagesOnClickEvent);
  }
}

function checkToGrayscale() {
  checkboxGreyscale.checked
    ? (handleApiRequests.isGrayscale = true)
    : (handleApiRequests.isGrayscale = false);
  console.log("checkToGrayscale", handleApiRequests.selectedImageId);
  if (!handleApiRequests.selectedImageId) {
    return;
  }

  handleImageLoading();
}

function getBluredImage() {
  handleApiRequests.blur = blurLevelInput.value;

  if (!handleApiRequests.imageID) {
    return;
  }

  handleImageLoading();
}

const imageOnClickHandler = (e) => {
  const imageID = event.target.getAttribute("image-id");
  handleApiRequests.selectedImageId = imageID;
  setTimeout(handleImageLoading, 1000);
};

function renderImageInformation(imageData) {
  const dataContainer = document.getElementById("card__image-information");

  if (!imageData) {
    return;
  }

  const html = `       
    <div>
    <h3>Author: </h3>
    <h4>${imageData.author}</h4>
  </div>
  <div>
    <h3>Dimensions:</h3>
    <h4>Width: ${imageData.width} px</h4>
    <h4>Height: ${imageData.height} px</h4>
  </div>`;

  dataContainer.innerHTML = html;
}

function handleImageLoading() {
  const imageContainer = document.getElementById("card__image-container");

  const imageData = handleApiRequests.getImageData(
    handleApiRequests.selectedImageId
  );

  const imageUrl = handleApiRequests.getImageUrl(
    imageData.id,
    imageData.width,
    imageData.height
  );

  const img = new Image();

  let timer;

  function clearTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  if (!handleImageLoading.isRunning) {
    handleImageLoading.isRunning = true;
  } else {
    handleImageLoading.isRunning = false;
    clearTimer();
  }

  renderImageInformation(imageData);

  let imageIsLoaded = false;

  img.onload = () => {
    imageIsLoaded = true;
    imageContainer.innerHTML = "";
    imageContainer.style.backgroundImage = `url(${imageUrl})`;
  };

  img.src = imageUrl;

  const loadingTimer = () => {
    if (imageIsLoaded) {
      return;
    }
    img.onload = img.onerror = function () {};
    clearTimer();
    imageContainer.innerHTML = renderTimeoutError();
    imageContainer.style.backgroundImage = ``;
  };

  timer = setTimeout(loadingTimer, 5000);
}

function renderTimeoutError() {
  return "<H2>Ooops... Something went wrong. Timed out.</H2>";
}
