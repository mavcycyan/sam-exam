export function preloader(param) {
    if (param == 'init') {
        const $preloader = document.createElement('div')
        $preloader.className = 'preloader'
        $preloader.id = 'preloader'
        $preloader.innerHTML = `
              <div id="cube-loader">
                <div class="caption">
                  <div class="cube-loader">
                    <div class="cube loader-1"></div>
                    <div class="cube loader-2"></div>
                    <div class="cube loader-4"></div>
                    <div class="cube loader-3"></div>
                  </div>
                </div>
              </div>
        `
        document.getElementsByTagName('body')[0].append($preloader)
    } else if (param == 'destroy') {
        document.getElementById('preloader').remove()
    }
}
