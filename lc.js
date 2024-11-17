const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null;
const inputInitHeight = chatInput.scrollHeight;

// Function to speak a message
const speakMessage = (message) => {
  const speech = new SpeechSynthesisUtterance(message);
  speechSynthesis.speak(speech);
};


const fetchEdamamResponse = async (message) => {
    try {
      const appId = "YourID"; 
      const appKey = "YourKey";
      const url = `https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${appKey}&ingr=${encodeURIComponent(message)}`;
      const response = await fetch(url);
  
      if (response.status === 200) {
        const data = await response.json();
        return data;
      } else if (response.status === 304) {
        return "Not Modified";
      } else if (response.status === 404) {
        throw new Error("Not Found - The specified URL was not found or couldn't be retrieved");
      } else if (response.status === 409) {
        throw new Error("The provided ETag token does not match the input data");
      } else if (response.status === 422) {
        throw new Error("Unprocessable Entity - Couldn't parse the recipe or extract the nutritional info");
      } else if (response.status === 555) {
        throw new Error("Recipe with insufficient quality to process correctly");
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching response from Edamam API:', error);
      return "I'm sorry, I couldn't process your request at the moment.";
    }
  };
  
const generateResponse = async (userMessage) => {
    try {
      const response = await fetchEdamamResponse(userMessage);
  
      console.log('Edamam API response:', response);
  
      if (!response || response.calories === undefined || response.totalNutrientsKCal === undefined || Object.keys(response.totalNutrientsKCal).length === 0) {
        throw new Error('Invalid response format: Missing or incomplete nutrition data');
      }
  
      console.log('Total Nutrients KCal:', response.totalNutrientsKCal);
  
      const calories = response.calories;
      const protein = response.totalNutrientsKCal.PROCNT_KCAL.quantity; 
      const fat = response.totalNutrientsKCal.FAT_KCAL.quantity; 
      const carbs = response.totalNutrientsKCal.CHOCDF_KCAL.quantity; 
  
      const botResponse = `Here is the nutrition information for ${userMessage}: Calories: ${calories}, Protein: ${protein}g, Fat: ${fat}g, Carbohydrates: ${carbs}g`;
    
      speakMessage(botResponse);
      return botResponse;
    } catch (error) {
      console.error('Error generating response:', error);
      return "I'm sorry, I couldn't process your request at the moment.";
    }
  };

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);
  let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const handleChat = async () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  try {
    const botResponse = await generateResponse(userMessage);
    const incomingChatLi = createChatLi(botResponse, "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
  } catch (error) {
    console.error('Error handling chat:', error);
  }
};

sendChatBtn.addEventListener("click", handleChat);
chatInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    await handleChat();
  }
});

closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
