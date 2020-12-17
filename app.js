//  ELEMENTS
const allColors = document.querySelectorAll(".color");
const currentHex = document.querySelectorAll(".color h2");
const sliders = document.querySelectorAll('.sliders input[type="range"]');
//EVENT LISTENERS
//slider hue brighness saturation hbs
sliders.forEach((slider) => {
  slider.addEventListener("input", (e) => {
    hbsControls(e, allColors);
  });
});
// FUNCTIONS
function checkTextContrast(color, textHeader) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    textHeader.style.color = "black";
  } else {
    textHeader.style.color = "white";
  }
  return textHeader;
}
function randomColor(colors) {
  colors.forEach((color) => {
    const newColor = chroma.random();
    const hexText = color.children[0];
    color.style.backgroundColor = newColor; //new color to color div
    hexText.innerText = newColor; //h2 text
    checkTextContrast(newColor, hexText);
    // get the input range  elements
    const sliders = color.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    colorizeSliders(newColor, hue, brightness, saturation);
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
  // console.log(index);
  // quand on modifie un slider on veut récupérer les 3 valeurs hbs du slider cliqué
  // et l'attribuer a div.color parent
  let sliders = e.target.parentNode.querySelectorAll("input");
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];
  const currentColor = e.target.parentNode;
  //on récupère le hex de color
  const bgColor = colors[index].children[0].innerText;
  // et on update la couleur avec hbs
  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);

  colors[index].style.backgroundColor = color;
}

// main

randomColor(allColors);
