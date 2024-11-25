class TouchDevice {
  constructor(block) {
    this.block = block;

    this.modifier = {
      notch: "notch"
    }

    this.props = {
      portrait: "portrait",
      landscape: "landscape"
    }

    this.cssVars = {
      areaTop: "--safe-area-top",
      areaRight: "--safe-area-right",
      areaBottom: "--safe-area-bottom",
      areaLeft: "--safe-area-left"
    }

    this.data = {
      orientation: "data-orientation"
    }

    this.devices = [
      { name: "Android Phone", regex: /Android/i },
      { name: "Android Tablet", regex: /Android/i, exclude: /Mobile/i },
      { name: "Chromebook", regex: /CrOS/i },
      { name: "iPad", regex: /iPad/i },
      { name: "iPhone", regex: /iPhone/i },
      { name: "iPod", regex: /iPod/i },
      { name: "Linux", regex: /Linux/i, exclude: /Android|CrOS/i },
      { name: "Mac", regex: /Macintosh/i, exclude: /Mobile/i },
      { name: "Other Mobile", regex: /Mobile/i },
      { name: "Other Tablet", regex: /Tablet/i },
      { name: "Windows PC", regex: /Windows NT/i },
      { name: "Windows Phone", regex: /Windows Phone/i }
    ]

    this.browsers = [
      { name: "Chrome", regex: /chrome\/([\d.]+)/i, exclude: /edg/i },
      { name: "Edge", regex: /edg\/([\d.]+)/i },
      { name: "Firefox", regex: /firefox\/([\d.]+)/i },
      { name: "Internet Explorer", regex: /(?:msie |rv:)([\d.]+)/i },
      { name: "Opera", regex: /(?:opr|opera)\/([\d.]+)/i },
      { name: "Safari", regex: /version\/([\d.]+)/i, exclude: /chrome|crios|fxios/i }
    ]
  }

  init() {
    if (!this.block) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.doc = document.documentElement;
  }

  events() {
    this.deviceDetect();
    this.browserDetect();
    this.addDeviceOrientation();

    window.addEventListener("resize", this.addDeviceOrientation.bind(this));
  }

  deviceDetect() {
    const device = this.getData(this.devices)

    this.addClass(device)
    return device
  }

  browserDetect() {
    this.addClass(this.getData(this.browsers))
  }

  addDeviceOrientation() {
    if (!this.deviceDetect()) return false;

    const screen = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    const hasNotch = this.checkDeviceNotch(),
          isLandscape = screen.width > screen.height;

    this.doc.setAttribute(this.data.orientation, isLandscape ? this.props.landscape : this.props.portrait);

    if (!hasNotch) return false;
    if (!this.doc.classList.contains(this.modifier.notch)) this.addClass(this.modifier.notch)
  }

  checkDeviceNotch() {
    const styles = window.getComputedStyle(this.doc),
          paddingTop = parseInt(styles.getPropertyValue(this.cssVars.areaTop)) || 0,
          paddingRight = parseInt(styles.getPropertyValue(this.cssVars.areaRight)) || 0,
          paddingBottom = parseInt(styles.getPropertyValue(this.cssVars.areaBottom)) || 0,
          paddingLeft = parseInt(styles.getPropertyValue(this.cssVars.areaLeft)) || 0;

    return [paddingTop, paddingRight, paddingBottom, paddingLeft].some(value => value > 0)
  }

  addClass(name) {
    if (!name) return false;

    const sanitizedName = name.replace(/\s+/g, '-')

    this.doc.classList.add(sanitizedName)
  }

  getData(arr) {
    const userAgent = navigator.userAgent;
    const data = arr.find(({ regex, exclude }) =>
      regex.test(userAgent) && (!exclude || !exclude.test(userAgent))
    )

    return data?.name.toLowerCase();
  }
}

const touchDevice = new TouchDevice(document.querySelector('html'));

document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") touchDevice.init();
})
