const other = () => {
  console.log('I am Other module');

  const splideWrap = document.querySelector('.splide');
  if (splideWrap) {
    const splide = new Splide(splideWrap, {
      type: 'loop',
      autoHeight: true,
      autoplay: true,
    });
    splide.mount();
  }
  // myFunctions.fetchWithTimeout('https://picsum.photos/2000/3000', {
  //   timeout: 500,
  // });

  myFunctions.customEventSet('alex');
};

export default other;
