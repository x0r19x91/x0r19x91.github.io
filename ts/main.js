(() => {
  // ns-hugo:/mnt/d/blog/x0r19x91.github.io/themes/hugo-theme-stack/assets/ts/utils.ts
  const loadScript = function(url) {
    return new Promise((resolve) => {
      var scriptTag = document.createElement("script");
      scriptTag.src = url;
      scriptTag.onload = () => {
        resolve();
      };
      document.head.appendChild(scriptTag);
    });
  };
  const loadStyle = function(url) {
    return new Promise((resolve) => {
      var link = document.createElement("link");
      link.href = url;
      link.type = "text/css";
      link.rel = "stylesheet";
      link.onload = () => {
        resolve();
      };
      document.head.appendChild(link);
    });
  };

  // ns-hugo:/mnt/d/blog/x0r19x91.github.io/themes/hugo-theme-stack/assets/ts/gallery.ts
  var initPhotoSwipeFromDOM = function(gallerySelector) {
    var parseThumbnailElements = function(el) {
      var thumbElements = el.childNodes, numNodes = thumbElements.length, items = [], figureEl, linkEl, size, item;
      for (var i2 = 0; i2 < numNodes; i2++) {
        figureEl = thumbElements[i2];
        if (figureEl.nodeType !== 1) {
          continue;
        }
        linkEl = figureEl.children[0];
        size = linkEl.getAttribute("data-size").split("x");
        item = {
          src: linkEl.getAttribute("href"),
          w: parseInt(size[0], 10),
          h: parseInt(size[1], 10)
        };
        if (figureEl.children.length > 1) {
          item.title = figureEl.children[1].innerHTML;
        }
        if (linkEl.children.length > 0) {
          item.msrc = linkEl.children[0].getAttribute("src");
        }
        item.el = figureEl;
        items.push(item);
      }
      return items;
    };
    var closest = function closest2(el, fn) {
      return el && (fn(el) ? el : closest2(el.parentNode, fn));
    };
    var onThumbnailsClick = function(e) {
      e = e || window.event;
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
      var eTarget = e.target || e.srcElement;
      var clickedListItem = closest(eTarget, function(el) {
        return el.tagName && el.tagName.toUpperCase() === "FIGURE";
      });
      if (!clickedListItem) {
        return;
      }
      var clickedGallery = clickedListItem.parentNode, childNodes = clickedListItem.parentNode.childNodes, numChildNodes = childNodes.length, nodeIndex = 0, index;
      for (var i2 = 0; i2 < numChildNodes; i2++) {
        if (childNodes[i2].nodeType !== 1) {
          continue;
        }
        if (childNodes[i2] === clickedListItem) {
          index = nodeIndex;
          break;
        }
        nodeIndex++;
      }
      if (index >= 0) {
        openPhotoSwipe(index, clickedGallery);
      }
      return false;
    };
    var photoswipeParseHash = function() {
      var hash = window.location.hash.substring(1), params = {};
      if (hash.length < 5) {
        return params;
      }
      var vars = hash.split("&");
      for (var i2 = 0; i2 < vars.length; i2++) {
        if (!vars[i2]) {
          continue;
        }
        var pair = vars[i2].split("=");
        if (pair.length < 2) {
          continue;
        }
        params[pair[0]] = pair[1];
      }
      if (params.gid) {
        params.gid = parseInt(params.gid, 10);
      }
      return params;
    };
    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
      var pswpElement = document.querySelectorAll(".pswp")[0], gallery2, options, items;
      items = parseThumbnailElements(galleryElement);
      options = {
        galleryUID: galleryElement.getAttribute("data-pswp-uid"),
        getThumbBoundsFn: function(index2) {
          var thumbnail = items[index2].el.getElementsByTagName("img")[0], pageYScroll = window.pageYOffset || document.documentElement.scrollTop, rect = thumbnail.getBoundingClientRect();
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
        }
      };
      if (fromURL) {
        if (options.galleryPIDs) {
          for (var j = 0; j < items.length; j++) {
            if (items[j].pid == index) {
              options.index = j;
              break;
            }
          }
        } else {
          options.index = parseInt(index, 10) - 1;
        }
      } else {
        options.index = parseInt(index, 10);
      }
      if (isNaN(options.index)) {
        return;
      }
      if (disableAnimation) {
        options.showAnimationDuration = 0;
      }
      gallery2 = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
      gallery2.init();
    };
    var galleryElements = document.querySelectorAll(gallerySelector);
    for (var i = 0, l = galleryElements.length; i < l; i++) {
      galleryElements[i].setAttribute("data-pswp-uid", i + 1);
      galleryElements[i].onclick = onThumbnailsClick;
    }
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
      openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
    }
  };
  function wrap(gallery2) {
    let galleryContainer = document.createElement("div");
    galleryContainer.className = "gallery";
    let parentNode = gallery2[0].parentNode, first = gallery2[0];
    parentNode.insertBefore(galleryContainer, first);
    for (let j = 0; j < gallery2.length; ++j) {
      const width = gallery2[j].querySelector("img").width, height = gallery2[j].querySelector("img").height;
      gallery2[j].style.flexGrow = `${width * 100 / height}`;
      gallery2[j].style.flexBasis = `${width * 240 / height}px`;
      galleryContainer.appendChild(gallery2[j]);
    }
  }
  function loadPhotoSwipe() {
    const tasks = [
      loadScript("https://cdn.jsdelivr.net/npm/photoswipe@4.1.3/dist/photoswipe.min.js"),
      loadScript("https://cdn.jsdelivr.net/npm/photoswipe@4.1.3/dist/photoswipe-ui-default.min.js"),
      loadStyle("https://cdn.jsdelivr.net/npm/photoswipe@4.1.3/dist/photoswipe.min.css"),
      loadStyle("https://cdn.jsdelivr.net/npm/photoswipe@4.1.3/dist/default-skin/default-skin.min.css")
    ];
    return Promise.all(tasks);
  }
  function createGallery(selector) {
    const figures = document.querySelector(selector).querySelectorAll("figure");
    if (figures.length) {
      let currentGallery = [figures[0]];
      for (let i = 1; i < figures.length; ++i) {
        if (figures[i].previousElementSibling === currentGallery[currentGallery.length - 1]) {
          currentGallery.push(figures[i]);
        } else {
          wrap(currentGallery);
          currentGallery = [figures[i]];
        }
      }
      if (currentGallery.length > 0) {
        wrap(currentGallery);
      }
      loadPhotoSwipe().then(() => {
        const pswp = document.querySelector(".pswp");
        pswp.style.removeProperty("display");
        initPhotoSwipeFromDOM(`${selector} .gallery`);
      });
    }
  }

  // ns-hugo:/mnt/d/blog/x0r19x91.github.io/themes/hugo-theme-stack/assets/ts/color.ts
  let colorsCache = {};
  if (localStorage.hasOwnProperty("StackColorsCache")) {
    try {
      colorsCache = JSON.parse(localStorage.getItem("StackColorsCache"));
    } catch (e) {
      colorsCache = {};
    }
  }
  async function getColor(key, hash, imageURL) {
    if (!key) {
      return await Vibrant.from(imageURL).getPalette();
    }
    if (!colorsCache.hasOwnProperty(key) || colorsCache[key].hash !== hash) {
      const palette = await Vibrant.from(imageURL).getPalette();
      colorsCache[key] = {
        hash,
        Vibrant: {
          hex: palette.Vibrant.hex,
          rgb: palette.Vibrant.rgb,
          bodyTextColor: palette.Vibrant.bodyTextColor
        },
        DarkMuted: {
          hex: palette.DarkMuted.hex,
          rgb: palette.DarkMuted.rgb,
          bodyTextColor: palette.DarkMuted.bodyTextColor
        }
      };
      localStorage.setItem("StackColorsCache", JSON.stringify(colorsCache));
    }
    return colorsCache[key];
  }

  // ns-hugo:/mnt/d/blog/x0r19x91.github.io/themes/hugo-theme-stack/assets/ts/menu.ts
  let slideUp = (target, duration = 500) => {
    target.classList.add("transiting");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = target.offsetHeight + "px";
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = "0";
    target.style.paddingTop = "0";
    target.style.paddingBottom = "0";
    target.style.marginTop = "0";
    target.style.marginBottom = "0";
    window.setTimeout(() => {
      target.classList.remove("show");
      target.style.removeProperty("height");
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("transiting");
    }, duration);
  };
  let slideDown = (target, duration = 500) => {
    target.classList.add("transiting");
    target.style.removeProperty("display");
    target.classList.add("show");
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = "0";
    target.style.paddingTop = "0";
    target.style.paddingBottom = "0";
    target.style.marginTop = "0";
    target.style.marginBottom = "0";
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("transiting");
    }, duration);
  };
  let slideToggle = (target, duration = 500) => {
    if (window.getComputedStyle(target).display === "none") {
      return slideDown(target, duration);
    } else {
      return slideUp(target, duration);
    }
  };
  function menu_default() {
    const toggleMenu = document.getElementById("toggle-menu");
    if (toggleMenu) {
      toggleMenu.addEventListener("click", () => {
        if (document.getElementById("main-menu").classList.contains("transiting"))
          return;
        document.body.classList.toggle("show-menu");
        slideToggle(document.getElementById("main-menu"), 300);
        toggleMenu.classList.toggle("is-active");
      });
    }
  }

  // ns-hugo:/mnt/d/blog/x0r19x91.github.io/themes/hugo-theme-stack/assets/ts/createElement.ts
  function createElement(tag, attrs, children) {
    var element = document.createElement(tag);
    for (let name in attrs) {
      if (name && attrs.hasOwnProperty(name)) {
        let value = attrs[name];
        if (name == "dangerouslySetInnerHTML") {
          element.innerHTML = value.__html;
        } else if (value === true) {
          element.setAttribute(name, name);
        } else if (value !== false && value != null) {
          element.setAttribute(name, value.toString());
        }
      }
    }
    for (let i = 2; i < arguments.length; i++) {
      let child = arguments[i];
      if (child) {
        element.appendChild(child.nodeType == null ? document.createTextNode(child.toString()) : child);
      }
    }
    return element;
  }
  var createElement_default = createElement;

  // ts/main.ts
  /*!
  *   Hugo Theme Stack
  *
  *   @author: Jimmy Cai
  *   @website: https://jimmycai.com
  *   @link: https://github.com/CaiJimmy/hugo-theme-stack
  */
  let Stack = {
    init: () => {
      menu_default();
      if (document.querySelector(".article-content")) {
        createGallery(".article-content");
      }
      document.querySelectorAll(".color-tag").forEach(async (tag) => {
        const imageURL = tag.getAttribute("data-image"), key = tag.getAttribute("data-key"), hash = tag.getAttribute("data-hash");
        const colors = await getColor(key, hash, imageURL);
        tag.style.color = colors.Vibrant.bodyTextColor;
        tag.style.background = colors.Vibrant.hex;
      });
      const articleTile = document.querySelector(".article-list--tile");
      if (articleTile) {
        let observer = new IntersectionObserver(async (entries, observer2) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting)
              return;
            observer2.unobserve(entry.target);
            const articles = entry.target.querySelectorAll("article.has-image");
            articles.forEach(async (articles2) => {
              const image = articles2.querySelector("img"), imageURL = image.src, key = image.getAttribute("data-key"), hash = image.getAttribute("data-hash"), articleDetails = articles2.querySelector(".article-details");
              const colors = await getColor(key, hash, imageURL);
              articleDetails.style.background = `
                        linear-gradient(0deg, 
                            rgba(${colors.DarkMuted.rgb[0]}, ${colors.DarkMuted.rgb[1]}, ${colors.DarkMuted.rgb[2]}, 0.5) 0%, 
                            rgba(${colors.Vibrant.rgb[0]}, ${colors.Vibrant.rgb[1]}, ${colors.Vibrant.rgb[2]}, 0.75) 100%)`;
            });
          });
        });
        observer.observe(articleTile);
      }
    }
  };
  window.addEventListener("load", () => {
    setTimeout(function() {
      Stack.init();
    }, 0);
  });
  window.Stack = Stack;
  window.createElement = createElement_default;
})();
