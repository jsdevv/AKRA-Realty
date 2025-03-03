 import img2 from '../../images/IH1.jpg';
 import img1 from '../../images/Villa5.jpg';
 import img3 from '../../images/Villa8.jpg';


 const propertyImages = [
  img2,
  img1,
  img3    
];

let imageIndex = 0;

export const getNextImage = () => {
    const image = propertyImages[imageIndex];
    imageIndex = (imageIndex + 1) % propertyImages.length;
    return image;
};


export default propertyImages;
