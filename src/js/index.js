function requireAll(r) {
  r.keys().forEach(r);
}

// Libs
import '@/libs/css/normalize';
import '@/libs/css/fancybox';
import '@/libs/css/splide.min';
// Main css
import '@/styles/style';

// JS Modules
import MyFunctions from '@/js/modules/MyFunctions';
import other from '@/js/modules/other';
import jq from '@/js/modules/jq';
import hoverEffectBtns from '@/js/modules/hover-effect-btns';

requireAll(require.context('@/svg/', true, /\.svg$/));

window.myFunctions = new MyFunctions();

other();
jq();
hoverEffectBtns();
