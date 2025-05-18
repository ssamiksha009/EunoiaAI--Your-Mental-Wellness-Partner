document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const moodTrackerBtn = document.getElementById('mood-tracker-btn');
    const moodTracker = document.getElementById('mood-tracker');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsModal = document.getElementById('close-settings-modal');
    const saveSettings = document.getElementById('save-settings');
    const topicButtons = document.querySelectorAll('.topic-button');
    
    let conversationHistory = [];
    
    // System message for the mental health chatbot
    const systemMessage = {
        role: "system",
        content: `You are EunoiaAI, an empathetic mental health support chatbot. Your purpose is to provide emotional support, active listening, and evidence-based coping strategies to users. 

        Guidelines:
        - Be warm, empathetic, and non-judgmental at all times.
        - Practice active listening by reflecting back users' feelings and experiences.
        - Provide evidence-based suggestions from cognitive-behavioral therapy, mindfulness, and positive psychology.
        - Recognize the limits of AI support and encourage professional help when appropriate.
        - Never diagnose, but help users explore their feelings and develop coping strategies.
        - If users express serious risk of harm to themselves or others, provide crisis resources.
        - Use a conversational, supportive tone rather than clinical language.
        - Keep responses concise (2-4 paragraphs) and focused on the user's immediate concerns.
        - When appropriate, gently guide users toward positive perspectives and actionable steps.
        
        Emergency resources to share when needed:
        - Crisis Text Line: Text HOME to 741741
        - National Suicide Prevention Lifeline: 988
        - Emergency Services: 911 (US) or local emergency number`
    };
    
    // Initialize conversation with system message
    conversationHistory.push(systemMessage);
    
    // Enable/disable send button based on input
    userInput.addEventListener('input', function() {
        sendButton.disabled = userInput.value.trim() === '';
        
        // Auto-resize textarea
        userInput.style.height = 'auto';
        userInput.style.height = Math.min(userInput.scrollHeight, 100) + 'px';
    });
    
    // Send message on Enter (but allow Shift+Enter for new line)
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey && !sendButton.disabled) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Send button click
    sendButton.addEventListener('click', sendMessage);
    
    // Topic button click
    topicButtons.forEach(button => {
        button.addEventListener('click', function() {
            userInput.value = this.textContent;
            sendButton.disabled = false;
            sendMessage();
        });
    });
    
    // Mood tracker toggle
    moodTrackerBtn.addEventListener('click', function() {
        moodTracker.classList.toggle('active');
    });
    
    // Settings modal
    settingsBtn.addEventListener('click', function() {
        settingsModal.classList.add('active');
    });
    
    closeSettingsModal.addEventListener('click', function() {
        settingsModal.classList.remove('active');
    });
    
    saveSettings.addEventListener('click', function() {
        // Save settings to localStorage
        const conversationMode = document.getElementById('conversation-mode').value;
        const privacyEnabled = document.getElementById('privacy-toggle').checked;
        const toneSetting = document.getElementById('tone-slider').value;
        
        localStorage.setItem('conversation_mode', conversationMode);
        localStorage.setItem('privacy_enabled', privacyEnabled);
        localStorage.setItem('tone_setting', toneSetting);
        
        // Update system message based on conversation mode
        updateSystemMessage(conversationMode, toneSetting);
        
        settingsModal.classList.remove('active');
        showBotMessage("Your preferences have been updated. I'll adjust my responses accordingly.");
    });
    
    // Function to update system message based on settings
    function updateSystemMessage(mode, tone) {
        let systemContent = `You are EunoiaAI, an empathetic mental health support chatbot. `;
        
        // Adjust based on mode
        switch(mode) {
            case 'empathetic':
                systemContent += `Your primary focus is on active listening and emotional validation. `;
                break;
            case 'therapist':
                systemContent += `Your approach is based on cognitive-behavioral therapy techniques. Focus on helping users identify thought patterns and develop coping strategies. `;
                break;
            case 'coach':
                systemContent += `Your style is motivational and solution-focused. Encourage action steps and positive thinking. `;
                break;
            case 'friend':
                systemContent += `Your tone is casual and friendly, like a supportive friend. Be conversational while still providing valuable support. `;
                break;
        }
        
        // Adjust based on tone setting (1=gentle to 5=direct)
        if (tone <= 2) {
            systemContent += `Your communication style should be very gentle, nurturing, and patient. `;
        } else if (tone >= 4) {
            systemContent += `Your communication style should be more direct and straightforward, while still remaining supportive. `;
        }
        
        // Add common guidelines
        systemContent += `
        General guidelines:
        - Be non-judgmental at all times.
        - Recognize the limits of AI support and encourage professional help when appropriate.
        - Never diagnose, but help users explore their feelings.
        - If users express serious risk of harm, provide crisis resources immediately.
        - Keep responses concise (2-4 paragraphs) and focused on the user's concerns.
        
        Emergency resources:
        - Crisis Text Line: Text HOME to 741741
        - National Suicide Prevention Lifeline: 988
        - Emergency Services: 911 (US)`;
        
        // Update the conversation history with new system message
        conversationHistory[0].content = systemContent;
    }
    
    // Mood tracking
    const moodOptions = document.querySelectorAll('.mood-option');
    let selectedMood = null;
    
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            moodOptions.forEach(opt => opt.style.transform = 'scale(1)');
            this.style.transform = 'scale(1.1)';
            selectedMood = this.getAttribute('data-mood');
        });
    });
    
    document.querySelector('.mood-submit').addEventListener('click', function() {
        if (selectedMood) {
            const moodData = {
                mood: parseInt(selectedMood),
                timestamp: new Date().toISOString()
            };
            
            // Store mood data
            const moodHistory = JSON.parse(localStorage.getItem('mood_history') || '[]');
            moodHistory.push(moodData);
            localStorage.setItem('mood_history', JSON.stringify(moodHistory));
            
            moodTracker.classList.remove('active');
            showBotMessage(`Thanks for sharing how you're feeling. I've recorded your mood. Is there anything specific you'd like to talk about today?`);
            
            // Reset selection
            moodOptions.forEach(opt => opt.style.transform = 'scale(1)');
            selectedMood = null;
        }
    });
    
    // Function to send message
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to UI
        addMessage(message, 'user');
        
        // Clear input
        userInput.value = '';
        userInput.style.height = 'auto';
        sendButton.disabled = true;
        
        // Add to conversation history
        conversationHistory.push({
            role: "user",
            content: message
        });
        
        // Show typing indicator
        showTypingIndicator();
        
        // Call Gemini API via server
        fetchAIResponse();
    }
    
    // Function to add message to UI
    function addMessage(content, sender) {
        // Remove welcome message if present
        const welcomeMessage = document.querySelector('.chat-welcome');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        const messageEl = document.createElement('div');
        messageEl.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = `message-avatar ${sender}-avatar`;
        
        if (sender === 'bot') {
            avatar.innerHTML = '<i class="fas fa-brain"></i>';
        } else {
            avatar.innerHTML = '<i class="fas fa-user"></i>';
        }
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Format message with line breaks and links
        const formattedContent = formatMessage(content);
        messageContent.innerHTML = formattedContent;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        messageTime.textContent = `${hours}:${minutes}`;
        
        messageContent.appendChild(messageTime);
        messageEl.appendChild(avatar);
        messageEl.appendChild(messageContent);
        
        chatContainer.appendChild(messageEl);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Function to format message text (add links, line breaks)
    function formatMessage(text) {
        // Convert URLs to links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        let formattedText = text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
        
        // Convert line breaks to <br>
        formattedText = formattedText.replace(/\n/g, '<br>');
        
        return formattedText;
    }
    
    // Function to show bot message
    function showBotMessage(message) {
        addMessage(message, 'bot');
        
        // Add to conversation history
        conversationHistory.push({
            role: "assistant",
            content: message
        });
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const indicatorEl = document.createElement('div');
        indicatorEl.className = 'message bot-message';
        indicatorEl.id = 'typing-indicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar bot-avatar';
        avatar.innerHTML = '<i class="fas fa-brain"></i>';
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.style.display = 'flex';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingIndicator.appendChild(dot);
        }
        
        indicatorEl.appendChild(avatar);
        indicatorEl.appendChild(typingIndicator);
        
        chatContainer.appendChild(indicatorEl);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Function to call AI API through our Node.js server
async function fetchAIResponse() {
    try {
        console.log("Sending request to backend server...");
        const response = await fetch('https://your-render-url.onrender.com/api/chat', {  // Changed from 3000 to 3001
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: conversationHistory
            })
        });
        
        if (!response.ok) {
            console.error(`Server returned error: ${response.status} ${response.statusText}`);
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Received response:", data);
        
        if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error("Invalid response format:", data);
            throw new Error("Invalid response format from server");
        }
        
        const botResponse = data.choices[0].message.content;
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Display the response
        showBotMessage(botResponse);
        
    } catch (error) {
        console.error('API Error:', error);
        removeTypingIndicator();
        showBotMessage("I'm having trouble connecting to my brain. Please check your server connection or try again later.");
    }
}
    
    // Load settings from localStorage
    function loadSettings() {
        const conversationMode = localStorage.getItem('conversation_mode');
        const privacyEnabled = localStorage.getItem('privacy_enabled');
        const toneSetting = localStorage.getItem('tone_setting');
        
        if (conversationMode) {
            document.getElementById('conversation-mode').value = conversationMode;
        }
        
        if (privacyEnabled !== null) {
            document.getElementById('privacy-toggle').checked = privacyEnabled === 'true';
        }
        
        if (toneSetting) {
            document.getElementById('tone-slider').value = toneSetting;
        }
        
        // Update system message based on saved settings
        if (conversationMode && toneSetting) {
            updateSystemMessage(conversationMode, toneSetting);
        }
    }
    
    // Clear chat history on window close if privacy mode is enabled
    window.addEventListener('beforeunload', function() {
        const privacyEnabled = localStorage.getItem('privacy_enabled') === 'true';
        if (privacyEnabled) {
            // Only clear conversation history, not settings
            localStorage.removeItem('conversation_history');
        }
    });
    
    // Initialize
    loadSettings();
});
