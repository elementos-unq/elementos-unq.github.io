window.onload = function() {
  var contentOutput, currentExample, md, previousExample, shadow;
  currentExample = document.querySelector('#currentExample');
  contentOutput = document.querySelector('#contentOutput');
  previousExample = document.querySelector('#previousExample');
  shadow = document.querySelector('#shadow');
  md = new Remarkable('commonmark');
  contentOutput.innerHTML = md.render(previousExample.value);
  return window.process_content = function() {
    shadow.classList.add("remove");
    return contentOutput.innerHTML = md.render(currentExample.value);
  };
};
