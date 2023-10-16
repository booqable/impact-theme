class VideoYoutube {
  constructor(block) {
    this.block = block;

    this.selector = {
      vision: ".images__vision",
      video: ".images__video-id",
      player: ".images__video"
    }
  }

  init() {
    if (!this.block) return false;

    this.elements();
    this.events();
  }

  elements() {
    this.nodes = this.block.querySelectorAll(this.selector.vision);
  }

  events() {
    this.videoInit();
  }

  videoInit() {
    if (!this.nodes.length) return false;

    this.nodes.forEach(node => {
      const video = node.querySelector(this.selector.video),
            videoId = video?.value;

      if (!videoId) return false;

      const player = node.querySelector(this.selector.player).id;

      this.video(videoId, player);
    })
  }

  video(video, player) {
    // API call this function when the video player is ready.
    const onPlayerReady = (e) => e.target.playVideo();

    // API call this function when the video player is changing state.
    // It helps resolve an issue of embeddable youtube video into the site
    // when it's not autoplayable after screen locked and unlocked
    const onPlayerStateChange = (e) => {
      if (e.target.getPlayerState() !== 3) e.target.playVideo();
    }

    // Create an <iframe> (and YouTube player) after the API code downloads.
    const instance = new YT.Player(player, {
      width: '988',
      height: '556',
      videoId: video,
      playerVars: {
        'playlist': video,
        'playsinline': 1,
        'autoplay': 1,
        'mute': 1,
        'loop': 1,
        'controls': 0,
        'disablekb': 1,
        'fs': 0,
        'enablejsapi': 1
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    })
  }
}

const initVideo = (el = ".images") => {
  const nodes = document.querySelectorAll(el);

  if (!nodes.length) return false;

  nodes.forEach(node => {
    const init = new VideoYoutube(node);
    init.init();
  })
}

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") initVideo();
})
