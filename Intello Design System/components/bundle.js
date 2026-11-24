/* @ds-bundle: {"format":4,"namespace":"Intello","components":[{"name":"Button"},{"name":"IconButton"},{"name":"TextLink"},{"name":"VideoLink"},{"name":"Icon"},{"name":"Logo"},{"name":"Eyebrow"},{"name":"Headline"},{"name":"NavBar"},{"name":"LanguageToggle"},{"name":"Hero"},{"name":"FeatureItem"},{"name":"StatChip"},{"name":"Section"},{"name":"SectionHeader"},{"name":"ImageTile"},{"name":"ServiceCard"},{"name":"StatusBadge"},{"name":"TrackingCard"},{"name":"AboutBlock"},{"name":"StatGrid"},{"name":"TagList"},{"name":"BarList"},{"name":"ProcessList"},{"name":"PhaseTrack"},{"name":"LetterGrid"},{"name":"RouteMap"},{"name":"MapHero"}]} */
(function () {
  var React = window.React, h = React.createElement, F = React.Fragment;
  var ICONS = {"shield-check": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" /><path d=\"m9 12 2 2 4-4\" />", "package": "<path d=\"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z\" /><path d=\"M12 22V12\" /><path d=\"m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7\" /><path d=\"m7.5 4.27 9 5.15\" />", "file-text": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\" /><path d=\"M14 2v4a2 2 0 0 0 2 2h4\" /><path d=\"M10 9H8\" /><path d=\"M16 13H8\" /><path d=\"M16 17H8\" />", "headset": "<path d=\"M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z\" /><path d=\"M21 16v2a4 4 0 0 1-4 4h-5\" />", "arrow-right": "<path d=\"M5 12h14\" /><path d=\"m12 5 7 7-7 7\" />", "arrow-up-right": "<path d=\"M7 7h10v10\" /><path d=\"M7 17 17 7\" />", "play": "<polygon points=\"6 3 20 12 6 21 6 3\" />", "phone": "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\" />", "globe": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\" /><path d=\"M2 12h20\" />", "truck": "<path d=\"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2\" /><path d=\"M15 18H9\" /><path d=\"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14\" /><circle cx=\"17\" cy=\"18\" r=\"2\" /><circle cx=\"7\" cy=\"18\" r=\"2\" />", "ship": "<path d=\"M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1\" /><path d=\"M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76\" /><path d=\"M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6\" /><path d=\"M12 10v4\" /><path d=\"M12 2v3\" />", "plane": "<path d=\"M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z\" />", "clipboard-check": "<rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\" /><path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\" /><path d=\"m9 14 2 2 4-4\" />", "map-pin": "<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\" /><circle cx=\"12\" cy=\"10\" r=\"3\" />", "chart-line": "<path d=\"M3 3v16a2 2 0 0 0 2 2h16\" /><path d=\"m19 9-5 5-4-4-3 3\" />", "bot": "<path d=\"M12 8V4H8\" /><rect width=\"16\" height=\"12\" x=\"4\" y=\"8\" rx=\"2\" /><path d=\"M2 14h2\" /><path d=\"M20 14h2\" /><path d=\"M15 13v2\" /><path d=\"M9 13v2\" />", "database": "<ellipse cx=\"12\" cy=\"5\" rx=\"9\" ry=\"3\" /><path d=\"M3 5V19A9 3 0 0 0 21 19V5\" /><path d=\"M3 12A9 3 0 0 0 21 12\" />", "layers": "<path d=\"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z\" /><path d=\"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65\" /><path d=\"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65\" />", "radar": "<path d=\"M19.07 4.93A10 10 0 0 0 6.99 3.34\" /><path d=\"M4 6h.01\" /><path d=\"M2.29 9.62A10 10 0 1 0 21.31 8.35\" /><path d=\"M16.24 7.76A6 6 0 1 0 8.23 16.67\" /><path d=\"M12 18h.01\" /><path d=\"M17.99 11.66A6 6 0 0 1 15.77 16.67\" /><circle cx=\"12\" cy=\"12\" r=\"2\" /><path d=\"m13.41 10.59 5.66-5.66\" />", "route": "<circle cx=\"6\" cy=\"19\" r=\"3\" /><path d=\"M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15\" /><circle cx=\"18\" cy=\"5\" r=\"3\" />", "package-search": "<path d=\"M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14\" /><path d=\"m7.5 4.27 9 5.15\" /><polyline points=\"3.29 7 12 12 20.71 7\" /><line x1=\"12\" x2=\"12\" y1=\"22\" y2=\"12\" /><circle cx=\"18.5\" cy=\"15.5\" r=\"2.5\" /><path d=\"M20.27 17.27 22 19\" />", "check": "<path d=\"M20 6 9 17l-5-5\" />", "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><polyline points=\"12 6 12 12 16 14\" />", "building-2": "<path d=\"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z\" /><path d=\"M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2\" /><path d=\"M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2\" /><path d=\"M10 6h4\" /><path d=\"M10 10h4\" /><path d=\"M10 14h4\" /><path d=\"M10 18h4\" />", "users": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\" /><circle cx=\"9\" cy=\"7\" r=\"4\" /><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\" /><path d=\"M16 3.13a4 4 0 0 1 0 7.75\" />", "brain-circuit": "<path d=\"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z\" /><path d=\"M9 13a4.5 4.5 0 0 0 3-4\" /><path d=\"M6.003 5.125A3 3 0 0 0 6.401 6.5\" /><path d=\"M3.477 10.896a4 4 0 0 1 .585-.396\" /><path d=\"M6 18a4 4 0 0 1-1.967-.516\" /><path d=\"M12 13h4\" /><path d=\"M12 18h6a2 2 0 0 1 2 2v1\" /><path d=\"M12 8h8\" /><path d=\"M16 8V5a2 2 0 0 1 2-2\" /><circle cx=\"16\" cy=\"13\" r=\".5\" /><circle cx=\"18\" cy=\"3\" r=\".5\" /><circle cx=\"20\" cy=\"21\" r=\".5\" /><circle cx=\"20\" cy=\"8\" r=\".5\" />", "warehouse": "<path d=\"M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z\" /><path d=\"M6 18h12\" /><path d=\"M6 14h12\" /><rect width=\"12\" height=\"12\" x=\"6\" y=\"10\" />", "triangle-alert": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\" /><path d=\"M12 9v4\" /><path d=\"M12 17h.01\" />", "chevron-down": "<path d=\"m6 9 6 6 6-6\" />", "mail": "<path d=\"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7\" /><rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" />"};
  var MARK = "<path d=\"M 935.136719 579.386719 C 960.113281 555.625 971.347656 525.75 962.515625 491.351562 C 961.992188 489.300781 962.578125 486.890625 960.460938 485.171875 L 890.296875 555.964844 L 887.886719 555.546875 C 876.734375 545.882812 866.207031 535.414062 854.480469 526.488281 L 805.738281 575.585938 C 805.738281 577.351562 821.820312 590.875 824.328125 592.867188 C 827.296875 595.222656 831.207031 597.113281 834.046875 599.507812 C 840.015625 604.539062 844.660156 614.289062 847.925781 621.355469 C 849.523438 624.804688 848.816406 628.320312 853.273438 628.652344 C 866.402344 629.625 880.984375 628.097656 894.246094 628.359375 C 895.5 627.742188 896.5625 622.585938 897.269531 620.941406 C 905.363281 602.09375 920.933594 592.898438 935.136719 579.386719 M 930.835938 440.316406 C 903.136719 418.695312 867.753906 414.011719 835.453125 427.742188 C 792.207031 446.125 768.859375 496.183594 784.0625 541.21875 C 785.03125 544.089844 791.585938 559.449219 794.019531 559.878906 L 852.867188 501.121094 L 855.082031 501.261719 L 887.109375 529.96875 L 890.359375 529.378906 L 952.414062 466.628906 C 952.6875 465.957031 952.488281 465.464844 952.207031 464.851562 C 951.113281 462.46875 946.59375 456.585938 944.769531 454.269531 C 940.964844 449.441406 935.683594 444.097656 930.835938 440.316406 M 947.902344 430.941406 C 950.816406 433.636719 955.1875 438.171875 957.722656 441.183594 C 959.273438 443.03125 965.003906 452 966.511719 451.996094 L 980.5625 438.15625 C 981.175781 436.394531 970.175781 427.636719 971.179688 426.90625 L 1015.429688 416.46875 C 1015.800781 416.390625 1016.011719 418.265625 1015.945312 418.730469 C 1014.917969 425.984375 1011.546875 435.320312 1009.777344 442.695312 C 1009.539062 443.683594 1009.757812 444.742188 1009.519531 445.734375 C 1008.257812 450.957031 1006.484375 456.222656 1005.796875 461.527344 C 1004.839844 461.777344 1004.699219 461.125 1004.148438 460.707031 C 1001.515625 458.710938 998.535156 453.875 995.664062 452.152344 C 994.910156 451.703125 994.480469 451.410156 993.539062 451.699219 L 975.570312 469.625 C 975.023438 471.617188 977.375 475.332031 978.035156 477.476562 C 992.984375 525.898438 977.894531 566.777344 940.960938 599.230469 C 930.238281 608.652344 918.984375 614.472656 914 628.878906 C 912.710938 632.613281 912.21875 637.167969 910.566406 640.835938 C 910.226562 641.585938 907.597656 645.960938 907.191406 646.253906 C 905.675781 647.335938 900.578125 646.609375 898.335938 646.746094 C 887.675781 647.378906 877.175781 647.199219 866.460938 647.292969 C 859.449219 647.355469 852.164062 648.480469 845.058594 647.859375 C 840.503906 647.457031 836.183594 646.125 834.222656 641.65625 C 831.980469 636.539062 832.351562 630.839844 830.453125 625.636719 C 826.59375 615.070312 812.824219 607.441406 804.652344 600.328125 C 802.816406 598.730469 793.816406 589.113281 792.835938 589.007812 C 792.203125 588.941406 791.597656 589.117188 791.144531 589.578125 C 780.394531 599.953125 770.222656 611.960938 759.320312 622.011719 C 756.199219 624.886719 750.957031 630.613281 746.683594 630.3125 C 738.535156 629.738281 735.484375 620.183594 740.433594 614.136719 C 746.351562 606.910156 756.339844 598.777344 763.1875 591.824219 C 766.074219 588.894531 768.800781 585.652344 771.667969 582.714844 C 773.175781 581.175781 780.1875 575.144531 780.386719 573.835938 C 777.363281 568.34375 773.828125 563.085938 771.210938 557.367188 C 748.925781 508.621094 766.53125 449.984375 810.777344 420.652344 C 853.296875 392.460938 910.335938 396.164062 947.902344 430.941406 \"/><path d=\"M 835.785156 656.1875 L 908.164062 656.199219 C 911.65625 657.394531 910.644531 674.304688 910.65625 677.753906 L 906.074219 679.21875 L 837.046875 678.957031 C 835.246094 678.460938 834.566406 678.089844 834.308594 676.199219 C 833.839844 672.757812 833.96875 663.269531 834.335938 659.6875 C 834.441406 658.664062 834.761719 656.53125 835.785156 656.1875 \"/><path d=\"M 904.03125 687.574219 C 908.488281 687.578125 910.175781 688.382812 909.582031 693.164062 C 906.222656 720.152344 847.25 723.59375 837.519531 697.171875 C 836.277344 693.800781 834.289062 688.425781 839.546875 687.980469 C 861.015625 688.46875 882.648438 687.550781 904.03125 687.574219 \"/>";
  var WORD = "<path transform=\"translate(673.9814 814.0288)\" d=\"M 5.078125 -62.4375 L 26.125 -62.4375 L 26.125 0 L 5.078125 0 Z M 5.078125 -62.4375 \"/><path transform=\"translate(705.194925 814.0288)\" d=\"M 66.625 -62.4375 L 66.625 0 L 49.328125 0 L 25.59375 -28.359375 L 25.59375 0 L 5.078125 0 L 5.078125 -62.4375 L 22.390625 -62.4375 L 46.109375 -34.0625 L 46.109375 -62.4375 Z M 66.625 -62.4375 \"/><path transform=\"translate(776.896851 814.0288)\" d=\"M 18.640625 -46.109375 L 0.359375 -46.109375 L 0.359375 -62.4375 L 57.96875 -62.4375 L 57.96875 -46.109375 L 39.6875 -46.109375 L 39.6875 0 L 18.640625 0 Z M 18.640625 -46.109375 \"/><path transform=\"translate(835.221552 814.0288)\" d=\"M 56.984375 -15.875 L 56.984375 0 L 5.078125 0 L 5.078125 -62.4375 L 55.828125 -62.4375 L 55.828125 -46.5625 L 25.78125 -46.5625 L 25.78125 -39.25 L 52.171875 -39.25 L 52.171875 -24.078125 L 25.78125 -24.078125 L 25.78125 -15.875 Z M 56.984375 -15.875 \"/><path transform=\"translate(895.240702 814.0288)\" d=\"M 5.078125 -62.4375 L 26.125 -62.4375 L 26.125 -16.328125 L 54.3125 -16.328125 L 54.3125 0 L 5.078125 0 Z M 5.078125 -62.4375 \"/><path transform=\"translate(950.265687 814.0288)\" d=\"M 5.078125 -62.4375 L 26.125 -62.4375 L 26.125 -16.328125 L 54.3125 -16.328125 L 54.3125 0 L 5.078125 0 Z M 5.078125 -62.4375 \"/><path transform=\"translate(1004.398857 814.0288)\" d=\"M 37.8125 1.421875 C 31.09375 1.421875 25.054688 0.0234375 19.703125 -2.765625 C 14.359375 -5.554688 10.171875 -9.429688 7.140625 -14.390625 C 4.109375 -19.359375 2.59375 -24.96875 2.59375 -31.21875 C 2.59375 -37.457031 4.109375 -43.054688 7.140625 -48.015625 C 10.171875 -52.984375 14.359375 -56.863281 19.703125 -59.65625 C 25.054688 -62.457031 31.09375 -63.859375 37.8125 -63.859375 C 44.53125 -63.859375 50.566406 -62.457031 55.921875 -59.65625 C 61.273438 -56.863281 65.46875 -52.984375 68.5 -48.015625 C 71.53125 -43.054688 73.046875 -37.457031 73.046875 -31.21875 C 73.046875 -24.96875 71.53125 -19.359375 68.5 -14.390625 C 65.46875 -9.429688 61.273438 -5.554688 55.921875 -2.765625 C 50.566406 0.0234375 44.53125 1.421875 37.8125 1.421875 Z M 37.8125 -15.609375 C 40.425781 -15.609375 42.789062 -16.242188 44.90625 -17.515625 C 47.019531 -18.796875 48.695312 -20.609375 49.9375 -22.953125 C 51.1875 -25.304688 51.8125 -28.0625 51.8125 -31.21875 C 51.8125 -34.363281 51.1875 -37.109375 49.9375 -39.453125 C 48.695312 -41.804688 47.019531 -43.625 44.90625 -44.90625 C 42.789062 -46.1875 40.425781 -46.828125 37.8125 -46.828125 C 35.195312 -46.828125 32.832031 -46.1875 30.71875 -44.90625 C 28.613281 -43.625 26.9375 -41.804688 25.6875 -39.453125 C 24.4375 -37.109375 23.8125 -34.363281 23.8125 -31.21875 C 23.8125 -28.0625 24.4375 -25.304688 25.6875 -22.953125 C 26.9375 -20.609375 28.613281 -18.796875 30.71875 -17.515625 C 32.832031 -16.242188 35.195312 -15.609375 37.8125 -15.609375 Z M 37.8125 -15.609375 \"/>";
  var C = { yellow: '#f6e71a', navy: '#2d2d45', blue: '#4d72a6', white: '#ffffff', black: '#000000' };

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function rest(p, keys) { var o = {}; for (var k in p) if (keys.indexOf(k) < 0) o[k] = p[k]; return o; }

  function Icon(p) {
    var size = p.size || 24;
    return h('svg', { className: cx('itl-icon', p.className), width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: p.strokeWidth || 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': p.label ? undefined : 'true', role: p.label ? 'img' : undefined, 'aria-label': p.label, dangerouslySetInnerHTML: { __html: ICONS[p.name] || '' } });
  }

  /* Logo: real paths from the brand manual. tone picks the manual's colour version. */
  var TONES = {
    'on-navy': [C.yellow, C.blue], 'on-blue': [C.yellow, C.navy], navy: [C.navy, C.navy],
    blue: [C.blue, C.blue], white: [C.white, C.white], black: [C.black, C.black], 'on-light': [C.navy, C.navy]
  };
  function markSvg(fill, height) {
    return h('svg', { viewBox: '738 401.5 278.5 314.5', height: height, width: height * 278.5 / 314.5, 'aria-hidden': 'true' }, h('g', { fill: fill, dangerouslySetInnerHTML: { __html: MARK } }));
  }
  function wordSvg(fill, height) {
    return h('svg', { viewBox: '679 749.5 398.5 66.5', height: height, width: height * 398.5 / 66.5, 'aria-hidden': 'true' }, h('g', { fill: fill, dangerouslySetInnerHTML: { __html: WORD } }));
  }
  function Logo(p) {
    if (p.tone === 'auto') return h('span', { className: 'itl-logo-auto' }, h(Logo, Object.assign({}, p, { tone: 'navy' })), h(Logo, Object.assign({}, p, { tone: 'on-navy' })));
    var tone = TONES[p.tone || 'navy'] || TONES.navy, layout = p.layout || 'stacked', size = p.size || (layout === 'stacked' ? 200 : 36);
    var label = h('span', { style: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' } }, 'Intello');
    if (layout === 'mark') return h('span', { className: 'itl-logo', role: 'img', 'aria-label': 'Intello' }, markSvg(tone[0], size));
    if (layout === 'horizontal') return h('span', { className: 'itl-logo', role: 'img', 'aria-label': 'Intello' }, markSvg(tone[0], size), wordSvg(tone[1], size * 0.42));
    /* stacked: the manual's only lockup; size = width in px (min 200 on screen) */
    return h('span', { className: 'itl-logo itl-logo-stacked', role: 'img', 'aria-label': 'Intello' },
      h('svg', { viewBox: '679 401.5 399 414.5', width: size, height: size * 414.5 / 399, 'aria-hidden': 'true' },
        h('g', { fill: tone[0], dangerouslySetInnerHTML: { __html: MARK } }), h('g', { fill: tone[1], dangerouslySetInnerHTML: { __html: WORD } })), label);
  }

  function Button(p) {
    var variant = p.variant || 'primary', size = p.size || 'md', arrow = p.arrow != null ? p.arrow : variant !== 'ghost';
    var tag = p.href ? 'a' : 'button';
    var props = rest(p, ['variant', 'size', 'arrow', 'block', 'children', 'className']);
    props.className = cx('itl-btn', 'itl-btn-' + variant, size !== 'md' && 'itl-btn-' + size, p.block && 'itl-btn-block', p.className);
    if (tag === 'button' && !props.type) props.type = 'button';
    return h(tag, props, h('span', null, p.children), arrow ? h(Icon, { name: 'arrow-right', size: 18, strokeWidth: 2, className: 'itl-btn-arrow' }) : null);
  }

  function IconButton(p) {
    var tag = p.href ? 'a' : 'button';
    var props = rest(p, ['icon', 'variant', 'size', 'label', 'className', 'iconSize']);
    props.className = cx('itl-iconbtn', 'itl-iconbtn-' + (p.variant || 'outline'), p.size && p.size !== 'md' && 'itl-iconbtn-' + p.size, p.className);
    props['aria-label'] = p.label;
    if (tag === 'button' && !props.type) props.type = 'button';
    var s = p.iconSize || (p.size === 'lg' ? 22 : p.size === 'sm' ? 16 : 18);
    return h(tag, props, h(Icon, { name: p.icon || 'arrow-right', size: s, strokeWidth: 2 }));
  }

  function TextLink(p) {
    var props = rest(p, ['children', 'className']);
    props.className = cx('itl-link', p.className);
    return h('a', props, p.children, h(Icon, { name: 'arrow-right', size: 18, strokeWidth: 2 }));
  }

  function VideoLink(p) {
    var lines = String(p.children || '').split('\n');
    return h('a', { className: 'itl-videolink', href: p.href || '#', onClick: p.onClick },
      h('span', { className: 'itl-iconbtn itl-iconbtn-light itl-iconbtn-lg' }, h(Icon, { name: 'play', size: 20, strokeWidth: 2 })),
      h('span', null, lines.map(function (l, i) { return h(F, { key: i }, i ? h('br') : null, l); })));
  }

  function Eyebrow(p) { return h('p', { className: cx('itl-eyebrow', p.dot && 'itl-eyebrow-dot', p.className) }, p.children); }

  /* Two-tone headline: `children` in ink, `muted` in ink-subtle, `accent` in Light Italic. */
  function Headline(p) {
    var level = p.level || 'h1', tag = p.as || (level === 'display' ? 'h1' : level);
    return h(tag, { className: cx('itl-title', 'itl-title-' + level, p.className) }, p.children,
      p.accent ? h(F, null, ' ', h('span', { className: cx('itl-title-accent', p.accentMuted && 'itl-title-muted') }, p.accent)) : null,
      p.muted ? h(F, null, ' ', h('span', { className: 'itl-title-muted' }, p.muted)) : null);
  }

  /* NavBar: desktop row at 900px and above; below 900px a native <details> menu (works without JavaScript). */
  function NavBar(p) {
    var links = p.links || [];
    function linkList(cls) {
      return h('ul', { className: cls }, links.map(function (l, i) {
        return h('li', { key: i }, h('a', { href: l.href || '#', 'aria-current': l.active ? 'page' : undefined }, l.label));
      }));
    }
    function contact() {
      return p.phone ? h('a', { className: 'itl-nav-contact', href: 'tel:' + String(p.phone).replace(/[^+\d]/g, '') }, p.phone, p.hours ? h('small', null, p.hours) : null) : null;
    }
    function cta() { return p.cta ? h(Button, { variant: 'primary', size: 'sm', href: p.cta.href || '#' }, p.cta.label) : null; }
    return h('header', { className: 'itl-root itl-header' }, h('nav', { className: 'itl-nav', 'aria-label': p.ariaLabel || 'Principal' },
      h('a', { className: 'itl-nav-logo', href: p.homeHref || '#' }, h(Logo, { layout: 'horizontal', tone: p.logoTone || 'auto', size: 36 })),
      linkList('itl-nav-links'),
      h('div', { className: 'itl-nav-right' }, p.language ? h(LanguageToggle, p.language) : null, contact(), cta()),
      h('details', { className: 'itl-nav-menu' },
        h('summary', { className: 'itl-nav-menu-btn' }, h('span', null, p.menuLabel || 'Menú'), h(Icon, { name: 'chevron-down', size: 18, strokeWidth: 2, className: 'itl-nav-menu-icon' })),
        h('div', { className: 'itl-nav-menu-panel' },
          linkList('itl-nav-menu-links'),
          p.language ? h(LanguageToggle, p.language) : null,
          contact(),
          cta()))));
  }


  /* Segmented ES / EN switch. Controlled (value + onChange) or uncontrolled (defaultValue). */
  var LANGS = [{ code: 'es', label: 'ES', name: 'Español' }, { code: 'en', label: 'EN', name: 'English' }];
  function LanguageToggle(p) {
    var langs = p.languages || LANGS;
    var st = React.useState(p.defaultValue || langs[0].code), inner = st[0], setInner = st[1];
    var value = p.value != null ? p.value : inner;
    function pick(code) { if (code === value) return; if (p.value == null) setInner(code); if (p.onChange) p.onChange(code); }
    return h('div', { className: cx('itl-lang', p.className), role: 'group', 'aria-label': p.label || 'Idioma / Language' },
      p.icon !== false ? h(Icon, { name: 'globe', size: 16, strokeWidth: 1.75, className: 'itl-lang-icon' }) : null,
      langs.map(function (l) {
        var on = l.code === value;
        // Link mode: when an option has an href it renders a real <a>, so switching works without JavaScript.
        if (l.href) return h('a', { key: l.code, href: l.href, rel: l.rel, hrefLang: l.code, className: cx('itl-lang-opt', on && 'is-active'), 'aria-current': on ? 'true' : undefined, lang: l.code, title: l.name, 'aria-label': l.name + ', ' + l.label, onClick: function () { if (!on && p.onChange) p.onChange(l.code); } }, l.label);
        return h('button', { key: l.code, type: 'button', className: cx('itl-lang-opt', on && 'is-active'), 'aria-pressed': on ? 'true' : 'false', lang: l.code, title: l.name, 'aria-label': l.name + ', ' + l.label, onClick: function () { pick(l.code); } }, l.label);
      }));
  }

  function FeatureItem(p) {
    return h('li', { className: 'itl-feature' }, h(Icon, { name: p.icon, size: 28 }), h('span', null, p.children));
  }

  function StatChip(p) {
    var badges = p.badges || [];
    return h('div', { className: cx('itl-statchip', p.className) },
      badges.length ? h('span', { className: 'itl-statchip-badges', 'aria-hidden': 'true' }, badges.map(function (b, i) {
        return h('span', { key: i, className: 'itl-statchip-badge' }, ICONS[b] ? h(Icon, { name: b, size: 18, strokeWidth: 2 }) : b);
      })) : null,
      h('span', null, h('span', { className: 'itl-statchip-value' }, p.value), h('span', { className: 'itl-statchip-label' }, p.label)));
  }

  function StatusBadge(p) {
    var map = { transit: ['En tránsito', 'truck'], delivered: ['Entregado', 'check'], delayed: ['Demorado', 'clock'], issue: ['Incidencia', 'triangle-alert'] };
    var s = map[p.status || 'transit'];
    return h('span', { className: 'itl-status itl-status-' + (p.status || 'transit') }, h(Icon, { name: s[1], size: 14, strokeWidth: 2.25 }), p.children || s[0]);
  }

  function TrackingCard(p) {
    var steps = p.steps || [];
    return h('div', { className: cx('itl-track', p.className) },
      h('div', { className: 'itl-track-head' },
        h('div', null, h('span', { className: 'itl-track-meta' }, p.label || 'Envío'), h('span', { className: 'itl-track-id' }, p.id)),
        h(StatusBadge, { status: p.status || 'transit' }, p.statusLabel)),
      h('div', { className: 'itl-track-route' },
        h('div', null, h('b', null, p.from), h('span', null, p.fromMeta)),
        h(Icon, { name: 'arrow-right', size: 18 }),
        h('div', null, h('b', null, p.to), h('span', null, p.toMeta))),
      p.progress != null ? h('div', { className: 'itl-track-bar', role: 'progressbar', 'aria-valuenow': p.progress, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-label': 'Progreso del envío' }, h('i', { style: { width: p.progress + '%' } })) : null,
      steps.length ? h('ol', { className: 'itl-track-steps' }, steps.map(function (s, i) {
        return h('li', { key: i, 'data-done': s.state === 'done' ? '' : undefined, 'data-current': s.state === 'current' ? '' : undefined },
          h('span', { className: 'itl-track-dot' }, s.state === 'done' ? h(Icon, { name: 'check', size: 12, strokeWidth: 3 }) : s.state === 'current' ? h(Icon, { name: 'truck', size: 12, strokeWidth: 2.5 }) : null),
          h('span', null, s.label), h('span', { className: 'itl-track-meta' }, s.time));
      })) : null);
  }

  function Section(p) {
    return h('section', { className: cx('itl-root', 'itl-section', 'itl-section-' + (p.tone || 'card'), p.overlap && 'itl-overlap', p.className), id: p.id }, p.children);
  }

  function SectionHeader(p) {
    return h('div', { className: 'itl-sechead' },
      h('div', { className: 'itl-sechead-text' }, p.eyebrow ? h(Eyebrow, null, p.eyebrow) : null,
        h(Headline, { level: p.level || 'h1', as: p.as || 'h2', muted: p.muted, accent: p.accent, accentMuted: p.accentMuted }, p.title),
        p.lede ? h('p', { className: 'itl-lede' }, p.lede) : null),
      p.action ? h(TextLink, { href: p.action.href || '#' }, p.action.label) : null);
  }

  /* Rounded photo. No src → an art-direction slot (paper well + icon + what the photo should show).
     height is the CSS height of the tile; imageWidth / imageHeight are the picture's pixel size (stops layout shift).
     srcSet / sizes give responsive files; priority marks the one image that is loaded eagerly (the LCP image). */
  function ImageTile(p) {
    var style = { aspectRatio: p.ratio || '4 / 5', height: p.height };
    if (p.src) return h('figure', { className: cx('itl-tile', p.color && 'itl-tile-color', p.className), style: style },
      h('img', { src: p.src, srcSet: p.srcSet, sizes: p.sizes, width: p.imageWidth, height: p.imageHeight, alt: p.alt || '', loading: p.priority ? 'eager' : 'lazy', fetchpriority: p.priority ? 'high' : undefined, decoding: p.priority ? undefined : 'async' }));
    return h('figure', { className: cx('itl-tile itl-tile-empty', p.className), style: style, 'aria-label': p.alt },
      h(Icon, { name: p.icon || 'warehouse', size: 40, strokeWidth: 1.25 }), p.alt ? h('figcaption', null, p.alt) : null);
  }

  /* ServiceCard image: a src string, or { src, srcSet, sizes, imageWidth, imageHeight, alt } for responsive files. */
  function serviceImage(im) {
    var o = typeof im === 'string' ? { src: im } : im;
    return h('img', { src: o.src, srcSet: o.srcSet, sizes: o.sizes, width: o.imageWidth, height: o.imageHeight, alt: o.alt || '', loading: 'lazy', decoding: 'async' });
  }
  /* ServiceCard. variant="overlay" (needs an image): the photo fills the card and the text sits on a dark glass panel. */
  function ServiceCard(p) {
    var overlay = p.variant === 'overlay' && p.image;
    return h('a', { className: cx('itl-service', overlay && 'itl-service-overlay'), href: p.href || '#' },
      h('div', { className: 'itl-service-media' }, p.image ? serviceImage(p.image) : h(Icon, { name: p.icon || 'package', size: 56, strokeWidth: 1.1 })),
      h('div', { className: 'itl-service-body' },
        h('h3', { className: 'itl-service-title' }, p.title),
        h('div', { className: 'itl-service-foot' },
          h('ul', { className: 'itl-bullets' }, (p.bullets || []).map(function (b, i) { return h('li', { key: i }, b); })),
          h('span', { className: 'itl-iconbtn itl-iconbtn-outline', 'aria-hidden': 'true' }, h(Icon, { name: 'arrow-right', size: 18, strokeWidth: 2 })))));
  }

  /* Hero: copy column + media column. media defaults to the navy route panel. */
  function HeroPanel() {
    var dots = [];
    for (var y = 24; y < 520; y += 32) for (var x = 24; x < 620; x += 32) dots.push(h('circle', { key: x + '-' + y, className: 'dot', cx: x, cy: y, r: 1.5 }));
    return h('div', { className: 'itl-hero-panel', 'aria-hidden': 'true' },
      h('svg', { viewBox: '0 0 600 520', preserveAspectRatio: 'xMaxYMid slice' }, dots,
        h('path', { className: 'route', d: 'M88 120 C 200 140, 240 240, 330 230 S 470 300, 520 420' }),
        h('circle', { className: 'pin-ring', cx: 88, cy: 120, r: 14 }), h('circle', { className: 'pin', cx: 88, cy: 120, r: 6 }),
        h('circle', { className: 'pin-ring', cx: 330, cy: 230, r: 14 }), h('circle', { className: 'pin', cx: 330, cy: 230, r: 6 }),
        h('circle', { className: 'pin', cx: 520, cy: 420, r: 6 })));
  }
  function Hero(p) {
    var immersive = p.variant === 'immersive' && p.media;
    var panel = immersive && p.features ? h('ul', { className: 'itl-featurepanel' }, p.features.map(function (f, i) {
      return h('li', { key: i, className: 'itl-featurepanel-item' },
        h('span', { className: 'itl-featurepanel-icon' }, h(Icon, { name: f.icon, size: 22, strokeWidth: 1.5 })),
        f.title ? h('h3', { className: 'itl-featurepanel-title' }, f.title) : null,
        h('p', { className: 'itl-featurepanel-text' }, f.text));
    })) : null;
    return h('section', { className: cx('itl-root', 'itl-hero', p.media && 'itl-hero-wide', immersive && 'itl-hero-immersive') },
      h('div', { className: 'itl-hero-copy' },
        p.eyebrow ? h(Eyebrow, null, p.eyebrow) : null,
        h(Headline, { level: 'display', muted: p.titleMuted, accent: p.titleAccent, accentMuted: true }, p.title),
        p.lede ? h('p', { className: 'itl-lede' }, p.lede) : null,
        h('div', { className: 'itl-hero-ctas' },
          p.cta ? h(Button, { variant: immersive ? 'accent' : 'primary', size: 'lg', href: p.cta.href || '#' }, p.cta.label) : null,
          p.video ? h(VideoLink, { href: p.video.href }, p.video.label) : null),
        p.features && !immersive ? h('ul', { className: 'itl-features' }, p.features.map(function (f, i) { return h(FeatureItem, { key: i, icon: f.icon }, f.text); })) : null),
      h('div', { className: 'itl-hero-media' }, p.media ? h('div', { className: 'itl-hero-image' }, p.media) : h(HeroPanel), p.tracking ? h(TrackingCard, p.tracking) : null, p.stat ? h(StatChip, p.stat) : null),
      panel);
  }

  /* AboutBlock: copy, note and call to action grouped on the left; two equal photos, staggered, on the right. */
  function AboutBlock(p) {
    return h('div', { className: 'itl-about' },
      h('div', { className: 'itl-about-copy' },
        p.eyebrow ? h(Eyebrow, null, p.eyebrow) : null,
        h(Headline, { level: 'h2', as: 'h2', accent: p.titleAccent, accentMuted: true }, p.title),
        p.body ? h('p', { className: 'itl-body' }, p.body) : null,
        p.note ? h('div', { className: 'itl-about-note' }, h(Icon, { name: p.noteIcon || 'globe', size: 24 }), h('span', null, p.note)) : null,
        p.cta ? h('div', { className: 'itl-about-cta' }, h(Button, { variant: 'outline', href: p.cta.href || '#' }, p.cta.label)) : null),
      h('div', { className: 'itl-about-media' },
        h(ImageTile, Object.assign({}, p.imageA || {}, { ratio: '4 / 5', height: undefined })),
        h(ImageTile, Object.assign({}, p.imageB || {}, { ratio: '4 / 5', height: undefined }))));
  }



  /* ---------- Additions for the website (see contracts/design-system-additions.md) ---------- */

  /* Skip link: first focusable element on a page; visible on focus only. */
  function SkipLink(p) { return h('a', { className: 'itl-skip', href: p.href || '#main' }, p.children); }

  /* Footer: navy band with logo, tagline, language toggle, link columns, contact details and legal line. */
  function Footer(p) {
    var cols = p.columns || [], c = p.contact || {}, legal = p.legal || {};
    return h('footer', { className: 'itl-root itl-footer' },
      h('div', { className: 'itl-footer-inner' },
        h('div', { className: 'itl-footer-brand' },
          h('a', { className: 'itl-footer-logo', href: p.homeHref || '#' }, h(Logo, { layout: 'horizontal', tone: p.logoTone || 'on-navy', size: 36 })),
          p.tagline ? h('p', { className: 'itl-footer-tagline' }, p.tagline) : null,
          p.language ? h(LanguageToggle, p.language) : null),
        cols.map(function (col, i) {
          return h('nav', { key: i, className: 'itl-footer-col', 'aria-label': col.heading },
            h('h2', { className: 'itl-footer-head' }, col.heading),
            h('ul', null, (col.links || []).map(function (l, j) { return h('li', { key: j }, h('a', { href: l.href || '#' }, l.label)); })));
        }),
        c.heading ? h('div', { className: 'itl-footer-col' },
          h('h2', { className: 'itl-footer-head' }, c.heading),
          c.phone ? h('a', { className: 'itl-footer-phone', href: c.phoneHref || ('tel:' + String(c.phone).replace(/[^+\d]/g, '')) }, c.phone) : null,
          c.hours ? h('p', { className: 'itl-footer-text' }, c.hours) : null,
          c.address ? h('p', { className: 'itl-footer-text' }, c.address) : null) : null),
      h('div', { className: 'itl-footer-legal' },
        legal.text ? h('p', null, legal.text) : null,
        legal.links && legal.links.length ? h('ul', null, legal.links.map(function (l, i) { return h('li', { key: i }, h('a', { href: l.href || '#' }, l.label)); })) : null));
  }

  /* CtaBand: closing call to action on navy. Copy and buttons grouped on the left; the brand route motif on the right
     (decorative, hidden from assistive technology). One yellow accent family: the route and the accent button. */
  function CtaRoute() {
    var dots = [];
    for (var y = 20; y < 300; y += 28) for (var x = 20; x < 520; x += 28) dots.push(h('circle', { key: x + '-' + y, className: 'dot', cx: x, cy: y, r: 1.5 }));
    return h('svg', { className: 'itl-cta-art', viewBox: '0 0 520 300', preserveAspectRatio: 'xMaxYMid slice', 'aria-hidden': 'true', focusable: 'false' }, dots,
      h('path', { className: 'route', d: 'M60 230 C 150 220, 170 120, 260 140 S 400 60, 470 80' }),
      h('circle', { className: 'pin-ring', cx: 60, cy: 230, r: 14 }), h('circle', { className: 'pin', cx: 60, cy: 230, r: 6 }),
      h('circle', { className: 'pin-ring', cx: 260, cy: 140, r: 14 }), h('circle', { className: 'pin', cx: 260, cy: 140, r: 6 }),
      h('circle', { className: 'pin', cx: 470, cy: 80, r: 6 }));
  }
  function CtaBand(p) {
    return h(Section, { tone: 'navy', className: 'itl-cta' },
      h('div', { className: 'itl-cta-inner' },
        h('div', { className: 'itl-cta-copy' },
          p.eyebrow ? h(Eyebrow, { dot: true }, p.eyebrow) : null,
          h(Headline, { level: 'h1', as: 'h2', accent: p.titleAccent }, p.title),
          p.body ? h('p', { className: 'itl-lede' }, p.body) : null,
          h('div', { className: 'itl-cta-actions' },
            p.cta ? h(Button, { variant: 'accent', size: 'lg', href: p.cta.href || '#' }, p.cta.label) : null,
            p.secondary ? h(Button, { variant: 'outline', size: 'lg', href: p.secondary.href || '#' }, p.secondary.label) : null)),
        h(CtaRoute)));
  }


  /* PageHero: lighter hero for inner pages (no tracking card or capability row). */
  function PageHero(p) {
    return h('section', { className: cx('itl-root', 'itl-pagehero', p.media && 'itl-pagehero-media') },
      h('div', { className: 'itl-pagehero-copy' },
        p.eyebrow ? h(Eyebrow, null, p.eyebrow) : null,
        h(Headline, { level: 'h1', as: 'h1', muted: p.titleMuted, accent: p.titleAccent, accentMuted: true }, p.title),
        p.lede ? h('p', { className: 'itl-lede' }, p.lede) : null,
        p.cta || p.secondary ? h('div', { className: 'itl-pagehero-cta' }, p.cta ? h(Button, { variant: 'primary', size: 'lg', href: p.cta.href || '#' }, p.cta.label) : null, p.secondary ? h(Button, { variant: 'outline', size: 'lg', href: p.secondary.href || '#' }, p.secondary.label) : null) : null),
      p.media ? h('div', { className: 'itl-pagehero-image' }, h(ImageTile, Object.assign({ ratio: '4 / 3' }, p.media))) : null);
  }

  /* ServiceSection: one service on the Services page. id becomes the anchor. */
  function ServiceSection(p) {
    return h('section', { className: cx('itl-root', 'itl-svcsec', p.reverse && 'itl-svcsec-reverse'), id: p.id, 'aria-labelledby': p.id ? p.id + '-title' : undefined },
      h('div', { className: 'itl-svcsec-copy' },
        p.eyebrow ? h(Eyebrow, null, p.eyebrow) : null,
        h('h2', { className: 'itl-title itl-title-h2', id: p.id ? p.id + '-title' : undefined }, p.title),
        p.summary ? h('p', { className: 'itl-body' }, p.summary) : null,
        h('ul', { className: 'itl-checklist' }, (p.deliverables || []).map(function (d, i) {
          return h('li', { key: i }, h(Icon, { name: 'check', size: 18, strokeWidth: 2 }), h('span', null, d));
        })),
        p.cta ? h('div', null, h(Button, { variant: 'primary', href: p.cta.href || '#' }, p.cta.label)) : null),
      p.image ? h('div', { className: 'itl-svcsec-media' }, h(ImageTile, Object.assign({ ratio: '4 / 3' }, p.image))) : null);
  }

  /* Steps: numbered how-it-works list. */
  function Steps(p) {
    return h('ol', { className: 'itl-steps', role: 'list' }, (p.items || []).map(function (s, i) {
      return h('li', { key: i, className: 'itl-step' },
        h('span', { className: 'itl-step-num', 'aria-hidden': 'true' }, s.icon ? h(Icon, { name: s.icon, size: 20, strokeWidth: 1.75 }) : String(i + 1)),
        h('div', { className: 'itl-step-text' }, h('h3', { className: 'itl-step-title' }, s.title), h('p', { className: 'itl-body' }, s.body)));
    }));
  }

  /* Accordion: native details/summary; keyboard-operable with no script. answer is a string or an array of paragraphs. */
  function Accordion(p) {
    return h('div', { className: 'itl-accordion' }, (p.items || []).map(function (it, i) {
      var answer = Array.isArray(it.answer) ? it.answer : [it.answer];
      return h('details', { key: it.id || i, id: it.id, className: 'itl-acc-item' },
        h('summary', { className: 'itl-acc-q' }, h('span', null, it.question), h(Icon, { name: 'chevron-down', size: 20, strokeWidth: 2, className: 'itl-acc-icon' })),
        h('div', { className: 'itl-acc-a' }, answer.map(function (t, j) { return h('p', { key: j, className: 'itl-body' }, t); })));
    }));
  }

  /* Prose: readable measure and spacing for long text such as the privacy notice. */
  function Prose(p) { return h('div', { className: cx('itl-prose', p.className) }, p.children); }

  /* Form controls. value is rendered as the initial value (the site posts and re-renders; there is no client state). */
  function controlProps(p, drop) {
    var props = rest(p, drop.concat(['invalid', 'className', 'value']));
    if (p.value != null) props.defaultValue = p.value;
    if (p.invalid) props['aria-invalid'] = 'true';
    props.className = cx('itl-input', p.invalid && 'is-invalid', p.className);
    return props;
  }
  function TextInput(p) {
    var props = controlProps(p, []);
    if (!props.type) props.type = 'text';
    return h('input', props);
  }
  function Textarea(p) {
    var props = controlProps(p, []);
    if (!props.rows) props.rows = 5;
    props.className = cx(props.className, 'itl-textarea');
    return h('textarea', props);
  }
  function Select(p) {
    var props = controlProps(p, ['options']);
    props.className = cx(props.className, 'itl-select-el');
    return h('div', { className: 'itl-select' },
      h('select', props, (p.options || []).map(function (o) { return h('option', { key: o.value, value: o.value }, o.label); })),
      h(Icon, { name: 'chevron-down', size: 18, strokeWidth: 2, className: 'itl-select-icon' }));
  }

  /* Field: visible label, optional hint and error; wires the control with aria-describedby and aria-invalid. */
  function Field(p) {
    var hintId = p.hint ? p.id + '-hint' : null, errId = p.error ? p.id + '-error' : null;
    var described = [hintId, errId].filter(Boolean).join(' ') || undefined;
    var control = React.isValidElement(p.children)
      ? React.cloneElement(p.children, { id: p.id, 'aria-describedby': described, invalid: p.error ? true : p.children.props.invalid, required: p.required || p.children.props.required })
      : p.children;
    return h('div', { className: cx('itl-field', p.error && 'has-error', p.className) },
      h('label', { className: 'itl-label', htmlFor: p.id }, p.label, p.required ? h('span', { className: 'itl-required', 'aria-hidden': 'true' }, ' *') : null),
      p.hint ? h('p', { className: 'itl-hint', id: hintId }, p.hint) : null,
      control,
      p.error ? h('p', { className: 'itl-field-error', id: errId }, h(Icon, { name: 'triangle-alert', size: 16, strokeWidth: 2 }), h('span', null, p.error)) : null);
  }

  /* FormNotice: colour is always paired with an icon and a title. */
  function FormNotice(p) {
    var v = p.variant || 'info', icon = { success: 'check', error: 'triangle-alert', info: 'file-text' }[v] || 'file-text';
    return h('div', { className: cx('itl-notice', 'itl-notice-' + v, p.className), role: p.role || (v === 'error' ? 'alert' : 'status') },
      h(Icon, { name: icon, size: 22, strokeWidth: 2 }),
      h('div', { className: 'itl-notice-body' }, p.title ? h('p', { className: 'itl-notice-title' }, p.title) : null, p.children));
  }

  /* FormErrorSummary: announced list of problems, each linking to its field. Renders nothing when there are no errors. */
  function FormErrorSummary(p) {
    var errors = p.errors || [];
    if (!errors.length) return null;
    return h('div', { className: 'itl-errsum', role: 'alert', id: p.id, tabIndex: -1 },
      h('p', { className: 'itl-errsum-title' }, h(Icon, { name: 'triangle-alert', size: 20, strokeWidth: 2 }), h('span', null, p.title)),
      h('ul', null, errors.map(function (e) { return h('li', { key: e.id }, h('a', { href: '#' + e.id }, e.message)); })));
  }

  /* Honeypot: a field only bots fill. Hidden visually and from assistive technology, skipped by the keyboard, still in the DOM. */
  function Honeypot(p) {
    return h('div', { className: 'itl-hp', 'aria-hidden': 'true' }, h('label', null, p.label || 'Website', h('input', { type: 'text', name: p.name || 'website', tabIndex: -1, autoComplete: 'off' })));
  }

  /* ---------- Numbers-first components (BPO redesign) ---------- */

  /* StatGrid: headline figures in a <dl>. item: { value, unit?, label, text? }. variant: 'rule' (editorial, top rule) | 'card'.
     The label is the <dt>; CSS shows the value first. */
  function StatGrid(p) {
    var items = p.items || [];
    return h('dl', { className: cx('itl-stats', 'itl-stats-' + (p.variant || 'rule'), p.className), style: { '--itl-cols': p.columns || items.length } },
      items.map(function (s, i) {
        return h('div', { key: i, className: 'itl-stat' },
          h('dt', { className: 'itl-stat-label' }, s.label),
          h('dd', { className: 'itl-stat-value' }, s.value, s.unit ? h('span', { className: 'itl-stat-unit' }, s.unit) : null),
          s.text ? h('dd', { className: 'itl-stat-text' }, s.text) : null);
      }));
  }

  /* TagList: short labels (capabilities, destinations). */
  function TagList(p) {
    return h('ul', { className: cx('itl-tags', p.tone && 'itl-tags-' + p.tone, p.className), role: 'list' },
      (p.items || []).map(function (t, i) { return h('li', { key: i, className: 'itl-tag' }, t); }));
  }

  /* BarList: share of a total. item: { label, value (number), display? }. The figure is always printed as text. */
  function BarList(p) {
    var items = p.items || [], max = Math.max.apply(null, items.map(function (i) { return i.value; }).concat([1]));
    return h('ul', { className: cx('itl-bars', p.className), role: 'list' }, items.map(function (it, i) {
      return h('li', { key: i, className: 'itl-bar' },
        h('span', { className: 'itl-bar-label' }, it.label),
        h('span', { className: 'itl-bar-track', 'aria-hidden': 'true' }, h('span', { className: 'itl-bar-fill', style: { width: (it.value / max * 100).toFixed(1) + '%' } })),
        h('span', { className: 'itl-bar-value' }, it.display || String(it.value)));
    }));
  }

  /* ProcessList: editorial rows (number, title, text, tags, one supporting figure). */
  function ProcessList(p) {
    return h('ol', { className: cx('itl-plist', p.className), role: 'list' }, (p.items || []).map(function (it, i) {
      return h('li', { key: i, className: 'itl-prow', id: it.id },
        h('span', { className: 'itl-prow-num', 'aria-hidden': 'true' }, (i < 9 ? '0' : '') + (i + 1)),
        h('div', { className: 'itl-prow-main' },
          h('h3', { className: 'itl-prow-title' }, it.title),
          h('p', { className: 'itl-body' }, it.text),
          it.tags ? h(TagList, { items: it.tags }) : null),
        it.figure ? h('p', { className: 'itl-prow-figure' },
          h('span', { className: 'itl-prow-value' }, it.figure.value),
          h('span', { className: 'itl-prow-flabel' }, it.figure.label)) : null);
    }));
  }

  /* PhaseTrack: an ordered sequence of phases on a rail. item: { code, title, points[] }. */
  function PhaseTrack(p) {
    return h('ol', { className: cx('itl-phases', p.className), role: 'list' }, (p.items || []).map(function (it, i) {
      return h('li', { key: i, className: 'itl-phase' },
        h('span', { className: 'itl-phase-code', 'aria-hidden': 'true' }, it.code),
        h('h3', { className: 'itl-phase-title' }, it.title),
        it.points ? h('ul', { className: 'itl-phase-points', role: 'list' }, it.points.map(function (pt, j) { return h('li', { key: j }, pt); })) : null);
    }));
  }

  /* LetterGrid: values spelled as an acronym (S.H.O.W.). item: { letter, title, text }. */
  function LetterGrid(p) {
    return h('ul', { className: cx('itl-letters', p.className), role: 'list' }, (p.items || []).map(function (it, i) {
      return h('li', { key: i, className: 'itl-letter-item' },
        h('span', { className: 'itl-letter', 'aria-hidden': 'true' }, it.letter),
        h('h3', { className: 'itl-letter-title' }, it.title),
        h('p', { className: 'itl-body' }, it.text));
    }));
  }

  /* RouteMap: illustrated route map. The continents are a static dot-grid image (land); routes, hubs and a few moving
     shipment dots are inline SVG in the same viewBox. Motion uses SVG animation (no script) and is hidden for reduced motion.
     hubs: [{ id, x, y, kind: 'o'|'d'|'b' }], routes: [{ d, weight, moving?, duration?, delay? }], labels: { hubId: text }. */
  function RouteMap(p) {
    var id = p.id || 'itl-map', labels = p.labels || {}, hubs = p.hubs || [], routes = p.routes || [], cards = p.cards || [];
    var vb = String(p.viewBox).split(/\s+/).map(Number), byId = {};
    hubs.forEach(function (hb) { byId[hb.id] = hb; });
    var pct = function (hb) { return { left: ((hb.x - vb[0]) / vb[2] * 100).toFixed(2) + '%', top: ((hb.y - vb[1]) / vb[3] * 100).toFixed(2) + '%' }; };
    var slot = p.cardSeconds || 4, cycle = (slot * cards.length) + 's';
    return h('figure', { className: cx('itl-map', p.className) },
      h('div', { className: 'itl-map-canvas', style: { '--itl-map-ratio': p.width + ' / ' + p.height } },
        h('img', { className: 'itl-map-land', src: p.land, alt: '', width: p.width, height: p.height, decoding: 'async', loading: p.priority ? 'eager' : 'lazy' }),
        h('svg', { className: 'itl-map-svg', viewBox: p.viewBox, role: 'img', 'aria-labelledby': id + '-title', focusable: 'false' },
          h('title', { id: id + '-title' }, p.title),
          h('defs', null, h('filter', { id: id + '-glow', x: '-50%', y: '-50%', width: '200%', height: '200%' },
            h('feGaussianBlur', { stdDeviation: 3, result: 'b' }),
            h('feMerge', null, h('feMergeNode', { in: 'b' }), h('feMergeNode', { in: 'SourceGraphic' })))),
          h('g', { className: 'itl-map-arcs' }, routes.map(function (r, i) {
            return h('path', { key: i, d: r.d, className: 'itl-map-arc', strokeWidth: (r.weight * 0.55).toFixed(2) });
          })),
          /* Light trails: a short dash travelling along each busy route (CSS animation, hidden for reduced motion). */
          h('g', { className: 'itl-map-trails', 'aria-hidden': 'true', filter: 'url(#' + id + '-glow)' }, routes.filter(function (r) { return r.moving; }).map(function (r, i) {
            return h('path', { key: i, d: r.d, pathLength: 100, className: 'itl-map-trail', style: { animationDuration: r.duration + 's', animationDelay: (-r.delay) + 's' } });
          })),
          h('g', { className: 'itl-map-pulses', 'aria-hidden': 'true' }, (p.pulse || []).filter(function (k) { return byId[k]; }).map(function (k, i) {
            var hb = byId[k], begin = (i * 0.8) + 's';
            return h('circle', { key: k, cx: hb.x, cy: hb.y, r: 4, className: 'itl-map-pulse', opacity: 0 },
              h('animate', { attributeName: 'r', values: '4;20', dur: '2.4s', begin: begin, repeatCount: 'indefinite' }),
              h('animate', { attributeName: 'opacity', values: '0.7;0', dur: '2.4s', begin: begin, repeatCount: 'indefinite' }));
          })),
          h('g', { className: 'itl-map-hubs' }, hubs.map(function (hb) {
            return h('circle', { key: hb.id, cx: hb.x, cy: hb.y, r: hb.kind === 'd' ? 3.6 : 4.6, className: 'itl-map-hub itl-map-hub-' + hb.kind });
          })),
          h('g', { className: 'itl-map-labels', 'aria-hidden': 'true' }, Object.keys(labels).filter(function (k) { return byId[k]; }).map(function (k) {
            var hb = byId[k];
            return h('text', { key: k, x: hb.x + 10, y: hb.y + 4, className: 'itl-map-label' }, labels[k]);
          }))),
        /* Port cards: one at a time, in a loop. Decorative (an illustrative simulation), so hidden from assistive technology. */
        cards.length ? h('div', { className: 'itl-map-cards', 'aria-hidden': 'true' }, cards.filter(function (c) { return byId[c.hub]; }).map(function (c, i) {
          var at = pct(byId[c.hub]), timing = { animationDuration: cycle, animationDelay: (i * slot) + 's' };
          return h('div', { key: i, className: 'itl-map-port', style: at },
            h('span', { className: 'itl-map-ping', style: timing }),
            h('div', { className: 'itl-hud itl-hud-' + (c.place || 'ne'), style: timing },
              h('div', { className: 'itl-hud-head' },
                h(Icon, { name: c.icon || 'ship', size: 18, strokeWidth: 1.75 }),
                h('span', { className: 'itl-hud-id' }, c.title),
                c.port ? h('span', { className: 'itl-hud-port' }, c.port) : null),
              h('div', { className: 'itl-hud-status' }, h('span', { className: 'itl-hud-dot' }), c.status),
              c.rows ? h('dl', { className: 'itl-hud-rows' }, c.rows.map(function (r, j) {
                return h('div', { key: j }, h('dt', null, r.label), h('dd', null, r.value));
              })) : null,
              c.progress != null ? h('div', { className: 'itl-hud-bar' }, h('span', { style: { width: c.progress + '%' } })) : null));
        })) : null),
      (p.legend || p.caption) ? h('figcaption', { className: 'itl-map-caption' },
        p.legend ? h(MapLegend, { items: p.legend }) : null,
        p.caption ? h('p', { className: 'itl-map-note' }, p.caption) : null) : null);
  }

  function MapLegend(p) {
    return h('ul', { className: 'itl-map-legend', role: 'list' }, (p.items || []).map(function (l) {
      return h('li', { key: l.kind }, h('span', { className: 'itl-map-key itl-map-hub-' + l.kind, 'aria-hidden': 'true' }), l.label);
    }));
  }

  /* MapHero: numbers-first home hero on navy. Copy and headline figures on top, the route map as the illustration. */
  function MapHero(p) {
    var band = p.stats || p.legend || p.note;
    return h('section', { className: 'itl-root itl-maphero', 'data-theme': 'dark' },
      h('div', { className: 'itl-maphero-inner' },
        h('div', { className: 'itl-maphero-copy' },
          p.eyebrow ? h(Eyebrow, { dot: true }, p.eyebrow) : null,
          h(Headline, { level: 'display', accent: p.titleAccent }, p.title),
          p.lede ? h('p', { className: 'itl-lede' }, p.lede) : null,
          h('div', { className: 'itl-maphero-actions' },
            p.cta ? h(Button, { variant: 'accent', size: 'lg', href: p.cta.href || '#' }, p.cta.label) : null,
            p.secondary ? h(Button, { variant: 'outline', size: 'lg', href: p.secondary.href || '#' }, p.secondary.label) : null))),
      p.map ? h('div', { className: 'itl-maphero-map' }, p.map) : null,
      p.badge ? h('p', { className: 'itl-maphero-badge' }, h('span', { className: 'itl-hud-dot', 'aria-hidden': 'true' }), p.badge) : null,
      band ? h('div', { className: 'itl-maphero-band' }, h('div', { className: 'itl-maphero-band-inner' },
        p.stats ? h(StatGrid, { items: p.stats, variant: 'rule', className: 'itl-maphero-stats' }) : null,
        (p.legend || p.note) ? h('div', { className: 'itl-maphero-key' },
          p.legend ? h(MapLegend, { items: p.legend }) : null,
          p.note ? h('p', { className: 'itl-map-note' }, p.note) : null) : null)) : null);
  }

  window.Intello = Object.assign(window.Intello || {}, {
    StatGrid: StatGrid, TagList: TagList, BarList: BarList, ProcessList: ProcessList, PhaseTrack: PhaseTrack, LetterGrid: LetterGrid,
    RouteMap: RouteMap, MapHero: MapHero,
    Button: Button, IconButton: IconButton, TextLink: TextLink, VideoLink: VideoLink, Icon: Icon, Logo: Logo,
    Eyebrow: Eyebrow, Headline: Headline, NavBar: NavBar, LanguageToggle: LanguageToggle, Hero: Hero, FeatureItem: FeatureItem, StatChip: StatChip,
    Section: Section, SectionHeader: SectionHeader, ImageTile: ImageTile, ServiceCard: ServiceCard,
    StatusBadge: StatusBadge, TrackingCard: TrackingCard, AboutBlock: AboutBlock,
    SkipLink: SkipLink, Footer: Footer, CtaBand: CtaBand, PageHero: PageHero, ServiceSection: ServiceSection, Steps: Steps, Accordion: Accordion, Prose: Prose,
    Field: Field, TextInput: TextInput, Textarea: Textarea, Select: Select, FormNotice: FormNotice, FormErrorSummary: FormErrorSummary, Honeypot: Honeypot,
    icons: Object.keys(ICONS)
  });
})();
