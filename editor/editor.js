window.onload = function() {
  var contentOutput, currentExample, shadow;
  currentExample = document.querySelector('#currentExample');
  contentOutput = document.querySelector('#contentOutput');
  shadow = document.querySelector('#shadow');
  return window.process_content = function() {
    shadow.classList.add("remove");
    return contentOutput.innerHTML = currentExample.value;
  };
};
