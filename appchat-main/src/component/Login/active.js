const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const tabs = $$(".tabs__title-item");
const panes = $$(".tabs__content-item");


const tabActive = $(".tabs__title-item.active");
const line = $(".tabs__title .line");

requestIdleCallback(function () {
line.style.left = tabActive.offsetLeft + "px";
line.style.width = tabActive.offsetWidth + "px";
});

tabs.forEach((tab, index) => {
const pane = panes[index];

tab.onclick = function () {
    $(".tabs__title-item.active").classList.remove("active");
    $(".tabs__content-item.active").classList.remove("active");

    line.style.left = this.offsetLeft + "px";
    line.style.width = this.offsetWidth + "px";

    this.classList.add("active");
    pane.classList.add("active");
};
});
