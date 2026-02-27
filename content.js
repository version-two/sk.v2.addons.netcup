(function () {
  "use strict";

  function getProductId(row) {
    const link = row.querySelector('a[onclick*="showProductDetail"]');
    if (!link) return null;
    const match = link.getAttribute("onclick").match(/showProductDetail\((\d+)\)/);
    return match ? match[1] : null;
  }

  function applyNames(nameMap) {
    const rows = document.querySelectorAll("table.table tbody tr.tr1, table.table tbody tr.tr2");
    rows.forEach((row) => {
      const productId = getProductId(row);
      if (!productId) return;

      const nameTd = row.querySelectorAll("td")[1];
      if (!nameTd) return;

      // Store original name once
      if (!nameTd.dataset.originalName) {
        nameTd.dataset.originalName = nameTd.textContent.trim();
      }

      const customName = nameMap[productId];
      if (customName) {
        nameTd.textContent = customName;
        nameTd.title = nameTd.dataset.originalName;
        nameTd.classList.add("ncr-renamed");
      } else {
        nameTd.textContent = nameTd.dataset.originalName;
        nameTd.title = "";
        nameTd.classList.remove("ncr-renamed");
      }
    });
  }

  function addActionsColumn() {
    // Add header
    const thead = document.querySelector("table.table thead tr");
    if (!thead || thead.querySelector(".ncr-actions-header")) return;

    const th = document.createElement("td");
    th.className = "ncr-actions-header";
    th.innerHTML = "<b>Actions:</b>";
    thead.appendChild(th);

    // Add button to each row
    const rows = document.querySelectorAll("table.table tbody tr.tr1, table.table tbody tr.tr2");
    rows.forEach((row) => {
      const productId = getProductId(row);
      if (!productId) return;

      const td = document.createElement("td");
      td.className = "ncr-actions-cell";

      const btn = document.createElement("button");
      btn.className = "ncr-rename-btn";
      btn.textContent = "Rename";
      btn.addEventListener("click", () => onRename(productId, row));

      td.appendChild(btn);
      row.appendChild(td);
    });
  }

  function onRename(productId, row) {
    const nameTd = row.querySelectorAll("td")[1];
    const originalName = nameTd.dataset.originalName || nameTd.textContent.trim();

    // Replace button cell with inline input
    const actionsCell = row.querySelector(".ncr-actions-cell");

    browser.storage.local.get("nameMap").then((result) => {
      const nameMap = result.nameMap || {};
      const currentCustom = nameMap[productId] || "";

      actionsCell.innerHTML = "";

      const input = document.createElement("input");
      input.type = "text";
      input.className = "ncr-rename-input";
      input.value = currentCustom;
      input.placeholder = originalName;

      const saveBtn = document.createElement("button");
      saveBtn.className = "ncr-save-btn";
      saveBtn.textContent = "Save";

      const cancelBtn = document.createElement("button");
      cancelBtn.className = "ncr-cancel-btn";
      cancelBtn.textContent = "Cancel";

      function finish() {
        actionsCell.innerHTML = "";
        const btn = document.createElement("button");
        btn.className = "ncr-rename-btn";
        btn.textContent = "Rename";
        btn.addEventListener("click", () => onRename(productId, row));
        actionsCell.appendChild(btn);
      }

      saveBtn.addEventListener("click", () => {
        const val = input.value.trim();
        browser.storage.local.get("nameMap").then((res) => {
          const map = res.nameMap || {};
          if (val) {
            map[productId] = val;
          } else {
            delete map[productId];
          }
          browser.storage.local.set({ nameMap: map }).then(() => {
            applyNames(map);
            finish();
          });
        });
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveBtn.click();
        if (e.key === "Escape") finish();
      });

      cancelBtn.addEventListener("click", finish);

      actionsCell.appendChild(input);
      actionsCell.appendChild(saveBtn);
      actionsCell.appendChild(cancelBtn);

      input.focus();
      input.select();
    });
  }

  function init() {
    const table = document.querySelector("table.table");
    if (!table) return;

    addActionsColumn();

    browser.storage.local.get("nameMap").then((result) => {
      applyNames(result.nameMap || {});
    });

    browser.storage.onChanged.addListener((changes) => {
      if (changes.nameMap) {
        applyNames(changes.nameMap.newValue || {});
      }
    });
  }

  // Re-apply after AJAX updates
  const observer = new MutationObserver(() => {
    const table = document.querySelector("table.table");
    if (table && !table.querySelector(".ncr-actions-header")) {
      addActionsColumn();
      browser.storage.local.get("nameMap").then((result) => {
        applyNames(result.nameMap || {});
      });
    }
  });

  const target = document.getElementById("content2");
  if (target) {
    observer.observe(target, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
