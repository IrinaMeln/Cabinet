const hoverEffectBtns = () => {
  try {
    // Hover Effect for buttons
    //добавляет hover-эффект на кнопки
    function hoverEffect(elementParent, elementChild) {
      $(elementParent)
        .on('mouseenter', function (e) {
          const parentOffset = $(this).offset(),
            relX = e.pageX - parentOffset.left,
            relY = e.pageY - parentOffset.top;
          $(this).find(elementChild).css({ top: relY, left: relX });
        })
        .on('mouseout', function (e) {
          const parentOffset = $(this).offset(),
            relX = e.pageX - parentOffset.left,
            relY = e.pageY - parentOffset.top;
          $(this).find(elementChild).css({ top: relY, left: relX });
        });
    }

    hoverEffect('.js-hover-btn', '.span');
  } catch (e) {
    console.error('Error in Hover Effect for buttons ', e);
  }
};

export default hoverEffectBtns;
