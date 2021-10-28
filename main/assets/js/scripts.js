// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	return el.classList.contains(className);
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	el.classList.add(classList[0]);
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	el.classList.remove(classList[0]);	
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < children.length; i++) {
    if (Util.hasClass(children[i], className)) childrenByClass.push(children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb, timeFunction) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = parseInt((progress/duration)*change + start);
    if(timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	if(cb) cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key) 
(function() {
  var focusTab = document.getElementsByClassName('js-tab-focus'),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
    outlineStyle = false;
    eventDetected = true;
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
    outlineStyle = true;
  };

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };

  function initFocusTabs() {
    if(shouldInit) {
      if(eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener('mousedown', detectClick);
  };

  initFocusTabs();
  window.addEventListener('initFocusTabs', initFocusTabs);
}());

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent('initFocusTabs'));
};
// File#: _1_animated-headline
// Usage: codyhouse.co/license
(function() {
    var TextAnim = function(element) {
      this.element = element;
      this.wordsWrapper = this.element.getElementsByClassName(' js-text-anim__wrapper');
      this.words = this.element.getElementsByClassName('js-text-anim__word');
      this.selectedWord = 0;
      // interval between two animations
      this.loopInterval = parseFloat(getComputedStyle(this.element).getPropertyValue('--text-anim-pause'))*1000 || 1000;
      // duration of single animation (e.g., time for a single word to rotate)
      this.transitionDuration = parseFloat(getComputedStyle(this.element).getPropertyValue('--text-anim-duration'))*1000 || 1000;
      // keep animating after first loop was completed
      this.loop = (this.element.getAttribute('data-loop') && this.element.getAttribute('data-loop') == 'off') ? false : true;
      this.wordInClass = 'text-anim__word--in';
      this.wordOutClass = 'text-anim__word--out';
      // check for specific animations
      this.isClipAnim = Util.hasClass(this.element, 'text-anim--clip');
      if(this.isClipAnim) {
        this.animBorderWidth = parseInt(getComputedStyle(this.element).getPropertyValue('--text-anim-border-width')) || 2;
        this.animPulseClass = 'text-anim__wrapper--pulse';
      }
      initTextAnim(this);
    };
  
    function initTextAnim(element) {
      // make sure there's a word with the wordInClass
      setSelectedWord(element);
      // if clip animation -> add pulse class
      if(element.isClipAnim) {
        Util.addClass(element.wordsWrapper[0], element.animPulseClass);
      }
      // init loop
      loopWords(element);
    };
  
    function setSelectedWord(element) {
      var selectedWord = element.element.getElementsByClassName(element.wordInClass);
      if(selectedWord.length == 0) {
        Util.addClass(element.words[0], element.wordInClass);
      } else {
        element.selectedWord = Util.getIndexInArray(element.words, selectedWord[0]);
      }
    };
  
    function loopWords(element) {
      // stop animation after first loop was completed
      if(!element.loop && element.selectedWord == element.words.length - 1) {
        return;
      }
      var newWordIndex = getNewWordIndex(element);
      setTimeout(function() {
        if(element.isClipAnim) { // clip animation only
          switchClipWords(element, newWordIndex);
        } else {
          switchWords(element, newWordIndex);
        }
      }, element.loopInterval);
    };
  
    function switchWords(element, newWordIndex) {
      // switch words
      Util.removeClass(element.words[element.selectedWord], element.wordInClass);
      Util.addClass(element.words[element.selectedWord], element.wordOutClass);
      Util.addClass(element.words[newWordIndex], element.wordInClass);
      // reset loop
      resetLoop(element, newWordIndex);
    };
  
    function resetLoop(element, newIndex) {
      setTimeout(function() { 
        // set new selected word
        Util.removeClass(element.words[element.selectedWord], element.wordOutClass);
        element.selectedWord = newIndex;
        loopWords(element); // restart loop
      }, element.transitionDuration);
    };
  
    function switchClipWords(element, newWordIndex) {
      // clip animation only
      var startWidth =  element.words[element.selectedWord].offsetWidth,
        endWidth = element.words[newWordIndex].offsetWidth;
      
      // remove pulsing animation
      Util.removeClass(element.wordsWrapper[0], element.animPulseClass);
      // close word
      animateWidth(startWidth, element.animBorderWidth, element.wordsWrapper[0], element.transitionDuration, function() {
        // switch words
        Util.removeClass(element.words[element.selectedWord], element.wordInClass);
        Util.addClass(element.words[newWordIndex], element.wordInClass);
        element.selectedWord = newWordIndex;
  
        // open word
        animateWidth(element.animBorderWidth, endWidth, element.wordsWrapper[0], element.transitionDuration, function() {
          // add pulsing class
          Util.addClass(element.wordsWrapper[0], element.animPulseClass);
          loopWords(element);
        });
      });
    };
  
    function getNewWordIndex(element) {
      // get index of new word to be shown
      var index = element.selectedWord + 1;
      if(index >= element.words.length) index = 0;
      return index;
    };
  
    function animateWidth(start, to, element, duration, cb) {
      // animate width of a word for the clip animation
      var currentTime = null;
  
      var animateProperty = function(timestamp){  
        if (!currentTime) currentTime = timestamp;         
        var progress = timestamp - currentTime;
        
        var val = Math.easeInOutQuart(progress, start, to - start, duration);
        element.style.width = val+"px";
        if(progress < duration) {
            window.requestAnimationFrame(animateProperty);
        } else {
          cb();
        }
      };
    
      //set the width of the element before starting animation -> fix bug on Safari
      element.style.width = start+"px";
      window.requestAnimationFrame(animateProperty);
    };
  
    window.TextAnim = TextAnim;
  
    // init TextAnim objects
    var textAnim = document.getElementsByClassName('js-text-anim'),
      reducedMotion = Util.osHasReducedMotion();
    if( textAnim ) {
      if(reducedMotion) return;
      for( var i = 0; i < textAnim.length; i++) {
        (function(i){ new TextAnim(textAnim[i]);})(i);
      }
    }
  }());
