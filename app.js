//  ELEMENTS
const allColors = document.querySelectorAll(".color");
const currentHex = document.querySelectorAll(".color h2");
const sliders = document.querySelectorAll('.sliders input[type="range"]');
const popup = document.querySelector(".copy-container");
const adjustButtons = document.querySelectorAll(".adjust");
const lockButtons = document.querySelectorAll(".lock");
const closeButtons = document.querySelectorAll(".close-adjustment");
const slidersContainers = document.querySelectorAll(".sliders");
const generateButton = document.querySelector(".generate");
const saveButton = document.querySelector("button.save");
const savedContainer = document.querySelector(".save-container");
const savedPopup = savedContainer.children[0];
const closeSaveButton = document.querySelector(".close-save");
const submitSave = document.querySelector(".submit-save");
const paletteName = document.querySelector(".save-name");
const libraryButton = document.querySelector(".library");
const libraryContainer = document.querySelector(".library-container");
const libraryPopup = document.querySelector(".library-popup");
const libraryClose = document.querySelector(".close-library");

let allIndexToDelete = [];

let initialColors;
let paletteToLocalStorage = [];
let palettesLocalStorage = [];

//EVENT LISTENERS
//Generate button
generateButton.addEventListener("click", () => {
  const colorAsync = window.setInterval(() => {
    randomColor(allColors);
  }, 80);
  const inter = window.setTimeout(() => {
    window.clearInterval(colorAsync);
  }, 400);
  window.setTimeout(() => {
    allColors.forEach((color) => {
      color.classList.remove("shadow");
    });
  }, 400);
});
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
// hex text copy and popup
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
// open sliders menu
adjustButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    openAdjustmentPanel(index);
  });
});
// close slider menu button
closeButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    closeAdjustmentPanel(index);
  });
});
// lock icon
lockButtons.forEach((lock, index) => {
  lock.addEventListener("click", () => {
    toggleLock(lock, index);
  });
});
// Save button
saveButton.addEventListener("click", () => {
  popupSaveMenu();
});
// Close save menu X button without saving
closeSaveButton.addEventListener("click", () => {
  closeSavedPopup();
});
// Close save menu after saving
submitSave.addEventListener("click", () => {
  saveToLibrary();
});
// Library button
libraryButton.addEventListener("click", (e) => {
  allIndexToDelete = [];
  popupLibraryMenu();
  retrievePaletteFromLocal();
  const allMinipal = document.querySelectorAll(".palettes-container");
  const miniPals = document.querySelectorAll(".select-minipal");
  const miniPalsDel = document.querySelectorAll(".delete-minipal");
  miniPals.forEach((miniPal) => {
    miniPal.addEventListener("click", (ev) => {
      displayMiniPal(ev);
      closeLibrary();
    });
  });
  // trash minipalette
  miniPalsDel.forEach((del) => {
    del.addEventListener("click", (ev) => {
      deleteMiniPal(ev, allMinipal, allIndexToDelete);
    });
  });
});
// Library close button
libraryClose.addEventListener("click", () => {
  closeLibrary();
  updateLocalStorage();
});
// FUNCTIONS
function updateLocalStorage() {
  const local = JSON.parse(window.localStorage.getItem("palettes"));
  local.splice(allIndexToDelete, allIndexToDelete.length);
  window.localStorage.setItem("palettes", JSON.stringify(local));
}
function closeLibrary() {
  libraryContainer.classList.remove("active");
  libraryPopup.classList.remove("active");
}
function deleteMiniPal(ev, allMinipal, allIndexToDelete) {
  // delete the div in UI
  const index = ev.target.parentNode.classList[1];
  allIndexToDelete.push(index);
  console.log(allIndexToDelete);
  allMinipal[index].parentElement.removeChild(allMinipal[index]);
}
function displayMiniPal(ev) {
  initialColors = [];
  const paletteMin = ev.target.parentNode.querySelectorAll("div");
  const allSliders = document.querySelectorAll(".sliders");
  paletteMin.forEach((color, index) => {
    initialColors.push(chroma(color.style.backgroundColor).hex());
    allColors[index].style.backgroundColor = color.style.backgroundColor;
    currentHex[index].innerText = chroma(color.style.backgroundColor).hex();
    // quand on modifie un slider on veut récupérer les 3 valeurs hbs du slider cliqué
    // et l'attribuer a div.color parent
    // const sliders = allColors[index].querySelectorAll("input");
    // // console.log(sliders[0].value);
    // const hue = sliders[0];
    // const brightness = sliders[1];
    // const saturation = sliders[2];
    // //on récupère le hex de color
    // const bgColoor = currentHex[index].innerText;
    // // et on update la couleur avec hbs
    // let colorEnd = chroma(bgColoor)
    //   .set("hsl.s", saturation.value)
    //   .set("hsl.l", brightness.value)
    //   .set("hsl.h", hue.value);

    // // update slide scale color
    // colorizeSliders(colorEnd, hue, brightness, saturation);
    updateTextUI(index);
  });
}
function retrievePaletteFromLocal() {
  const palettes = JSON.parse(window.localStorage.getItem("palettes"));
  clearAllPalette();
  palettes.forEach((palette, index) => {
    const palettesContainer = document.createElement("div");
    palettesContainer.classList.add("palettes-container");
    palettesContainer.classList.add(`${index}`);
    libraryPopup.appendChild(palettesContainer);
    const title = document.createElement("span");
    title.innerHTML = palette.nameText;
    palettesContainer.appendChild(title);
    palette.colorArray.forEach((color) => {
      const divColor = document.createElement("div");
      divColor.style.backgroundColor = color;
      palettesContainer.appendChild(divColor);
    });
    // ajouter bouton select et delete
    const selectMiniPal = document.createElement("button");
    selectMiniPal.classList.add("select-minipal");
    selectMiniPal.innerHTML = '<i class="fas fa-check"></i>';
    const deleteMiniPal = document.createElement("button");
    deleteMiniPal.classList.add("delete-minipal");
    deleteMiniPal.innerHTML = '<i class="fas fa-trash-alt"></i>';
    palettesContainer.appendChild(selectMiniPal);
    palettesContainer.appendChild(deleteMiniPal);
  });
}
function clearAllPalette() {
  const allPalette = document.querySelectorAll(".palettes-container");
  allPalette.forEach((pal) => {
    pal.parentNode.removeChild(pal);
  });
}
function popupLibraryMenu() {
  libraryContainer.classList.add("active");
  libraryPopup.classList.add("active");
}
function saveToLibrary() {
  paletteToLocalStorage = [];
  if (paletteName.value) {
    currentHex.forEach((hex) => {
      paletteToLocalStorage.push(hex.innerText);
    });
    saveToLocalStorage(paletteName.value, paletteToLocalStorage);
    closeSavedPopup();
  } else {
    // animation si pas de text
    paletteName.classList.add("incomplete");
    paletteName.addEventListener("animationend", () => {
      paletteName.classList.remove("incomplete");
    });
  }
}
function saveToLocalStorage(nameText, colorArray) {
  palette = { nameText, colorArray };
  palettesLocalStorage = window.localStorage.getItem("palettes");
  if (palettesLocalStorage) {
    palettesLocalStorage = JSON.parse(palettesLocalStorage);
    palettesLocalStorage.push(palette);
  } else {
    palettesLocalStorage = [];
    palettesLocalStorage.push(palette);
  }
  window.localStorage.setItem("palettes", JSON.stringify(palettesLocalStorage));
}
function closeSavedPopup() {
  paletteName.classList.remove("incomplete");
  savedPopup.classList.remove("active");
  savedContainer.classList.remove("active");
  paletteName.value = "";
}
function popupSaveMenu() {
  savedContainer.classList.add("active");
  savedPopup.classList.add("active");
}
function toggleLock(lock, index) {
  const color = allColors[index];
  if (color.classList.contains("locked")) {
    color.classList.remove("locked");
    lock.classList.add("unlocked");
    lock.children[0].classList.remove("fa-lock");
    lock.children[0].classList.add("fa-lock-open");
  } else {
    color.classList.add("locked");
    lock.classList.remove("unlocked");
    lock.children[0].classList.remove("fa-lock-open");
    lock.children[0].classList.add("fa-lock");
  }
}
function openAdjustmentPanel(index) {
  slidersContainers[index].classList.toggle("active");
}
function closeAdjustmentPanel(index) {
  slidersContainers[index].classList.remove("active");
}
function copyToClipboard(hex) {
  // hack for copy to clipboard with textarea
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
  // colors is a nodelist
  initialColors = [];
  colors.forEach((color, index) => {
    let newColor = chroma.random();
    const hexText = color.children[0];

    // check if the color is locked
    if (color.classList.contains("locked")) {
      initialColors.push(hexText.innerText);
    } else {
      color.classList.add("shadow");
      hexText.innerText = newColor; //h2 text
      initialColors.push(hexText.innerText); // save for reference of inital color used in hsbControls
    }
    newColor = chroma(initialColors[index]);
    color.style.backgroundColor = newColor;
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
  // check for icons menu and lock contrast
  adjustButtons.forEach((btn, index) => {
    checkTextContrast(initialColors[index], btn);
  });
  lockButtons.forEach((btn, index) => {
    checkTextContrast(initialColors[index], btn);
  });
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
  // Chroma color
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
  // update slide scale color
  colorizeSliders(color, hue, brightness, saturation);
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
const colorAsync = window.setTimeout(() => {
  randomColor(allColors);
}, 1);
