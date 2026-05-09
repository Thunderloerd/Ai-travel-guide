// =========================================================
// PRE-FLOW LOGIC: Landing → City Selection → Main Page
// =========================================================

// City data with images
const cities = [
  {
    name: 'London',
    description: 'Historic elegance meets modern sophistication',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80'
  },
  {
    name: 'Dubai',
    description: 'Luxury, innovation, and desert grandeur',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80'
  },
  {
    name: 'Barcelona',
    description: 'Artistic flair and Mediterranean charm',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80'
  },
  {
    name: 'Tokyo',
    description: 'Futuristic innovation meets ancient tradition',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80'
  },
  {
    name: 'New York',
    description: 'The city that never sleeps, always inspiring',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80'
  },
  {
    name: 'Custom',
    description: 'Plan your own unique adventure',
    image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
];

// DOM Elements
const landingPage = document.getElementById('landing-page');
const citySelectionCard = document.getElementById('city-selection-card');
const mainPage = document.getElementById('main-page');
const startJourneyBtn = document.getElementById('start-journey-btn');
const carouselLeft = document.getElementById('carousel-left');
const carouselRight = document.getElementById('carousel-right');
const customCityInput = document.getElementById('custom-city-input');
const customCityBtn = document.getElementById('custom-city-btn');
const themeToggle = document.getElementById('theme-toggle');
const destinationInput = document.getElementById('destination');
const backButton = document.getElementById('back-to-city-selection');

// State
let currentCityIndex = 0;
let isTransitioning = false;

// =========================================================
// THEME TOGGLE
// =========================================================
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('.theme-icon');
  icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', toggleTheme);
initTheme();

// =========================================================
// OVERFLOW MANAGEMENT
// =========================================================
function setPageOverflow(shouldPreventScroll) {
  if (shouldPreventScroll) {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
  } else {
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
  }
}

function setLandingPageOverflow(isLandingVisible) {
  setPageOverflow(isLandingVisible);
}

// =========================================================
// LANDING PAGE → CITY SELECTION
// =========================================================
startJourneyBtn.addEventListener('click', () => {
  landingPage.classList.add('hidden');
  citySelectionCard.classList.remove('hidden');
  themeToggle.classList.remove('hidden');
  setPageOverflow(true); // Keep overflow hidden for city selection
  renderCityCarousel();
});

// =========================================================
// CITY CAROUSEL RENDERING
// =========================================================
function renderCityCarousel() {
  const carousel = document.getElementById('city-carousel');
  carousel.innerHTML = '';

  // Calculate indices for left, center, right
  const leftIndex = (currentCityIndex - 1 + cities.length) % cities.length;
  const centerIndex = currentCityIndex;
  const rightIndex = (currentCityIndex + 1) % cities.length;

  const indices = [
    { index: leftIndex, position: 'left' },
    { index: centerIndex, position: 'center' },
    { index: rightIndex, position: 'right' }
  ];

  indices.forEach(({ index, position }) => {
    const city = cities[index];
    const card = document.createElement('div');
    card.className = `city-card ${position}`;

    // Handle custom city gradient vs image
    if (city.name === 'Custom') {
      card.style.background = city.image;
    } else {
      card.style.backgroundImage = `url(${city.image})`;
    }

    card.innerHTML = `
            <div class="city-card-content">
                <h3>${city.name}</h3>
                <p>${city.description}</p>
            </div>
        `;

    card.addEventListener('click', () => selectCity(city.name));
    carousel.appendChild(card);
  });
}

// =========================================================
// CAROUSEL NAVIGATION
// =========================================================
function navigateCarousel(direction) {
  if (isTransitioning) return;

  isTransitioning = true;

  // Update index
  if (direction === 'next') {
    currentCityIndex = (currentCityIndex + 1) % cities.length;
  } else {
    currentCityIndex = (currentCityIndex - 1 + cities.length) % cities.length;
  }

  // Re-render with new positions (CSS transitions handle animation)
  renderCityCarousel();

  setTimeout(() => {
    isTransitioning = false;
  }, 450);
}

carouselLeft.addEventListener('click', () => navigateCarousel('prev'));
carouselRight.addEventListener('click', () => navigateCarousel('next'));

// =========================================================
// CITY SELECTION
// =========================================================
function selectCity(cityName) {
  if (cityName === 'Custom') {
    // Show custom input, don't proceed yet
    customCityInput.focus();
    return;
  }

  // Pre-fill destination and transition to main page
  if (destinationInput) {
    destinationInput.value = cityName;
  }

  transitionToMainPage();
}

// =========================================================
// CUSTOM CITY INPUT
// =========================================================
customCityBtn.addEventListener('click', () => {
  const customCity = customCityInput.value.trim();
  if (customCity) {
    if (destinationInput) {
      destinationInput.value = customCity;
    }
    transitionToMainPage();
  }
});

customCityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    customCityBtn.click();
  }
});

