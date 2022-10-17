const jq = () => {
  console.log('JQuery is working! ', $('nav'));
  myFunctions.importScript(
    'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js'
  );
  console.log(myFunctions.classof({}));

  const lazyLoadInstance = new LazyLoad();

  const scene = document.getElementById('scene');
  if (scene) {
    const parallaxInstance = new Parallax(scene);
  }
};

export default jq;
