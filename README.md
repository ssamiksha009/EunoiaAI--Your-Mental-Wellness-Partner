# EunoiaAI: Mental Health Chatbot

A beautiful, empathetic mental health chatbot powered by OpenAI's GPT-4. This application provides a supportive conversation interface, mood tracking, and mental health resources in an elegant and user-friendly design.

![EunoiaAI Preview](https://placeholder-image.com/eunoiaai-preview.png)

## Features

- **Intelligent Conversations**: Leverages OpenAI's GPT-4 for empathetic, helpful responses
- **Beautiful UI**: Clean, modern interface with animations and responsive design
- **Mood Tracking**: Log and monitor emotional states over time
- **Customizable Experience**: Adjust conversation style, tone, and privacy settings
- **Mental Health Resources**: Quick access to crisis information and self-help resources
- **Mobile-Friendly**: Fully responsive design works on all devices

## Getting Started

### Prerequisites

- OpenAI API key ([Get one here](https://platform.openai.com/))
- Web browser with JavaScript enabled
- Basic understanding of HTML, CSS, and JavaScript (for customization)

### Installation

1. Clone this repository or download the files:
   ```
   git clone https://github.com/yourusername/eunoiaai-chatbot.git
   ```

2. Open the project in VS Code or your preferred editor

3. Launch the application:
   - Using VS Code's Live Server extension
   - Or with Python's built-in HTTP server:
     ```
     python -m http.server
     ```

4. Access the application at `http://localhost:8000` (or the port specified by your server)

5. Enter your OpenAI API key when prompted

### File Structure

```
mental-health-chatbot/
├── index.html          # Main HTML file with the application
├── css/
│   └── styles.css      # CSS styles for the application
├── js/
│   └── script.js       # JavaScript functionality
├── assets/
│   ├── images/         # For any images or icons
│   │   └── favicon.ico # Browser tab icon
│   └── fonts/          # Custom fonts (if needed)
└── README.md           # Project documentation
```

## Configuration Options

### Customizing the AI Behavior

To modify how the AI responds, edit the `systemMessage` variable in `script.js`. This controls the personality, tone, and guidelines the AI follows.

### Styling and Appearance

The application uses CSS variables for easy styling. Modify the `:root` variables in `styles.css` to change colors, fonts, and other visual elements.

### Adding Features

The modular structure makes it easy to add new features:
- Add new UI components to `index.html`
- Style them in `styles.css`
- Implement functionality in `script.js`

## Important Security Notes

### API Key Security

This implementation stores your OpenAI API key in localStorage for convenience, which is suitable for personal use or development. For production deployment:

1. Consider implementing a backend service that securely handles API calls
2. Use environment variables for sensitive information
3. Implement proper authentication if deploying publicly

### Data Privacy

Mental health data is sensitive. Consider these best practices:

1. Implement secure data storage if saving conversations
2. Use HTTPS for all data transmission
3. Provide clear privacy policy explaining data handling
4. Consider HIPAA/GDPR compliance for commercial applications

## Deployment Options

### Local Development Server

For development and testing, use:
- VS Code's Live Server extension
- Python's built-in HTTP server
- Node.js http-server package

### Web Hosting

For deploying to the web:
1. Static hosting services:
   - GitHub Pages
   - Netlify
   - Vercel
   - Firebase Hosting

2. For adding backend functionality:
   - Heroku
   - AWS Amplify
   - Google Cloud Platform
   - Azure

## Usage Guidelines

### Ethical Considerations

This chatbot is designed as a supportive tool, not a replacement for professional mental health services:

1. Add clear disclaimers about the limitations of AI assistance
2. Provide resources for professional help
3. Include crisis information prominently
4. Consider implementing critical keyword detection for crisis situations

### User Consent

Ensure users understand:
1. How their data is used and stored
2. The limitations of AI assistance
3. That they're interacting with an AI, not a human professional

## Customization Ideas

### Advanced Features

- User accounts for saving conversation history
- Data visualization for mood tracking
- Guided meditation or breathing exercises
- Journal feature for self-reflection
- Integration with professional telehealth services

### UI Enhancements

- Dark/light mode toggle
- Custom theme options
- Accessibility features
- Voice input/output options
- Animations and transitions

## Troubleshooting

### Common Issues

- **API key errors**: Verify your OpenAI API key is correct and has sufficient credits
- **CORS issues**: When testing locally, you may need a CORS proxy or browser extension
- **Performance**: Large conversation histories can slow down responses, consider implementing pagination

### Support

For issues with:
- OpenAI API: Check [OpenAI documentation](https://platform.openai.com/docs/)
- Code implementation: Review comments in the source code or create an issue in this repository

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is not a substitute for professional mental health services. In case of emergency, contact your local emergency services or mental health crisis hotline.

## Acknowledgments

- OpenAI for the GPT-4 API
- Font Awesome for icons