// =========================================================
// TRANSITION TO MAIN PAGE
// =========================================================
function transitionToMainPage() {
  citySelectionCard.classList.add('hidden');
  mainPage.classList.remove('hidden');
  themeToggle.classList.remove('hidden');
  setPageOverflow(false); // Allow scrolling on main page

  // Smooth scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =========================================================
// BACK TO CITY SELECTION
// =========================================================
backButton.addEventListener('click', () => {
  mainPage.classList.add('hidden');
  citySelectionCard.classList.remove('hidden');
  setPageOverflow(true); // Prevent scrolling on city selection
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =========================================================
// INITIALIZE ON LOAD
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  // Show landing page by default
  landingPage.classList.remove('hidden');
  citySelectionCard.classList.add('hidden');
  mainPage.classList.add('hidden');
  themeToggle.classList.add('hidden');
  setLandingPageOverflow(true);
});

// =========================================================
// MAIN TRAVEL GUIDE FUNCTIONALITY
// =========================================================

// Chip logic for preferences
const preferenceChips = document.querySelectorAll('#preferences-chips .chip');
const preferencesInput = document.getElementById('preferences');
let selectedPreferences = [];

preferenceChips.forEach(chip => {
  chip.addEventListener('click', () => {
    if (chip.classList.contains('disabled') && !chip.classList.contains('selected')) return;

    const value = chip.getAttribute('data-value');
    
    // Check if already selected
    if (selectedPreferences.includes(value)) {
      // Deselect
      selectedPreferences = selectedPreferences.filter(p => p !== value);
      chip.classList.remove('selected');
    } else {
      // Allow max 2
      if (selectedPreferences.length < 2) {
        selectedPreferences.push(value);
        chip.classList.add('selected');
      }
    }
    
    preferencesInput.value = selectedPreferences.join(', ');
    
    if (selectedPreferences.length >= 2) {
      preferenceChips.forEach(c => {
        if (!c.classList.contains('selected')) c.classList.add('disabled');
      });
    } else {
      preferenceChips.forEach(c => c.classList.remove('disabled'));
    }
  });
});

// Backend endpoint
const BACKEND_URL = "/generate";
let latestItineraryPrompt = "";

// DOM elements
const form = document.getElementById("travel-form");
const loading = document.getElementById("loading");
const results = document.getElementById("results");
const itineraryDiv = document.getElementById("itinerary");

const showFlightsBtn = document.getElementById("show-flights");
const showTrainsBtn = document.getElementById("show-trains");
const showBusesBtn = document.getElementById("show-buses");

const flightsDiv = document.getElementById("flights");
const trainsDiv = document.getElementById("trains");
const busesDiv = document.getElementById("buses");

const showHotelsBtn = document.getElementById("show-hotels");
const hotelsDiv = document.getElementById("hotels");


// ---------- HELPER LINKS ----------
function flightLinks(destination) {
  destination = encodeURIComponent(destination);
  return `
    <div style="margin-top:12px;">
      <h3>Flight Search Links</h3>
      <a href="https://www.google.com/search?q=flights+to+${destination}" target="_blank">Google Flights</a><br>
      <a href="https://www.skyscanner.co.in/transport/flights-to/${destination}/" target="_blank">Skyscanner</a>
    </div>
  `;
}

function trainLinks() {
  return `
    <div style="margin-top:12px;">
      
    </div>
  `;
}

function busLinks(destination) {
  destination = encodeURIComponent(destination);
  return `
    <div style="margin-top:12px;">
      
    </div>
  `;
}

let tripValidatorRunId = 0;

function getPrimaryDestination(destination) {
  return destination.split(",")[0].trim();
}

function getWeatherSummary(weatherCode, maxTemp) {
  const code = Number(weatherCode);
  const temp = Number.isFinite(Number(maxTemp)) ? `${Math.round(Number(maxTemp))}°C expected` : "forecast available";

  if (code === 0) return `Clear sky, ${temp}`;
  if ([1, 2].includes(code)) return `Mostly sunny, ${temp}`;
  if (code === 3) return `Cloudy, ${temp}`;
  if ([45, 48].includes(code)) return `Foggy, ${temp}`;
  if ([51, 53, 55, 56, 57].includes(code)) return `Drizzle possible, ${temp}`;
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return `Rain expected, ${temp}`;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return `Snow expected, ${temp}`;
  if ([95, 96, 99].includes(code)) return `Thunderstorms possible, ${temp}`;

  return `Mixed conditions, ${temp}`;
}

function getBudgetValidationMessage(budget, days) {
  const parsedBudget = Number(budget);
  const parsedDays = Number(days);

  if (!Number.isFinite(parsedBudget) || !Number.isFinite(parsedDays) || parsedDays <= 0) {
    return {
      status: "review",
      message: "Add a valid budget and trip length to validate daily spend."
    };
  }

  let estimatedFlightCost = 0;
  const itineraryText = itineraryDiv.innerText || "";
  const travelCostLine = itineraryText.split("\n").find(line => /total\s+travel\s+cost/i.test(line) && line.includes("₹"));
  if (travelCostLine) {
    const travelCostMatch = travelCostLine.match(/₹\s*([\d,]+)/);
    if (travelCostMatch) {
      const parsedTravelCost = parseInt(travelCostMatch[1].replace(/,/g, ""), 10);
      if (Number.isFinite(parsedTravelCost)) estimatedFlightCost = parsedTravelCost;
    }
  }

  const perDayBudget = (parsedBudget - estimatedFlightCost) / parsedDays;

  if (perDayBudget < 1000) {
    return {
      status: "warning",
      message: `Very tight budget at ₹${Math.round(perDayBudget).toLocaleString("en-IN")} per day.`
    };
  }

  if (perDayBudget <= 2500) {
    return {
      status: "moderate",
      message: `Moderate budget at ₹${Math.round(perDayBudget).toLocaleString("en-IN")} per day.`
    };
  }

  return {
    status: "okay",
    message: `Budget looks comfortable at ₹${Math.round(perDayBudget).toLocaleString("en-IN")} per day.`
  };
}

async function fetchWeatherValidation(destination) {
  const cityName = getPrimaryDestination(destination);
  if (!cityName) return null;

  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`;
  const geocodingResponse = await fetch(geocodingUrl);
  if (!geocodingResponse.ok) return null;

  const geocodingData = await geocodingResponse.json();
  const location = geocodingData.results && geocodingData.results[0];
  if (!location) return null;

  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
  const forecastResponse = await fetch(forecastUrl);
  if (!forecastResponse.ok) return null;

  const forecastData = await forecastResponse.json();
  const daily = forecastData.daily;
  if (!daily || !daily.weathercode || !daily.temperature_2m_max) return null;

  return getWeatherSummary(daily.weathercode[0], daily.temperature_2m_max[0]);
}

function renderTripValidatorCard({ weatherSummary, budgetValidation }) {
  const existingCard = document.getElementById("trip-validator-card");
  if (existingCard) existingCard.remove();

  const card = document.createElement("div");
  card.id = "trip-validator-card";
  card.className = `trip-validator-card trip-validator-${budgetValidation.status}`;

  const rows = [];
  if (weatherSummary) {
    rows.push(`
      <div class="trip-validator-row">
        <span class="trip-validator-label">Weather:</span>
        <span>${weatherSummary}</span>
      </div>
    `);
  }

  rows.push(`
    <div class="trip-validator-row">
      <span class="trip-validator-label">Budget:</span>
      <span>${budgetValidation.message}</span>
    </div>
  `);

  rows.push(`
    <div class="trip-validator-row">
      <span class="trip-validator-label">✅ Overall:</span>
      <span>${budgetValidation.status === "okay" ? "Your trip looks good!" : "Review your plan before booking"}</span>
    </div>
  `);

  card.innerHTML = rows.join("");
  itineraryDiv.insertAdjacentElement("afterend", card);
}

async function triggerTripValidator() {
  const currentRunId = ++tripValidatorRunId;
  const existingCard = document.getElementById("trip-validator-card");
  if (existingCard) existingCard.remove();

  const destination = document.getElementById("destination").value;
  const budget = document.getElementById("budget").value;
  const days = document.getElementById("days").value;
  const budgetValidation = getBudgetValidationMessage(budget, days);

  let weatherSummary = null;
  try {
    weatherSummary = await fetchWeatherValidation(destination);
  } catch (err) {
    weatherSummary = null;
  }

  if (currentRunId !== tripValidatorRunId) return;
  renderTripValidatorCard({ weatherSummary, budgetValidation });
}

async function runBudgetIntegrityCheck() {
  const itineraryText = itineraryDiv.innerText || "";
  const totalLine = itineraryText.split("\n").find(line => /total(?:\s+cost)?\s*:/i.test(line) && line.includes("₹"));
  if (!totalLine) return;

  const totalMatch = totalLine.match(/total(?:\s+cost)?\s*:\s*₹\s*([\d,]+)/i);
  if (!totalMatch) return;

  const extractedTotal = parseInt(totalMatch[1].replace(/,/g, ""), 10);
  const userBudget = parseInt(document.getElementById("budget").value.replace(/,/g, ""), 10);
  if (!Number.isFinite(extractedTotal) || !Number.isFinite(userBudget) || extractedTotal <= userBudget) return;

  const originalLoadingText = loading.textContent;
  const existingBadge = document.getElementById("budget-auto-corrected-badge");
  if (existingBadge) existingBadge.remove();

  try {
    loading.textContent = "⚙️ Auto-correcting itinerary to fit budget...";
    loading.style.display = "block";

    const correctedPrompt = `${latestItineraryPrompt}

STRICT RULE: The total of ALL costs in your itinerary
MUST NOT exceed ₹${userBudget}.
This is non-negotiable. Double check your numbers before responding.`;

    const retryResponse = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: correctedPrompt })
    });
    if (!retryResponse.ok) return;

    const retryData = await retryResponse.json();
    if (!retryData.text) return;

    itineraryDiv.innerHTML = retryData.text;

    const badge = document.createElement("div");
    badge.id = "budget-auto-corrected-badge";
    badge.textContent = "✨ Itinerary was auto-corrected to fit your budget";
    badge.style.display = "inline-block";
    badge.style.margin = "0 0 14px";
    badge.style.padding = "8px 14px";
    badge.style.background = "var(--surface)";
    badge.style.border = "1px solid #22c55e";
    badge.style.borderRadius = "999px";
    badge.style.boxShadow = "var(--shadow-sm)";
    badge.style.color = "var(--text-main)";
    badge.style.fontSize = "0.95rem";
    badge.style.fontWeight = "600";
    badge.style.animation = "fadeIn 0.4s ease-out";
    itineraryDiv.insertAdjacentElement("beforebegin", badge);

    setTimeout(() => {
      const currentBadge = document.getElementById("budget-auto-corrected-badge");
      if (currentBadge) currentBadge.remove();
    }, 5000);
  } catch (err) {
    // Keep the original itinerary if the correction request fails.
  } finally {
    loading.textContent = originalLoadingText;
    loading.style.display = "none";
  }
}

function renderBudgetChoiceCardIfNeeded(generatedHtml) {
  const currentChoiceCard = document.getElementById("budget-choice-card");
  if (currentChoiceCard) currentChoiceCard.remove();

  const preview = document.createElement("div");
  preview.innerHTML = generatedHtml || "";
  const generatedText = (preview.innerText || preview.textContent || "").trim();
  if (!/^⚠️?\s*(Budget Alert|Warning: This budget may be insufficient)/i.test(generatedText)) return false;

  let warningText = generatedText;
  const itineraryStart = warningText.search(/\n\s*(?:🚀\s*)?(Getting There|Overview|Estimated Cost|Day\s+1|\d+-Day Itinerary)\b/i);
  if (itineraryStart > 0) {
    warningText = warningText.slice(0, itineraryStart).trim();
  }

  const budgetChoiceCard = document.createElement("div");
  budgetChoiceCard.id = "budget-choice-card";
  budgetChoiceCard.style.margin = "0 0 20px";
  budgetChoiceCard.style.padding = "18px 20px";
  budgetChoiceCard.style.background = "var(--surface)";
  budgetChoiceCard.style.border = "1px solid var(--border)";
  budgetChoiceCard.style.borderRadius = "var(--radius)";
  budgetChoiceCard.style.boxShadow = "var(--shadow-sm)";
  budgetChoiceCard.style.animation = "fadeIn 0.4s ease-out";

  const warning = document.createElement("p");
  warning.style.margin = "0 0 16px";
  warning.style.color = "var(--text-main)";
  warning.style.whiteSpace = "pre-line";
  warning.textContent = warningText;

  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.gap = "12px";
  actions.style.flexWrap = "wrap";

  const alternativesButton = document.createElement("button");
  alternativesButton.id = "btn-alternative-destinations";
  alternativesButton.type = "button";
  alternativesButton.textContent = "Show Me Alternatives";
  alternativesButton.style.flex = "1";
  alternativesButton.style.minWidth = "180px";
  alternativesButton.style.background = "#0f766e";
  alternativesButton.style.color = "white";
  alternativesButton.style.border = "1px solid var(--border)";
  alternativesButton.style.borderRadius = "var(--radius)";
  alternativesButton.style.padding = "12px 16px";
  alternativesButton.style.fontWeight = "700";
  alternativesButton.addEventListener("click", () => {
    console.log("PHASE 2 - Alternative destinations clicked");
  });

  const continueButton = document.createElement("button");
  continueButton.id = "btn-continue-anyway";
  continueButton.type = "button";
  continueButton.textContent = "⚠️ Continue With Original Plan";
  continueButton.style.flex = "1";
  continueButton.style.minWidth = "220px";
  continueButton.style.background = "#f59e0b";
  continueButton.style.color = "white";
  continueButton.style.border = "1px solid var(--border)";
  continueButton.style.borderRadius = "var(--radius)";
  continueButton.style.padding = "12px 16px";
  continueButton.style.fontWeight = "700";
  continueButton.addEventListener("click", () => {
    console.log("PHASE 2 - Continue anyway clicked");
  });

  const note = document.createElement("p");
  note.style.margin = "14px 0 0";
  note.style.color = "var(--text-light)";
  note.style.fontSize = "0.95rem";
  note.textContent = "Alternatives will suggest destinations within your budget. Original plan will show the trip with honest cost warnings.";

  actions.appendChild(alternativesButton);
  actions.appendChild(continueButton);
  budgetChoiceCard.appendChild(warning);
  budgetChoiceCard.appendChild(actions);
  budgetChoiceCard.appendChild(note);

  itineraryDiv.innerHTML = "";
  itineraryDiv.appendChild(budgetChoiceCard);
  return true;
}


// =========================================================
//  1) GENERATE ITINERARY  (NO FLIGHTS / TRAINS / BUSES INSIDE)
// =========================================================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  loading.style.display = "block";
  results.style.display = "none";

  itineraryDiv.innerHTML = "";
  const existingResearchCard = document.getElementById("agent-research-card");
  if (existingResearchCard) existingResearchCard.remove();
  const existingBudgetWarningCard = document.getElementById("budget-warning-card");
  if (existingBudgetWarningCard) existingBudgetWarningCard.remove();
  const existingBudgetChoiceCard = document.getElementById("budget-choice-card");
  if (existingBudgetChoiceCard) existingBudgetChoiceCard.remove();

  const destination = document.getElementById("destination").value;
  const startingFrom = document.getElementById("starting-from").value.trim();
  const budget = document.getElementById("budget").value;
  const preferences = document.getElementById("preferences").value;
  const days = document.getElementById("days").value;
  const originalLoadingText = loading.textContent;
  loading.textContent = "Researching your destination... ✈️";

  const getDestinationCity = () => destination.split(",")[0].trim();

  const getForecastCondition = (weatherCode) => {
    const code = Number(weatherCode);

    if (code === 0) return "clear sky";
    if ([1, 2].includes(code)) return "mostly sunny";
    if (code === 3) return "cloudy";
    if ([45, 48].includes(code)) return "foggy";
    if ([51, 53, 55, 56, 57].includes(code)) return "drizzle possible";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rain expected";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow expected";
    if ([95, 96, 99].includes(code)) return "thunderstorms possible";

    return "mixed conditions";
  };

  const fetchWeatherContext = async () => {
    try {
      const cityName = getDestinationCity();
      if (!cityName) return "";

      const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`;
      const geocodingResponse = await fetch(geocodingUrl);
      if (!geocodingResponse.ok) return "";

      const geocodingData = await geocodingResponse.json();
      const location = geocodingData.results && geocodingData.results[0];
      if (!location) return "";

      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
      const forecastResponse = await fetch(forecastUrl);
      if (!forecastResponse.ok) return "";

      const forecastData = await forecastResponse.json();
      const daily = forecastData.daily;
      if (!daily || !daily.weathercode || !daily.temperature_2m_max || !daily.temperature_2m_min) return "";

      const minTemp = Math.round(Math.min(...daily.temperature_2m_min));
      const maxTemp = Math.round(Math.max(...daily.temperature_2m_max));
      const condition = getForecastCondition(daily.weathercode[0]);

      return `Weather: ${condition}, ${minTemp}-${maxTemp}°C expected`;
    } catch (err) {
      return "";
    }
  };

  const fetchWikipediaContext = async () => {
    try {
      const cityName = getDestinationCity();
      if (!cityName) return "";

      const wikipediaUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`;
      const wikipediaResponse = await fetch(wikipediaUrl);
      if (!wikipediaResponse.ok) return "";

      const wikipediaData = await wikipediaResponse.json();
      if (!wikipediaData.extract) return "";

      const sentences = wikipediaData.extract.match(/[^.!?]+[.!?]+/g);
      const summary = sentences ? sentences.slice(0, 2).join(" ").trim() : wikipediaData.extract.trim();

      return summary;
    } catch (err) {
      return "";
    }
  };

  const fetchAgentResearchInsights = async (weatherSummary, wikipediaSummary) => {
    try {
      const insightPrompt = `You are a smart travel agent assistant. Given this raw data:
Weather: ${weatherSummary}
Destination Info: ${wikipediaSummary}

Write exactly 2 short, friendly, helpful insights for a traveler.
Format as exactly 2 lines:
️ [one sentence weather tip based on actual temperature and condition]
 [one sentence practical travel insight based on the destination info]

You MUST respond with EXACTLY 2 lines, no more, no less.
Line 1 must start with ️
Line 2 must start with
Each line max 20 words.
Do not combine them. Do not add any other text.

Be specific, warm, and useful. Max 20 words per line.`;

      const insightResponse = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: insightPrompt })
      });
      if (!insightResponse.ok) return "";

      const insightData = await insightResponse.json();
      return insightData.text || "";
    } catch (err) {
      return "";
    }
  };

  const isIndianDestination = () => {
    const cityName = getDestinationCity().toLowerCase();
    const destinationText = destination.toLowerCase();
    const indianCities = [
      "agra", "ahmedabad", "ajmer", "amritsar", "aurangabad", "bengaluru", "bangalore",
      "bhopal", "bhubaneswar", "chandigarh", "chennai", "coimbatore", "darjeeling",
      "delhi", "dehradun", "goa", "gurgaon", "gurugram", "guwahati", "hyderabad",
      "indore", "jaipur", "jaisalmer", "jodhpur", "kanpur", "kochi", "kolkata",
      "leh", "lucknow", "madurai", "manali", "mangalore", "mumbai", "mysuru", "mysore",
      "nainital", "noida", "ooty", "pune", "rishikesh", "shimla", "srinagar", "surat",
      "thiruvananthapuram", "udaipur", "varanasi", "visakhapatnam"
    ];

    return destinationText.includes("india") || indianCities.includes(cityName);
  };

  const renderBudgetWarningCard = () => {
    const currentWarningCard = document.getElementById("budget-warning-card");
    if (currentWarningCard) currentWarningCard.remove();

    const parsedBudget = Number(budget);
    const parsedDays = Number(days);
    if (!Number.isFinite(parsedBudget) || !Number.isFinite(parsedDays) || parsedDays <= 0) return;

    const indianDestination = isIndianDestination();
    let warningMessage = "";

    if (!indianDestination && parsedBudget < 80000) {
      warningMessage = `⚠️ Your budget of ₹${parsedBudget.toLocaleString("en-IN")} may not cover flights to ${destination}. International flights from India typically cost ₹40,000–₹80,000+. Consider increasing your budget or choosing a closer destination.`;
    } else if (indianDestination && parsedBudget / parsedDays < 800) {
      warningMessage = `⚠️ ₹${parsedBudget.toLocaleString("en-IN")} for ${days} days in ${destination} is very tight. You may face difficulty covering food and stay comfortably.`;
    }

    if (!warningMessage) return;

    const budgetWarningCard = document.createElement("div");
    budgetWarningCard.id = "budget-warning-card";
    budgetWarningCard.style.margin = "0 0 20px";
    budgetWarningCard.style.padding = "16px 18px";
    budgetWarningCard.style.background = "var(--surface)";
    budgetWarningCard.style.border = "1px solid var(--accent)";
    budgetWarningCard.style.borderLeft = "4px solid var(--accent)";
    budgetWarningCard.style.borderRadius = "var(--radius)";
    budgetWarningCard.style.boxShadow = "var(--shadow-sm)";
    budgetWarningCard.style.color = "var(--text-main)";
    budgetWarningCard.style.animation = "fadeIn 0.4s ease-out";
    budgetWarningCard.textContent = warningMessage;
    itineraryDiv.insertAdjacentElement("beforebegin", budgetWarningCard);
  };

  // Build the "Getting There" block if a starting location is provided
  const gettingThereBlock = startingFrom ? `
IMPORTANT: The user is starting their trip from ${startingFrom}. Always recommend the most realistic and commonly used mode of transport that people actually use in real life — for international destinations this will almost always be a flight, for nearby cities it may be train, bus, or drive. Never suggest driving for intercontinental or international routes. Never suggest impossible or impractical routes.

Your itinerary MUST begin with a section titled '🚀 Getting There' placed before Day 1. This section must include:
- The realistic mode of transport (flight / train / bus / drive — whichever people actually use)
- Estimated one-way travel time
- Estimated one-way travel cost in INR
- Estimated return travel cost in INR

After deducting total travel cost (to + from) from the overall budget, plan the remaining itinerary with the leftover amount. Clearly state the remaining budget at the start of Day 1.
` : '';

  const prompt = `
${gettingThereBlock}
BUDGET CONSTRAINT: The total trip cost MUST be exactly within ₹${budget}. 
This is a HARD LIMIT. Every single cost in the breakdown must add up to less than or equal to ₹${budget}.
Do NOT suggest anything that exceeds this budget.
If budget is low, suggest cheaper options. Never ignore this constraint.

You are a senior professional travel planner. Create a premium-quality ${days}-day itinerary for ${destination} in clean HTML only.

### RULES:
- STRICT HTML ONLY (<h2>, <h3>, <p>, <ul>, <li>, <strong>)
- NO flights, trains, or buses here.
- Itinerary ONLY.
- Expert tone, realistic timings, culture-aware.
- Focus on local travel, sightseeing, food, and experiences.
- Follow user's preferences: ${preferences}
- The total trip cost MUST NOT exceed the given budget.
- Treat the budget as a hard limit, not an estimate.
- If an activity, hotel, or transport does not fit the budget, DO NOT include it.
- Prefer budget-friendly options over luxury ones.
- If the budget is very low, reduce activities instead of increasing cost.
- Clearly mention cost-saving tips when needed.
- Strictly follow preferred activities.
All costs, budgets, and prices MUST be in Indian Rupees (₹). Never use USD.


<h2>Overview</h2>
<p>Give a short 3–4 line introduction to the trip.</p>

<h2>Weather</h2>
<p>Describe typical weather in ${destination}.</p>

<h2>Estimated Cost Breakdown</h2>
<p><strong>Important: The total of all costs below must strictly add up to ≤ ₹${budget}.</strong></p>
<ul>
<li><strong>Stay:</strong> realistic estimate</li>
<li><strong>Food:</strong> typical daily spend</li>
<li><strong>Sightseeing:</strong> average activity cost</li>
<li><strong>Transport:</strong> local travel cost</li>
<li><strong>Total:</strong> trip estimate (Must be ≤ ₹${budget})</li>
</ul>

<h2>${days}-Day Itinerary</h2>
${Array.from({ length: days }, (_, i) => `
<h3>Day ${i + 1}</h3>
<ul>
  <li><strong>Morning:</strong> activity + timing</li>
  <li><strong>Afternoon:</strong> activity + reason</li>
  <li><strong>Evening:</strong> culture/food local experience</li>
</ul>`).join("")}

For every place, landmark, restaurant, or attraction mentioned in the itinerary,
wrap the place name itself in a Google Maps link like this:
<a href="https://www.google.com/maps/search/?api=1&query=PLACE_NAME+${destination}" target="_blank" style="color:#2563eb; text-decoration:underline; font-weight:600;">PLACE_NAME</a>

Example: "Visit <a href="https://www.google.com/maps/search/?api=1&query=Hyde+Park+London" target="_blank" style="color:#2563eb; text-decoration:underline; font-weight:600;">Hyde Park</a> at 8am"

IMPORTANT: The place name must always be visible as the link text. Never add a separate emoji. Never remove the place name from the text.

<h2>Food & Local Cuisine</h2>
<ul>
<li><strong>Must-try dishes:</strong> 4–5 items</li>
<li><strong>Restaurants/Cafés:</strong> 2–3 picks</li>
<li><strong>Street Food:</strong> popular items</li>
</ul>

<h2>Local Tips</h2>
<ul>
<li>Timing + cultural tips</li>
<li>Money-saving tips</li>
<li>Safety advice</li>
</ul>

HONESTY RULE: Never invent or assume cheaper prices
to fit the budget. If flights alone exceed 60% of the
total budget, clearly state at the top:
'⚠️ Warning: This budget may be insufficient for this
destination from India. We recommend a minimum of
₹[realistic amount] for this trip.'
Then continue with the best possible plan given the
actual constraints. Never say 'let's assume' or
'assuming we found cheaper' — only use realistic estimates.
  `;

  try {
    const weatherSummary = await fetchWeatherContext();
    console.log("AGENT STEP 1 - Weather:", weatherSummary)
    const wikipediaSummary = await fetchWikipediaContext();
    console.log("AGENT STEP 2 - Events:", wikipediaSummary)
    const researchInsights = await fetchAgentResearchInsights(weatherSummary, wikipediaSummary);

    const agentResearchCard = document.createElement("div");
    agentResearchCard.id = "agent-research-card";
    agentResearchCard.style.margin = "0 0 20px";
    agentResearchCard.style.padding = "18px 20px";
    agentResearchCard.style.background = "var(--background)";
    agentResearchCard.style.border = "1px solid var(--border)";
    agentResearchCard.style.borderLeft = "4px solid var(--primary)";
    agentResearchCard.style.borderRadius = "var(--radius)";
    agentResearchCard.style.boxShadow = "var(--shadow-sm)";
    agentResearchCard.style.color = "var(--text-main)";
    agentResearchCard.style.animation = "fadeIn 0.4s ease-out";
    const agentResearchTitle = document.createElement("h3");
    agentResearchTitle.style.margin = "0 0 12px";
    agentResearchTitle.style.color = "var(--text-main)";
    agentResearchTitle.textContent = "Agent Research Complete";
    const agentResearchInsights = document.createElement("p");
    agentResearchInsights.style.margin = "6px 0";
    agentResearchInsights.style.color = "var(--text-main)";
    agentResearchInsights.style.whiteSpace = "pre-line";
    agentResearchInsights.textContent = researchInsights || "Research insights are unavailable, but your itinerary will still use the available context.";
    const agentResearchNote = document.createElement("p");
    agentResearchNote.style.margin = "12px 0 0";
    agentResearchNote.style.color = "var(--text-light)";
    agentResearchNote.style.fontSize = "0.95rem";
    agentResearchNote.textContent = "This data was used to personalize your itinerary";
    agentResearchCard.appendChild(agentResearchTitle);
    agentResearchCard.appendChild(agentResearchInsights);
    agentResearchCard.appendChild(agentResearchNote);
    itineraryDiv.insertAdjacentElement("beforebegin", agentResearchCard);

    const enrichedPrompt = `${prompt}

REAL WORLD CONTEXT (use this to make the itinerary more accurate):
${weatherSummary}
${wikipediaSummary}
Use this context to make day-by-day suggestions more accurate.
For example if weather is hot suggest early morning activities,
if a famous festival is nearby mention it.`;

    loading.textContent = originalLoadingText;

    const systemPrompt = enrichedPrompt;
    console.log("AGENT STEP 3 - Prompt preview:", systemPrompt.slice(-300))
    latestItineraryPrompt = enrichedPrompt;

    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: enrichedPrompt })
    });

    const data = await res.json();
    itineraryDiv.innerHTML = data.text || "<p>⚠️ No itinerary generated. Please try again.</p>";
    const budgetChoiceShown = renderBudgetChoiceCardIfNeeded(data.text || "");
    if (!budgetChoiceShown) {
      await runBudgetIntegrityCheck();
    }
    renderBudgetWarningCard();

    console.log("Itinerary HTML:", itineraryDiv.innerHTML);

    loading.style.display = "none";
    results.style.display = "block";

    // Show transport, download, and chat after itinerary loads
    document.getElementById("transport-section").style.display = "block";
    document.getElementById("chat-section").style.display = "block";
    document.getElementById("download-pdf").style.display = "inline-block";
    triggerTripValidator();

  } catch (err) {
    loading.textContent = originalLoadingText;
    itineraryDiv.innerHTML = `<p style="color:red;">Error: ${err}</p>`;
    loading.style.display = "none";
    results.style.display = "block";
  }
});


// =========================================================
//  2) FLIGHTS SECTION
// =========================================================
showFlightsBtn.addEventListener("click", async () => {
  flightsDiv.style.display = "block";  // ADD THIS
  flightsDiv.innerHTML = "⏳ Loading flights...";


  const destination = document.getElementById("destination").value;

  const flightPrompt = `
You are a travel expert. Provide exactly 3 FLIGHT options to ${destination}.
ALL COSTS MUST BE IN INDIAN RUPEES (₹). Never use USD.


STRICT HTML ONLY.

<h2>Flights to ${destination}</h2>

<h3>Option Title</h3>
<ul>
<li><strong>Airline:</strong> ...</li>
<li><strong>Duration:</strong> ...</li>
<li><strong>Price Range:</strong> ...</li>
<li><strong>Tip:</strong> ...</li>
</ul>
<hr>
  `;

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: flightPrompt })
  });

  const data = await res.json();
  flightsDiv.innerHTML = data.text + flightLinks(destination);
});


// =========================================================
//  3) TRAINS SECTION
// =========================================================
showTrainsBtn.addEventListener("click", async () => {
  trainsDiv.style.display = "block";  // ADD THIS
  trainsDiv.innerHTML = "⏳ Loading trains...";

  const destination = document.getElementById("destination").value;

  const trainPrompt = `
You are a travel expert. Provide exactly 3 TRAIN options to reach ${destination}.
ALL COSTS MUST BE IN INDIAN RUPEES (₹). Never use USD.

GIVE LINKS DEPENDING ON COUNTRY
STRICT HTML ONLY.

<h2>Trains to ${destination}</h2>

<h3>Train Name</h3>
<ul>
<li><strong>Type:</strong> Express / Superfast</li>
<li><strong>Duration:</strong> ...</li>
<li><strong>Price Range:</strong> ...</li>
<li><strong>Tip:</strong> ...</li>
</ul>
<hr>
  `;

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: trainPrompt })
  });

  const data = await res.json();
  trainsDiv.innerHTML = data.text + trainLinks();
});


// =========================================================
//  4) BUSES SECTION
// =========================================================
showBusesBtn.addEventListener("click", async () => {
  busesDiv.style.display = "block";  // ADD THIS
  busesDiv.innerHTML = "⏳ Loading buses...";

  const destination = document.getElementById("destination").value;

  const busPrompt = `
You are a travel expert. Provide exactly 3 BUS options to reach ${destination}.
ALL COSTS MUST BE IN INDIAN RUPEES (₹). Never use USD.

GIVE LINKS DEPENDING ON COUNTRY
STRICT HTML ONLY.

<h2>Buses to ${destination}</h2>

<h3>Bus Name</h3>
<ul>
<li><strong>Operator:</strong> ...</li>
<li><strong>Type:</strong> AC / Sleeper / Seater</li>
<li><strong>Duration:</strong> ...</li>
<li><strong>Price Range:</strong> ...</li>
<li><strong>Tip:</strong> ...</li>
</ul>
<hr>
  `;

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: busPrompt })
  });

  const data = await res.json();
  busesDiv.innerHTML = data.text + busLinks(destination);
});


// =========================================================
//  5) HOTELS SECTION
// =========================================================
showHotelsBtn.addEventListener("click", async () => {
  hotelsDiv.style.display = "block";  // ADD THIS
  hotelsDiv.innerHTML = "⏳ Loading hotels...";

  const destination = document.getElementById("destination").value;
  const budget = document.getElementById("budget").value;

  const hotelPrompt = `
You are a travel expert. Suggest exactly 3 hotels in ${destination}, based strictly on the user's budget: ${budget}.
ALL COSTS MUST BE IN INDIAN RUPEES (₹). Never use USD.

GIVE LINKS DEPENDING ON COUNTRY
STRICT HTML ONLY.

<h2>Hotels</h2>
<h3>Hotel Name</h3>
<ul>
<li><strong>Area:</strong> ...</li>
<li><strong>Price Range:</strong> ...</li>
<li><strong>Why it fits the budget:</strong> ...</li>
</ul>
<hr>
  `;

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: hotelPrompt })
  });

  const data = await res.json();
  hotelsDiv.innerHTML = data.text;
});

// =====================
// TRAVEL CHAT FEATURE
// =====================

const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

chatSend.addEventListener("click", async () => {
  const userMsg = chatInput.value.trim();
  if (!userMsg) return;

  // show user message
  chatBox.innerHTML += `<p class="message-user"><strong>You:</strong> ${userMsg}</p>`;
  chatInput.value = "";

  // Scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;

  // prepare travel-smart prompt
  const chatPrompt = `
You are a senior professional travel planner with deep local knowledge.

Your task is to create a realistic, practical, and well-structured travel itinerary.

IMPORTANT RULES (MUST FOLLOW STRICTLY):
- Output ONLY clean HTML (use only: <h2>, <h3>, <p>, <ul>, <li>, <strong>)
- Do NOT include flights, trains, or long-distance buses.
- Focus only on local travel, sightseeing, food, and experiences.
- The total trip cost MUST NOT exceed the given budget.
- Treat the budget as a hard limit, not an estimate.
- If something does not fit the budget, do NOT include it.
- Prefer practical, commonly used options over luxury or unrealistic ones.
- All prices and costs MUST be in Indian Rupees (₹). Never use USD.
- Avoid generic or vague descriptions. Be specific and realistic.

User question: "${userMsg}"
`;

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: chatPrompt })
    });

    const data = await res.json();
    const aiResponse = data.text || "No reply from assistant.";

    chatBox.innerHTML += `<p class="message-ai"><strong>Assistant:</strong> ${aiResponse}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (err) {
    chatBox.innerHTML += `<p style="color:red;">Error: ${err}</p>`;
  }
});
// ===============================
// DOWNLOAD ITINERARY AS PDF
// ===============================
const downloadBtn = document.getElementById("download-pdf");

if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    const content = document.getElementById("itinerary").innerHTML;

    if (!content || content.trim() === "") {
      alert("Please generate an itinerary first.");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>AI Travel Itinerary</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; font-size: 15px; line-height: 1.7; }
            h2 { color: #2563eb; margin-top: 30px; }
            h3 { color: #1e40af; margin-top: 20px; }
            ul { padding-left: 20px; }
            li { margin-bottom: 8px; }
            strong { color: #1e293b; }
            p { margin-bottom: 12px; }
          </style>
        </head>
        <body>
          <h1 style="color:#2563eb;">Your AI Travel Itinerary</h1>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  });
}

