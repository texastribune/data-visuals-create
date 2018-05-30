/**
 * Grabs the contents of a `jsonScript` created JSON inline string and returns
 * it as a JSON object. If the element does not exist, or if the script
 * element does not have the JSON MIME type, null is returned instead.
 *
 * @param  {String} elementId the ID of the JSON script element
 * @return {Object|null}
 */
export default function loadJsonScript(elementId) {
  const element = document.getElementById(elementId);

  if (element && element.getAttribute('type') === 'application/json') {
    return JSON.parse(element.textContent);
  } else {
    return null;
  }
}