// File#: _1_page-transition
// Usage: codyhouse.co/license
(function() {
    var PageTransition = function(opts) {
      if(!('CSS' in window) || !CSS.supports('color', 'var(--color)')) return;
      this.element = document.getElementsByClassName('js-page-trans')[0];
      this.options = Util.extend(PageTransition.defaults , opts);
      this.cachedPages = [];
      this.anchors = false;
      this.clickFunctions = [];
      this.animating = false;
      this.newContent = false;
      this.containerClass = 'js-page-trans__content';
      this.containers = [];
      initSrRegion(this);
      pageTrInit(this);
      initBrowserHistory(this);
    };
  
    function initSrRegion(element) {
      var liveRegion = document.createElement('p');
      Util.setAttributes(liveRegion, {'class': 'sr-only', 'role': 'alert', 'aria-live': 'polite', 'id': 'page-trans-sr-live'});
      element.element.appendChild(liveRegion);
      element.srLive = document.getElementById('page-trans-sr-live');
    };
  
    function pageTrInit(element) { // bind click events
      element.anchors = document.getElementsByClassName('js-page-trans-link');
      for(var i = 0; i < element.anchors.length; i++) {
        (function(i){
          element.clickFunctions[i] = function(event) {
            event.preventDefault();
            element.updateBrowserHistory = true;
            bindClick(element, element.anchors[i].getAttribute('href'));
          };
  
          element.anchors[i].addEventListener('click', element.clickFunctions[i]);
        })(i);
      }
    };
  
    function bindClick(element, link) {
      if(element.animating) return;
      element.animating = true;
      element.link = link; 
      // most of those links will be removed from the page
      unbindClickEvents(element);
      loadPageContent(element); 
      // code that should run before the leaving animation
      if(element.options.beforeLeave) element.options.beforeLeave(element.link);
      // announce to SR new content is being loaded
      element.srLive.textContent = element.options.srLoadingMessage;
      // leaving animation
      if(!element.options.leaveAnimation) return;
      element.containers.push(element.element.getElementsByClassName(element.containerClass)[0]);
      element.options.leaveAnimation(element.containers[0], element.link, function(){
        leavingAnimationComplete(element, true);
      });
    };
  
    function unbindClickEvents(element) {
      for(var i = 0; i < element.anchors.length; i++) {
        element.anchors[i].removeEventListener('click', element.clickFunctions[i]);
      }
    };
  
    function loadPageContent(element) {
      element.newContent = false;
      var pageCache = getCachedPage(element);
      if(pageCache) {
        element.newContent = pageCache;
      } else {
        if(element.options.loadFunction) { // use a custom function to load your data
          element.options.loadFunction(element.link, function(data){
            element.newContent = data;
            element.cachedPages.push({link: element.link, content: element.newContent});
          });
        } else {
          // load page content
          var xmlHttp = new XMLHttpRequest();
          xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
              element.newContent = getContainerHTML(element, xmlHttp.responseText);
              element.cachedPages.push({link: element.link, content: element.newContent});
            }
          };
          xmlHttp.open('GET', element.link);
          xmlHttp.send();
        }
      }
    };
  
    function leavingAnimationComplete(element, triggerProgress) {
      if(element.newContent) {
        // new content has already been created
        triggerEnteringProcess(element);
      } else {
        // new content is not available yet
        if(triggerProgress && element.options.progressAnimation) element.options.progressAnimation(element.link);
        setTimeout(function(){
          leavingAnimationComplete(element, false);
        }, 200);
      }
    };
  
    function getCachedPage(element) {
      var cachedContent = false;
      for(var i = 0; i < element.cachedPages.length; i++) {
        if(element.cachedPages[i].link == element.link) {
          cachedContent = element.cachedPages[i].content;
          break;
        }
      }
      return cachedContent;
    };
  
    function getContainerHTML(element, content) {
      var template = document.createElement('div');
      template.innerHTML = content;
      return template.getElementsByClassName(element.containerClass)[0].outerHTML;
    };
  
    function triggerEnteringProcess(element) {
      if(element.updateBrowserHistory) updateBrowserHistory(element);
      // inject new content
      element.containers[0].insertAdjacentHTML('afterend', element.newContent);
      element.containers = element.element.getElementsByClassName(element.containerClass);
      if(element.options.beforeEnter) element.options.beforeEnter(element.containers[0], element.containers[1], element.link);
      if(!element.options.enterAnimation) return; // entering animation
      element.options.enterAnimation(element.containers[0], element.containers[1], element.link, function(){
        // move focus to new cntent
        Util.moveFocus(element.containers[1]);
        // new content
        var newContent = element.containers[1];
        // remove old content
        element.containers[0].remove();
        if(element.options.afterEnter) element.options.afterEnter(newContent, element.link);
        pageTrInit(element); // bind click event to new anchor elements
        resetPageTransition(element);
        // announce to SR new content is available
        element.srLive.textContent = element.options.srLoadedMessage;
      });
    };
  
    function resetPageTransition(element) {
      // remove old content
      element.newContent = false;
      element.animating = false;
      element.containers = [];
      element.link = false;
    };
  
    function updateBrowserHistory(element) {
      if(window.history.state && window.history.state == element.link) return;
      window.history.pushState({path: element.link},'',element.link);
    };
  
    function initBrowserHistory(element) {
      setTimeout(function() {
        // on load -> replace window history with page url
        window.history.replaceState({path: document.location.href},'',document.location.href);
        window.addEventListener('popstate', function(event) {
          element.updateBrowserHistory = false;
          if(event.state && event.state.path) {
            bindClick(element, event.state.path);
          }
        });
      }, 10);
    };
  
    PageTransition.defaults = {
      beforeLeave: false, // run before the leaving animation is triggered
      leaveAnimation: false,
      progressAnimation: false,
      beforeEnter: false, // run before enterAnimation (after new content has been added to the page)
      enterAnimation: false,
      afterEnter: false,
      loadFunction: false,
      srLoadingMessage: 'New content is being loaded',
      srLoadedMessage: 'New content has been loaded' 
    };
  
    window.PageTransition = PageTransition;
  }());
