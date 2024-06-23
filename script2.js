const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "sk-proj-DgHnEH7mTRhXM0n2JLxuT3BlbkFJmH9ucx1WF01qR2mhLID2";
const inputHeight = chatInput.scrollHeight;
const createChatLi = (message, className) =>{
  // Create a chat <li> element with passed message and className
  const chatli = document.createElement("li");
  chatli.classList.add("chat", className);
  let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatli.innerHTML = chatContent;
  chatli.querySelector("p").textContent = message; 
  return chatli;
}

const generateResponse = (incomingChatLi)=>{
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatLi.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-16k",
      messages: [{role: "user",content: userMessage}]
    })
  }

  // Send POST request to API, get response
  fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
    // console.log(data);
    messageElement.textContent = data.choices[0].message.content;
  }).catch((error)=>{
    // console.log(error);
    messageElement.classList.add("error");
    messageElement.textContent = "Oops! Something wrong. Please try again.";
  }).finally(()=>chatbox.scrollTo(0, chatbox.scrollHeight));
}


const handleChat = ()=>{
  userMessage = chatInput.value.trim();
  // console.log(userMessage);
  if(!userMessage) return;
  chatInput.value = ""
  chatInput.style.height = `${inputHeight}px`;

  // Append the user's message to chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);


  setTimeout(()=>{
    // Display "Thinking..." message while waiting for response
    const incomingChatLi = createChatLi("Thinking...", "incoming")
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  },600)
}

chatInput.addEventListener("input", () => {
  // Adjust the height of the input textarea based on its content
  chatInput.style.height = `${inputHeight}px`
  chatInput.style.height = `${chatInput.scrollHeight}px`

});

chatInput.addEventListener("keydown", (e) => {
  // If Enter key is pressed without shift key and the window
  // width is greater than 800px, handle the chat
  if(e.key === "Enter" && !e.shiftkey && window.innerWidth > 800){
    e.preventDefault();
    handleChat();
  }

});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", ()=> document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", ()=> document.body.classList.toggle("show-chatbot"));
