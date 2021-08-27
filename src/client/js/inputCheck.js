function checkInput(fromText, toText) {
  let urlRGEX = /^[a-zA-Z\s]{0,255}$/;
  if (urlRGEX.test(fromText) && urlRGEX.test(toText)) {
    return
  } else {
    alert("Please enter a valid name!");
  }
}

export { checkInput }