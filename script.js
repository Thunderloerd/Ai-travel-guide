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


// =========================================================
//  1) GENERATE ITINERARY  (NO FLIGHTS / TRAINS / BUSES INSIDE)
// =========================================================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  loading.style.display = "block";
  results.style.display = "none";

  itineraryDiv.innerHTML = "";

  const destination = document.getElementById("destination").value;
  const startingFrom = document.getElementById("starting-from").value.trim();
  const budget = document.getElementById("budget").value;
  const preferences = document.getElementById("preferences").value;
  const days = document.getElementById("days").value;

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
  `;

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    itineraryDiv.innerHTML = data.text || "<p>⚠️ No itinerary generated. Please try again.</p>";

    console.log("Itinerary HTML:", itineraryDiv.innerHTML);

    loading.style.display = "none";
    results.style.display = "block";

    // Show transport, download, and chat after itinerary loads
    document.getElementById("transport-section").style.display = "block";
    document.getElementById("chat-section").style.display = "block";
    document.getElementById("download-pdf").style.display = "inline-block";

  } catch (err) {
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

