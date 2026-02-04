// State
const STATE = {
    selectedItems: new Set(), // Store selected Symptoms/Diseases
    currentView: 'view-recommendation',
    currentLang: 'en', // 'en' or 'mr'
    currentTheme: 'light' // 'light' or 'dark'
};

// Translations
const TRANSLATIONS = {
    en: {
        appTitle: "MediScheme Connect",
        appSubtitle: "AI-Powered Drug Recommendations & Government Scheme Finder",
        navDrug: "💊 Drug Recommendations",
        navScheme: "📜 Government Schemes",
        searchTitle: "🔍 Symptom & Disease Search",
        searchSubtitle: "Type to add multiple symptoms or diseases.",
        searchPlaceholder: "Type a symptom (e.g., Fever)...",
        recommendationTitle: "🩺 Recommendations",
        findSchemesTitle: "📜 Find Schemes",
        findSchemesSubtitle: "Select a specific disease to see relevant government aid.",
        selectConditionLabel: "Select Condition:",
        selectConditionPlaceholder: "-- Select Disease --",
        applicableSchemesTitle: "🏛️ Applicable Schemes",
        hospitalsTitle: "🏥 Nearby Hospitals",
        checkSchemesBtn: "Check Schemes",
        applyBtn: "Apply / More Info",
        mapBtn: "View on Map ↗️",
        noResults: "No specific conditions found for these inputs.",
        noSchemes: "No specific government schemes found for this condition. Please check general health insurance.",
        recommendedMeds: "Recommended Meds:",
        benefits: "Benefits:"
    },
    mr: {
        appTitle: "मेडी-स्कीम कनेक्ट",
        appSubtitle: "AI-आधारित औषध शिफारसी आणि सरकारी योजना शोधक",
        navDrug: "💊 औषध शिफारसी",
        navScheme: "📜 सरकारी योजना",
        searchTitle: "🔍 लक्षणे आणि रोग शोध",
        searchSubtitle: "एकापेक्षा जास्त लक्षणे किंवा रोग जोडण्यासाठी टाइप करा.",
        searchPlaceholder: "लक्षण टाइप करा (उदा. ताप)...",
        recommendationTitle: "🩺 शिफारसी",
        findSchemesTitle: "📜 योजना शोधा",
        findSchemesSubtitle: "संबंधित सरकारी मदत पाहण्यासाठी विशिष्ट रोग निवडा.",
        selectConditionLabel: "रोग निवडा:",
        selectConditionPlaceholder: "-- रोग निवडा --",
        applicableSchemesTitle: "🏛️ लागू योजना",
        hospitalsTitle: "🏥 जवळची रुग्णालये",
        checkSchemesBtn: "योजना तपासा",
        applyBtn: "अर्ज करा / अधिक माहिती",
        mapBtn: "नकाशावर पहा ↗️",
        noResults: "या इनपुटसाठी कोणतीही विशिष्ट स्थिती आढळली नाही.",
        noSchemes: "या स्थितीसाठी कोणतीही विशिष्ट सरकारी योजना आढळली नाही. कृपया सामान्य आरोग्य विमा तपासा.",
        recommendedMeds: "शिफारस केलेली औषधे:",
        benefits: "फायदे:"
    }
};

// DOM Elements
const navBtns = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view-section');

const searchInput = document.getElementById('search-input');
const suggestionsList = document.getElementById('suggestions-list');
const selectedTagsContainer = document.getElementById('selected-tags');
const diagnosisSection = document.getElementById('diagnosis-section');
const diseaseListContainer = document.getElementById('disease-list-container');

const schemeDiseaseSelect = document.getElementById('scheme-disease-select');
const schemeSection = document.getElementById('scheme-details-section');
const schemesContainer = document.getElementById('schemes-container');
const hospitalSection = document.getElementById('hospital-section');
const hospitalsContainer = document.getElementById('hospitals-container');

const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');

// Map all potential search terms (Symptoms + Diseases) for auto-complete
const SEARCH_TERMS = [
    ...DATA.symptoms,
    ...Object.keys(DATA.medicines)
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupSearch();
    populateSchemeDropdown();
    setupSettings();
});

// --- Settings Logic ---
function setupSettings() {
    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        STATE.currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        themeToggle.textContent = STATE.currentTheme === 'dark' ? '☀️' : '🌙';
    });

    // Language Toggle
    langToggle.addEventListener('click', () => {
        STATE.currentLang = STATE.currentLang === 'en' ? 'mr' : 'en';
        langToggle.textContent = STATE.currentLang === 'en' ? 'English / मराठी' : 'मराठी / English';
        applyLanguage(STATE.currentLang);
    });
}

