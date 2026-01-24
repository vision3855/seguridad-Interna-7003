export function copyText(container) {
  // Copy to clipboard
  navigator.clipboard
    .writeText(container)
    .then(() => {
      console.log("Text copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });

}
