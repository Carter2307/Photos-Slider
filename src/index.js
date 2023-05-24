const { flattenDiagnosticMessageText } = require("typescript");

class Slider {
  constructor(options) {
    this.options = Object.assign({}, options);
    this.container = document.querySelector(".slider");
    if (!this.container) return;
    this.content = this.container.querySelector(".slider-container");
    this.contentWrapper = [
      ...this.container.querySelectorAll(".slider-container-childs")
    ];
    this.contentChilds = [...this.container.querySelectorAll(".slider-child")];
    this.time = 1000 / 60;
    this.contentActive = 1;
    this.isMove = false;
    this.init();
  }

  init() {
    this.setActiveConent(this.contentActive);
    this.setId();
    this.calcItemWidth();
  }

  calcItemWidth() {
    const containerWidth = this.container.getBoundingClientRect().width;
    const width = containerWidth / this.options.itemsVisible;
    this.contentChilds.forEach((child) => {
      child.style.width = `${width}px`;
    });
  }

  update() {
    if (this.isMove === false) return;
    this.move();
    window.requestAnimationFrame(this.update.bind(this));
    console.log(this.isMove);
  }

  stop() {
    this.isMove = false;
    this.static();
    window.requestAnimationFrame(this.stop.bind(this));
  }

  move() {
    this.isMove = true
    const distance = this.options.velocity * this.time;
    const contentX = this.content.getBoundingClientRect().x;
    this.content.style.transform = `translateX(${contentX - distance}px)`;
  }

  static() {
    const contentX = this.content.getBoundingClientRect().x;
    this.content.style.transform = `translateX(${contentX}px)`;
  }

  setId() {
     this.contentWrapper.forEach((content, index) => {
       content.id = index;
    });
  }

  setActiveConent(index) {
    this.contentWrapper.forEach((content) => {
      content.classList.remove("slider-container-childs-active");
    });

    if (!this.contentWrapper[index]) return;
    this.contentWrapper[index].classList.add("slider-container-childs-active");
  }

}

class SliderObserver {
  constructor({ root, element, options }) {
    this.root = root;
    this.element = element;
    this.options = options;
    this.isOutOfView = false;
  }

  observe() {
      const options = {
      root: this.root,
      rootMargin: "0px",
      threshold: 0
    };


    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0) {
          console.log(`This ${entry.target.id} is out of view`);
          this.isOutOfView = true;
        }
      });
    }, options);
    observer.observe(this.element);

    return this.isOutOfView;
  }

  isOutOfView() {
    this.observe()
  }
}

window.slider = new Slider({
  element: ".slider",
  itemsVisible: 4,
  velocity: 2
});

//slider.update()
