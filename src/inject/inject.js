function aggregateOffsetTop(element) {
  if (!element) {
    return -1;
  }

  let y = element.offsetTop;

  while (element = element.offsetParent) {
    y += element.offsetTop;
  }

  return y;
}

chrome.extension.sendMessage({}, function(response) {
  const readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      /* assuming it will never change in the DOM */
      let player = document.querySelector('.player-api');
      if (!player) { return; }

      let { clientWidth, clientHeight, classList } = player;
      let playerOffsetTop = aggregateOffsetTop(player);
      let breakpoint = (clientHeight / 2) + playerOffsetTop;
      let timer = null;
      let isFloating = false;

      function handleScroll(event) {
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(function() {
          if (window.scrollY > breakpoint) {
            if (!isFloating) {
              classList.add('floating');
              isFloating = true;
            }
          } else if (isFloating) {
            classList.remove('floating');
            isFloating = false;
          }
        }, 100);
      }

      document.addEventListener('scroll', handleScroll);
    }
  }, 10);
});
