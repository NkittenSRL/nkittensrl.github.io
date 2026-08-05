const counterComponent = ({ denominator, icon }, matches) => {
  if (denominator === undefined) {
    denominator = +matches[1];
  }
  const container = document.createElement("div");
  container.classList.add("counter");
  let state = 0;
  const total = `/${denominator}`;

  const button = document.createElement("button");
  button.innerHTML = `<img src="icons/${icon}.png">`;

  const textEl = document.createTextNode(state + total);

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    if (state < denominator) {
      state++;
    } else {
      state = 0;
    }
    textEl.textContent = state + total;
  });

  button.addEventListener("contextmenu", (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (state > 0) {
      state--;
    } else {
      state = 0;
    }
    textEl.textContent = state + total;
  });

  container.appendChild(button);
  container.appendChild(textEl);
  return container;
};

const tokensComponent = ({ rows, icon }, matches) => {
  if (!rows) {
    rows = [[...new Array(+matches[1])].map(() => icon)];
  }
  const container = document.createElement("div");
  container.classList.add("tokens");
  rows.forEach((icons) => {
    const rowEl = document.createElement("div");
    icons.forEach((icon) => {
      const checkbox = document.createElement("label");
      const filename = typeof icon === "string" ? icon : icon.filename;
      checkbox.innerHTML = `<input type="checkbox"><img src="icons/${filename}.png">`;
      checkbox.querySelector("input").checked =
        typeof icon === "object" && icon.selected === true;
      checkbox.addEventListener("click", (e) => e.stopPropagation());
      checkbox.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        checkbox.hidden = true;
      });
      rowEl.appendChild(checkbox);
    });
    container.appendChild(rowEl);
  });
  container.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    container
      .querySelectorAll("label")
      .forEach((token) => (token.hidden = false));
  });
  return container;
};

document.querySelectorAll("td").forEach((el) => {
  const goal = el.textContent;

  let matchingData = null;
  let matches = [];
  for (let i = 0; i < window.trackerData.length; i++) {
    matchingData = window.trackerData[i];
    matches = matchingData.regex.exec(goal);
    if (matches) {
      break;
    }
  }

  if (!matches || matchingData === null) {
    return;
  }
  if (matchingData.options.replaceText) {
    el.textContent = matchingData.options.replaceText;
  }
  if (matchingData.options.tokens) {
    el.appendChild(tokensComponent(matchingData.options.tokens, matches));
  } else if (matchingData.options.counter) {
    el.appendChild(counterComponent(matchingData.options.counter, matches));
  }
});