// Helper to get text based on current lang
function getT(key) {
    return TRANSLATIONS[STATE.currentLang][key] || key;
}

// Helper to get term text based on current lang
function getTermText(term) {
    if (STATE.currentLang === 'mr' && DATA.termTranslations[term]) {
        return DATA.termTranslations[term];
    }
    return term;
}

// Ensure tags update when language changes
function applyLanguage(lang) {
    const t = TRANSLATIONS[lang];

    // Update Static Elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.placeholder = t[key];
    });

    // Re-render Dynamic Content
    renderTags(); // Update tag labels
    if (STATE.selectedItems.size > 0) updateRecommendations();
    if (schemeDiseaseSelect.value) showSchemesAndHospitals(schemeDiseaseSelect.value);

    // Update Dropdowns
    updateSchemeDropdown(lang);
}

function updateSchemeDropdown(lang) {
    // Save current selection
    const currentVal = schemeDiseaseSelect.value;

    // Clear and rebuild
    schemeDiseaseSelect.innerHTML = `<option value="">${getT('selectConditionPlaceholder')}</option>`;

    const conditions = new Set();
    DATA.schemes.forEach(s => s.conditions.forEach(c => conditions.add(c)));
    Object.keys(DATA.medicines).forEach(d => conditions.add(d));

    conditions.forEach(c => {
        if (c === "All (Generic Medicines)") return;
        const option = document.createElement('option');
        option.value = c; // Value remains English ID
        option.textContent = getTermText(c); // Display is localized
        schemeDiseaseSelect.appendChild(option);
    });

    schemeDiseaseSelect.value = currentVal;
}

// --- Navigation Logic ---
function setupNavigation() {
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const viewId = btn.dataset.view;
            STATE.currentView = viewId;

            // Toggle Background Mode
            if (viewId === 'view-schemes') {
                document.body.classList.add('scheme-mode');
            } else {
                document.body.classList.remove('scheme-mode');
            }

            views.forEach(view => {
                if (view.id === viewId) {
                    view.classList.remove('hidden');
                    view.classList.add('animate-in');
                } else {
                    view.classList.add('hidden');
                    view.classList.remove('animate-in');
                }
            });
        });
    });
}

// --- Schemes View Logic ---
function populateSchemeDropdown() {
    // This function is now replaced by updateSchemeDropdown, but keeping it for context if other parts still call it.
    // Ideally, calls to populateSchemeDropdown should be replaced with updateSchemeDropdown(STATE.currentLang).
    // For now, ensure initial load uses updateSchemeDropdown.
    updateSchemeDropdown(STATE.currentLang);
}

schemeDiseaseSelect.addEventListener('change', (e) => {
    const disease = e.target.value;
    if (!disease) {
        schemeSection.classList.add('hidden');
        hospitalSection.classList.add('hidden');
        return;
    }
    showSchemesAndHospitals(disease);
});

function showSchemesAndHospitals(disease) {
    schemeSection.classList.remove('hidden');
    hospitalSection.classList.remove('hidden');

    // 1. Filter Schemes
    const relevantSchemes = DATA.schemes.filter(scheme => {
        return scheme.conditions.includes(disease) || scheme.conditions.includes("All (Generic Medicines)");
    });

    schemesContainer.innerHTML = '';
    if (relevantSchemes.length === 0) {
        schemesContainer.innerHTML = `<p>${getT('noSchemes')}</p>`;
    } else {
        relevantSchemes.forEach(scheme => {
            const el = document.createElement('div');
            el.className = 'result-item animate-in';
            el.innerHTML = `
                <span class="scheme-badge">Govt Scheme</span>
                <h3 style="margin-bottom:0.5rem;">${scheme.name}</h3>
                <p><strong>${getT('benefits')}</strong> ${scheme.benefits}</p>
                <div class="tag-container" style="margin-top:0.5rem;">
                    ${scheme.documents.map(doc => `<span class="tag">📄 ${doc}</span>`).join('')}
                </div>
                <a href="${scheme.link}" target="_blank" class="btn" style="margin-top:1rem;">${getT('applyBtn')}</a>
            `;
            schemesContainer.appendChild(el);
        });
    }

    // 2. Filter Hospitals
    hospitalsContainer.innerHTML = '';
    DATA.hospitals.forEach(hosp => {
        const el = document.createElement('div');
        el.className = 'result-item animate-in';
        el.innerHTML = `
            <h4>${hosp.name}</h4>
            <p style="font-size:0.9rem; color:var(--text-muted);">${hosp.type}</p>
            <p>📍 ${hosp.location}</p>
            <a href="https://www.google.com/maps/search/?api=1&query=${hosp.coords}" target="_blank" style="color:var(--primary-color); font-size:0.9rem; margin-top:0.5rem; display:block;">${getT('mapBtn')}</a>
        `;
        hospitalsContainer.appendChild(el);
    });
}


