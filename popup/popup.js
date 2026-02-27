(function () {
  "use strict";

  const btnExport = document.getElementById("btn-export");
  const btnImport = document.getElementById("btn-import");
  const fileInput = document.getElementById("file-input");
  const statusEl = document.getElementById("status");

  let statusTimeout = null;

  function showStatus(message, isError) {
    statusEl.textContent = message;
    statusEl.className = "status " + (isError ? "error" : "success");
    statusEl.style.display = "block";
    clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => {
      statusEl.style.display = "none";
    }, 3000);
  }

  btnExport.addEventListener("click", () => {
    browser.storage.local.get("nameMap").then((result) => {
      const nameMap = result.nameMap || {};
      const count = Object.keys(nameMap).length;

      if (count === 0) {
        showStatus("No custom names to export.", true);
        return;
      }

      const blob = new Blob([JSON.stringify(nameMap, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "netcup-product-names.json";
      a.click();
      URL.revokeObjectURL(url);

      showStatus("Exported " + count + " name(s).", false);
    });
  });

  btnImport.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (typeof data !== "object" || Array.isArray(data)) {
          showStatus("Invalid format: expected a JSON object.", true);
          return;
        }

        // Validate all values are strings
        for (const key of Object.keys(data)) {
          if (typeof data[key] !== "string") {
            showStatus("Invalid format: all values must be strings.", true);
            return;
          }
        }

        browser.storage.local.set({ nameMap: data }).then(() => {
          showStatus("Imported " + Object.keys(data).length + " name(s).", false);
        });
      } catch {
        showStatus("Invalid JSON file.", true);
      }
    };
    reader.readAsText(file);

    // Reset so same file can be re-imported
    fileInput.value = "";
  });
})();