// File#: _2_page-transition-v1
// Usage: codyhouse.co/license
(function() {
    var pageTransitionWrapper = document.getElementsByClassName('js-page-trans');
    if(pageTransitionWrapper.length < 1) return;
    
    var transPanel = document.getElementsByClassName('page-trans-v1'),
      loaderScale = '--page-trans-v1-loader-scale',
      timeoutId = false,
      loaderScaleDown = 0.2;
  
    var timeLeaveAnim = 0;
    
    new PageTransition({
      leaveAnimation: function(initContent, link, cb) {
        timeLeaveAnim = 0;
        Util.addClass(transPanel[0], 'page-trans-v1--is-visible');
        transPanel[0].addEventListener('transitionend', function cbLeave(){
          transPanel[0].removeEventListener('transitionend', cbLeave);
          setTimeout(function(){
            animateLoader(300, 1, loaderScaleDown, function(){
              Util.addClass(initContent, 'is-hidden');
              timeLeaveAnim = new Date().getTime();
              cb();
            });
          }, 100);
        });
      },
      enterAnimation: function(initContent, newContent, link, cb) {
        if(timeoutId) {
          window.cancelAnimationFrame(timeoutId);
          timeoutId = false;
        }
  
        // set a minimum loader animation duration of 0.75s
        var duration = Math.max((750 - new Date().getTime() + timeLeaveAnim), 300);
    
        // complete page-trans-v1__loader scale animation
        animateLoader(duration, parseFloat(getComputedStyle(transPanel[0]).getPropertyValue(loaderScale)), 1, function() {
          Util.removeClass(transPanel[0], 'page-trans-v1--is-visible');
          transPanel[0].addEventListener('transitionend', function cbEnter(){
            transPanel[0].removeEventListener('transitionend', cbEnter);
            cb();
          });
        });
      },
      progressAnimation: function(link) {
        animateLoader(3000, loaderScaleDown, 0.9);
      }
    });
  
    function animateLoader(duration, startValue, finalValue, cb) {
      // takes care of animating the loader element
      var currentTime = false;
  
      var animateScale = function(timestamp) {
        if (!currentTime) currentTime = timestamp;        
        var progress = timestamp - currentTime;
        if(progress > duration) progress = duration;
        var val = Math.easeInOutQuart(progress, startValue, finalValue - startValue, duration);
        transPanel[0].style.setProperty(loaderScale, val);
        if(progress < duration) {
          timeoutId = window.requestAnimationFrame(animateScale);
        } else {
          // reveal page content
          if(cb) cb();
        }
      };
      timeoutId = window.requestAnimationFrame(animateScale);
    };
  }());