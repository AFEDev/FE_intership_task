//class handleApiRequests

export class handleApiRequests {
  static isGrayscale = false;
  static page = 1;
  static options = {};
  static selectedImageId = null;
  static blur = 0;
  static listImageWidth = 200;
  static listImageHeight = 200;
  static imagesList = [];

  static fetchImagesList() {
    return fetch(`https://picsum.photos/v2/list?page=${this.page}&limit=10`)
      .then((response) => response.json())
      .then((responseJSON) => {
        return responseJSON
          ? responseJSON.map((imageData) => ({
              ...imageData,
              resized_image: `https://picsum.photos/id/${imageData.id}/${this.listImageWidth}/${this.listImageHeight}`,
            }))
          : [];
      });
  }

  static getImageUrl(imageId, imageWidth, imageHeight) {
    let imageUrl = `https://picsum.photos/id/${imageId}/${imageWidth}/${imageHeight}`;

    if (this.isGrayscale) {
      imageUrl = imageUrl + "?grayscale";
    }

    if (this.blur > 0) {
      console.log("this.blur", this.blur);
      return this.isGrayscale
        ? (imageUrl = imageUrl + `&blur=${this.blur}`)
        : (imageUrl = imageUrl + `?blur=${this.blur}`);
    }

    return imageUrl;
  }

  static getImageData(imageId) {
    return this.imagesList.find((imageData) => imageData.id === imageId);
  }

  static addPage() {
    return this.page++;
  }

  static updateImagesList(newData) {
    return (this.imagesList = [...this.imagesList, ...newData]);
  }
}
