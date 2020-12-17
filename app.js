//  ELEMENTS
const allColors = document.querySelectorAll(".color");
const currentHex = document.querySelectorAll(".color h2");
const sliders = document.querySelectorAll('.sliders input[type="range"]');
const popup = document.querySelector(".copy-container");
const adjustButtons = document.querySelectorAll(".adjust");
const closeButtons = document.querySelectorAll(".close-adjustment");
const slidersContainers = document.querySelectorAll(".sliders");
let initialColors;

//EVENT LISTENERS
//slider hue brighness saturation hbs
sliders.forEach((slider) => {
  slider.addEventListener("input", (e) => {
    hbsControls(e, allColors);
  });
});
allColors.forEach((colorEl, index) => {
  colorEl.addEventListener("input", () => {
    updateTextUI(index);
  });
});
currentHex.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClipboard(hex);
  });
});
popup.addEventListener("transitionend", () => {
  const popupBox = popup.children[0];
  popupBox.classList.remove("active");
  popup.classList.remove("active");
});
adjustButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    openAdjustmentPanel(index);
  });
});
closeButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    closeAdjustmentPanel(index);
  });
});

// FUNCTIONS
function openAdjustmentPanel(index) {
  slidersContainers[index].classList.toggle("active");
}
function closeAdjustmentPanel(index) {
  slidersContainers[index].classList.remove("active");
}
function copyToClipboard(hex) {
  const el = document.createElement("textarea");
  el.value = hex.innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  // popup animation
  const popupBox = popup.children[0];
  popup.classList.add("active");
  popupBox.classList.add("active");
  console.log(popupBox);
}
function checkTextContrast(color, textHeader) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.35) {
    textHeader.style.color = "black";
  } else {
    textHeader.style.color = "white";
  }
  return textHeader;
}
function randomColor(colors) {
  initialColors = [];
  colors.forEach((color) => {
    const newColor = chroma.random();
    const hexText = color.children[0];
    color.style.backgroundColor = newColor; //new color to color div
    hexText.innerText = newColor; //h2 text
    initialColors.push(hexText.innerText); // save for reference of inital color used in hsbControls
    checkTextContrast(newColor, hexText);
    // get the input range  elements
    const sliders = color.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    colorizeSliders(newColor, hue, brightness, saturation);
  });
  // update slider input to the new color
  resetInputs();
}
function resetInputs() {
  sliders.forEach((slider, index) => {
    if (slider.name === "Hue") {
      const hueColor = initialColors[slider.dataset.hue];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = hueValue;
    }
    if (slider.name === "brightness") {
      const brightnessColor = initialColors[slider.dataset.bright];
      const brightnessValue = chroma(brightnessColor).hsl()[2];
      slider.value = brightnessValue;
    }
    if (slider.name === "saturation") {
      const saturationColor = initialColors[slider.dataset.sat];
      const saturationValue = chroma(saturationColor).hsl()[1];
      slider.value = saturationValue;
    }
  });
}
function colorizeSliders(color, hueInput, brightInput, satInput) {
  //Scale saturation
  const lowSat = color.set("hsl.s", 0);
  const highSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([lowSat, color, highSat]);
  //Scale brightness
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);
  //Update  sat
  satInput.style.backgroundImage = `linear-gradient(to right,${scaleSat(
    0
  )}, ${scaleSat(1)})`;
  //Update  bright
  brightInput.style.backgroundImage = `linear-gradient(to right,${scaleBright(
    0
  )},${scaleBright(0.5)}, ${scaleBright(1)})`;
  //Update  hue
  hueInput.style.backgroundImage = `linear-gradient(to right,rgb(204, 75, 75), rgb(204,204 ,75),rgb(75, 204, 75),rgb(75, 204, 204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75)`;
}
function hbsControls(e, colors) {
  const index =
    e.target.dataset.hue || e.target.dataset.bright || e.target.dataset.sat;
  // quand on modifie un slider on veut récupérer les 3 valeurs hbs du slider cliqué
  // et l'attribuer a div.color parent
  let sliders = e.target.parentNode.querySelectorAll("input");
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];
  const currentColor = e.target.parentNode;
  //on récupère le hex de color
  const bgColor = initialColors[index];
  // et on update la couleur avec hbs
  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);

  colors[index].style.backgroundColor = color;
}
function updateTextUI(index) {
  const colorDiv = allColors[index];
  const color = chroma(colorDiv.style.backgroundColor);
  const textHexElt = colorDiv.querySelector("h2");
  const icons = colorDiv.querySelectorAll(".controls button");
  // change the text hex
  textHexElt.innerText = color.hex();
  // adapt letters and icons to contrast
  checkTextContrast(color, textHexElt);
  for (icon of icons) {
    checkTextContrast(color, icon);
  }
}

// main

randomColor(allColors);
