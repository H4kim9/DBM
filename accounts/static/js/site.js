// ==============================
// Code Site Dropdown Logic
// ==============================
function toggleCodeSiteDropdown() {
  const dropdown = document.getElementById("codeSiteDropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  const input = document.getElementById("customCodeInput");
  input.disabled = false;
  input.focus();
}

function selectCodeSiteOption(value, isSelectAll) {
  const toggle = document.getElementById("codeSiteDropdownToggle");
  const input = document.getElementById("customCodeInput");

  if (isSelectAll) {
    toggle.textContent = value;
    input.value = "";
    input.disabled = true;
    document.getElementById("codeSiteDropdown").style.display = "none";
  }
}

document.getElementById("customCodeInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const value = this.value.trim();
    if (value !== "") {
      document.getElementById("codeSiteDropdownToggle").textContent = value;
      document.getElementById("codeSiteDropdown").style.display = "none";
      this.blur();
    }
  }
});

document.getElementById("customCodeInput").addEventListener("input", function () {
  document.getElementById("codeSiteDropdownToggle").textContent = this.value;
});

// ==============================
// Sous-Table Multi-Select Logic
// ==============================
function toggleSubDropdown() {
  const dropdown = document.getElementById("subDropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

function toggleSubOption(el) {
  const toggle = document.getElementById("subDropdownToggle");
  const allOptions = document.querySelectorAll("#subDropdown .option");
  const value = el.textContent.trim();

  const isSelectAll = value === "- Select All -";

  if (isSelectAll) {
    const alreadySelected = el.classList.contains("active");
    allOptions.forEach(opt => opt.classList.remove("active"));

    if (!alreadySelected) {
      allOptions.forEach(opt => opt.classList.add("active"));
      toggle.textContent = "- Select All -";
    } else {
      toggle.textContent = "- Type -";
    }

    return;
  }

  const selectAllOption = Array.from(allOptions).find(opt => opt.textContent.trim() === "- Select All -");
  selectAllOption.classList.remove("active");

  el.classList.toggle("active");

  const selected = Array.from(allOptions)
    .filter(opt => opt.classList.contains("active") && opt.textContent.trim() !== "- Select All -")
    .map(opt => opt.textContent.trim());

  if (selected.length === 0) {
    toggle.textContent = "- Type -";
  } else if (selected.length === 1) {
    toggle.textContent = selected[0];
  } else {
    toggle.textContent = `${selected[0]} (+${selected.length - 1})`;
  }
}

// ==============================
// Close Dropdowns on Outside Click
// ==============================
document.addEventListener("click", function (e) {
  if (!e.target.closest("#codeSiteDropdownToggle") && !e.target.closest("#codeSiteDropdown")) {
    document.getElementById("codeSiteDropdown").style.display = "none";
  }

  if (!e.target.closest("#subDropdownToggle") && !e.target.closest("#subDropdown")) {
    document.getElementById("subDropdown").style.display = "none";
  }
});

// ==============================
// Extract Button Logic
// ==============================
document.querySelector(".extract-btn").addEventListener("click", function () {
  const codeText = document.getElementById("codeSiteDropdownToggle").textContent.trim();
  const selectedOptions = Array.from(document.querySelectorAll("#subDropdown .option.active"))
                               .map(opt => opt.textContent.trim());

  const codeError = document.getElementById("codeSiteError");
  const subError = document.getElementById("subTableError");

  let hasError = false;
  codeError.textContent = "";
  subError.textContent = "";

  if (codeText === "- Code Site -" || codeText === "") {
    codeError.textContent = "Veuillez choisir un code site.";
    hasError = true;
  }

  if (selectedOptions.length === 0) {
    subError.textContent = "Veuillez sélectionner au moins un sous-tableau.";
    hasError = true;
  }

  if (hasError) return;

  const url = `/extract/?code_site=${encodeURIComponent(codeText)}&${selectedOptions.map(opt => `sous_table[]=${encodeURIComponent(opt)}`).join('&')}`;
  window.location.href = url;
});



//  and for the suivi consommation when i extract the data i found that it appear two times in the same file
