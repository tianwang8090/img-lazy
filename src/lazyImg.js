/**
 * @author @tian田小旺
 * @description 图片懒加载
 */

;
(function (global, definition) {
  if (typeof exports === "object" && typeof module === "object") {
    module.exports = definition();
  } else if (typeof define === "function" && define.amd) {
    define(definition);
  } else {
    global.lazyImg = definition();
  }
})(this, function lazyImg() {
  let lazyQueen = [];
  let lazyTimer = -1;
  let loadedImgEleList = [];

  return function init() {
    addEventListener("load", initLoadTimer);
    addEventListener("scroll", initLoadTimer);
    addEventListener("resize", initLoadTimer);
    addEventListener("mousewheel", initLoadTimer);
    addEventListener("touchmove", initLoadTimer);
  };

  function initLoadTimer() {
    if (lazyTimer > -1) clearTimeout(lazyTimer);
    lazyTimer = setTimeout(() => {
      lazyTimer = -1;
      getLazyImgList();
      loadImg();
      removeLoadedImgEle();
      removeListener();
    }, 500);
  }

  // 图片加载完成后解除window的事件监听
  function removeListener() {
    if (lazyQueen.length) return;
    removeEventListener("load", initLoadTimer);
    removeEventListener("scroll", initLoadTimer);
    removeEventListener("resize", initLoadTimer);
    removeEventListener("mousewheel", initLoadTimer);
    removeEventListener("touchmove", initLoadTimer);
  }

  // 获取所有待加载的图片元素
  function getLazyImgList() {
    lazyQueen = [].filter.call(document.getElementsByTagName("img"), imgEle => imgEle.dataset.src);
  }

  // 检查元素是否可见
  function checkEleShow(ele) {
    return !!ele.offsetParent;
  }

  // 加载图片
  function loadImg() {
    let viewTop = getViewTop();
    let viewHeight = getViewHeight();
    lazyQueen.forEach((imgEle, imgEleIndex) => {
      let imgEleTop = getEleDocTop(imgEle);
      if (imgEleTop > viewHeight + viewTop || imgEleTop < viewTop) return;
      if (!checkEleShow(imgEle)) return;
      if (imgEle.dataset.src) {
        imgEle.src = imgEle.dataset.src;
        delete imgEle.dataset.src;
        loadedImgEleList.push(imgEleIndex);
      }
    })
  }

  // 获取已滚动高度
  function getViewTop() {
    return document.documentElement.scrollTop;
  }

  // 获取视窗高度
  function getViewHeight() {
    return document.documentElement.clientHeight;
  }

  // 获取元素在文档中的高度
  function getEleDocTop(ele, sum = 0) {
    if (!ele || !ele.offsetParent) return sum;
    sum += ele.offsetTop;
    return getEleDocTop(ele.offsetParent, sum);
  }

  // 从待加载队列中删除已加载的元素
  function removeLoadedImgEle() {
    loadedImgEleList.forEach(imgEleIndex => {
      lazyQueen.splice(imgEleIndex, 1);
    })
  }
})