// --- Search & Tag Logic ---
function setupSearch() {
    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        if (val.length < 1) {
            suggestionsList.classList.add('hidden');
            return;
        }

        // Search against BOTH English and Translation
        const matches = SEARCH_TERMS.filter(term => {
            const englishMatch = term.toLowerCase().includes(val);
            const marathiMatch = (DATA.termTranslations[term] || "").toLowerCase().includes(val);

            return (englishMatch || marathiMatch) && !STATE.selectedItems.has(term);
        });

        renderSuggestions(matches);
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
            suggestionsList.classList.add('hidden');
        }
    });
}

function renderSuggestions(matches) {
    suggestionsList.innerHTML = '';
    if (matches.length === 0) {
        suggestionsList.classList.add('hidden');
        return;
    }

    matches.forEach(term => {
        const li = document.createElement('li');
        li.className = 'suggestion-item';
        // Display term in current language (e.g., "Fever (ताप)") or just "ताप"
        // Let's show the Localized version primarily
        li.textContent = getTermText(term);

        li.addEventListener('click', () => {
            addItem(term);
            searchInput.value = '';
            suggestionsList.classList.add('hidden');
        });
        suggestionsList.appendChild(li);
    });

    suggestionsList.classList.remove('hidden');
}

function addItem(item) {
    if (STATE.selectedItems.has(item)) return;
    STATE.selectedItems.add(item);
    renderTags();
    updateRecommendations();
}

function removeItem(item) {
    STATE.selectedItems.delete(item);
    renderTags();
    updateRecommendations();
}

function renderTags() {
    selectedTagsContainer.innerHTML = '';
    STATE.selectedItems.forEach(item => {
        const span = document.createElement('span');
        span.className = 'tag-item';
        // Show Localized Name in tag
        span.innerHTML = `${getTermText(item)} <span class="tag-remove" onclick="removeItem('${item}')">&times;</span>`;
        selectedTagsContainer.appendChild(span);
    });
}

// --- Recommendation Logic ---
function updateRecommendations() {
    diseaseListContainer.innerHTML = '';

    if (STATE.selectedItems.size === 0) {
        diagnosisSection.classList.add('hidden');
        return;
    }

    diagnosisSection.classList.remove('hidden');

    const uniqueDiseases = new Set();

    STATE.selectedItems.forEach(item => {
        if (DATA.diagnoses[item]) {
            DATA.diagnoses[item].forEach(d => uniqueDiseases.add(d));
        }
        if (DATA.medicines[item]) {
            uniqueDiseases.add(item);
        }
    });

    if (uniqueDiseases.size === 0) {
        diseaseListContainer.innerHTML = `<p>${getT('noResults')}</p>`;
        return;
    }

    uniqueDiseases.forEach(disease => {
        const div = document.createElement('div');
        div.className = 'result-item animate-in';

        let medicineInfo = DATA.medicines[disease];
        let medHtml = '';
        if (medicineInfo) {
            medHtml = `
                <div style="margin-top:0.5rem; font-size:0.9rem;">
                    <strong>${getT('recommendedMeds')}</strong> ${medicineInfo.drugs.join(", ")}<br>
                    <span style="color:var(--text-muted)">📝 ${medicineInfo.advice}</span>
                </div>
            `;
        }

        // Localize Disease Name in Header
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3 style="color:var(--secondary-color); margin:0;">${getTermText(disease)}</h3>
                <button class="btn" style="width:auto; padding:0.25rem 0.75rem; font-size:0.8rem; border-radius:1rem;">${getT('checkSchemesBtn')}</button>
            </div>
            ${medHtml}
        `;

        const btn = div.querySelector('button');
        btn.addEventListener('click', () => {
            const schemeBtn = document.querySelector('[data-view="view-schemes"]');
            schemeBtn.click();

            setTimeout(() => {
                schemeDiseaseSelect.value = disease; // internal value is English
                schemeDiseaseSelect.dispatchEvent(new Event('change'));
                schemeDiseaseSelect.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        });

        diseaseListContainer.appendChild(div);
    });
}

window.removeItem = removeItem;
