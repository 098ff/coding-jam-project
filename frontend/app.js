/**
 * AI Character Chat - Frontend Engine
 */

const App = (function () {
  'use strict';

  // ── STATE ──
  const state = {
    name: '',
    personality: '',
    forbidden: '',
    history: [], // Elements like {role: "user"|"model", text: "..."}
    isLoading: false,
    turnsCount: 0,
    maxTurns: 5,
    toastTimeout: null
  };

  // ── DOM REFS ──
  let creatorView, chatView;
  let creatorForm, charNameInput, charPersonalityInput, charForbiddenInput;
  let chatInputForm, chatMessageInput, chatMessagesContainer;
  let avatarIcon, displayCharName, displayCharStatus;
  let turnCounter, typingIndicator;
  let btnReset, btnResetBanner, limitBanner, btnSend;
  let errorToast, toastText, btnToastClose;

  // ── INIT ──
  function init() {
    // DOM bindings
    creatorView = document.getElementById('creator-view');
    chatView = document.getElementById('chat-view');
    
    creatorForm = document.getElementById('creator-form');
    charNameInput = document.getElementById('char-name');
    charPersonalityInput = document.getElementById('char-personality');
    charForbiddenInput = document.getElementById('char-forbidden');

    chatInputForm = document.getElementById('chat-input-form');
    chatMessageInput = document.getElementById('chat-message-input');
    chatMessagesContainer = document.getElementById('chat-messages');

    avatarIcon = document.getElementById('avatar-icon');
    displayCharName = document.getElementById('display-char-name');
    displayCharStatus = document.getElementById('display-char-status');

    turnCounter = document.getElementById('turn-counter');
    typingIndicator = document.getElementById('typing-indicator');

    btnReset = document.getElementById('btn-reset');
    btnResetBanner = document.getElementById('btn-reset-banner');
    limitBanner = document.getElementById('limit-banner');
    btnSend = document.getElementById('btn-send');

    errorToast = document.getElementById('error-toast');
    toastText = document.getElementById('toast-text');
    btnToastClose = document.getElementById('btn-toast-close');

    // Event listeners
    creatorForm.addEventListener('submit', onCreatorSubmit);
    chatInputForm.addEventListener('submit', onChatSubmit);
    btnReset.addEventListener('click', resetApp);
    btnResetBanner.addEventListener('click', resetApp);
    btnToastClose.addEventListener('click', hideToast);
  }

  // ── CREATOR TRANSITION ──
  async function onCreatorSubmit(e) {
    e.preventDefault();
    
    // Simple Validation
    const name = charNameInput.value.trim();
    const personality = charPersonalityInput.value.trim();
    const forbidden = charForbiddenInput.value.trim();

    let valid = true;
    
    if (!name) {
      showFieldError('error-name', 'Please provide a name.');
      valid = false;
    } else {
      clearFieldError('error-name');
    }

    if (!personality) {
      showFieldError('error-personality', 'Please describe the personality.');
      valid = false;
    } else {
      clearFieldError('error-personality');
    }

    if (!forbidden) {
      showFieldError('error-forbidden', 'Please specify a forbidden word.');
      valid = false;
    } else {
      clearFieldError('error-forbidden');
    }

    if (!valid) return;

    // Call API /init
    setLoading(true);
    try {
      const response = await fetch('/api/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, personality, forbidden })
      });

      if (!response.ok) {
        throw new Error('Failed to initialize character.');
      }

      // Set State
      state.name = name;
      state.personality = personality;
      state.forbidden = forbidden;
      state.history = [];
      state.turnsCount = 0;

      // Update Header
      displayCharName.textContent = name;
      avatarIcon.textContent = name.charAt(0);
      updateTurnCounter();

      // Clear Messages
      chatMessagesContainer.innerHTML = '';
      appendSystemMessage(`${name} has stepped onto the stage.`);

      // Switch View
      creatorView.classList.add('hidden');
      chatView.classList.remove('hidden');

      // Trigger first prompt message automatically
      await triggerGreeting();

    } catch (err) {
      showToast(err.message || 'Error communicating with server.');
    } finally {
      setLoading(false);
    }
  }

  // ── FIRST GREETING ──
  async function triggerGreeting() {
    setLoading(true);
    typingIndicator.classList.remove('hidden');
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.name,
          personality: state.personality,
          forbidden: state.forbidden,
          history: [],
          message: "Hello! Introduce yourself."
        })
      });

      if (!response.ok) {
        throw new Error('Greeting failed.');
      }

      const data = await response.json();
      appendMessage('model', data.text, data.boundary_tested);
      
    } catch (err) {
      appendSystemMessage('Failed to receive greeting. Send a message to start.');
    } finally {
      setLoading(false);
      typingIndicator.classList.add('hidden');
    }
  }

  // ── CHAT SUBMIT ──
  async function onChatSubmit(e) {
    e.preventDefault();
    if (state.isLoading || state.turnsCount >= state.maxTurns) return;

    const message = chatMessageInput.value.trim();
    if (!message) return;

    // Clear input
    chatMessageInput.value = '';
    chatMessageInput.disabled = true;
    btnSend.disabled = true;

    // Add message to chat list
    appendMessage('user', message, false);
    
    // Add to local history API payload
    const turnPayload = { role: 'user', text: message };
    
    setLoading(true);
    typingIndicator.classList.remove('hidden');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.name,
          personality: state.personality,
          forbidden: state.forbidden,
          history: state.history,
          message: message
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Network error occurred.');
      }

      const data = await response.json();
      
      // Update history state
      state.history.push(turnPayload);
      state.history.push({ role: 'model', text: data.text });
      
      state.turnsCount += 1;
      updateTurnCounter();

      appendMessage('model', data.text, data.boundary_tested);

      // Check max turns limit
      if (state.turnsCount >= state.maxTurns) {
        disableChatInput();
      }

    } catch (err) {
      showToast(err.message || 'Error occurred.');
      // Re-enable input so user can retry
      chatMessageInput.disabled = false;
      btnSend.disabled = false;
      chatMessageInput.value = message;
    } finally {
      setLoading(false);
      typingIndicator.classList.add('hidden');
      if (state.turnsCount < state.maxTurns) {
        chatMessageInput.disabled = false;
        btnSend.disabled = false;
        chatMessageInput.focus();
      }
    }
  }

  // ── RENDERING HELPERS ──
  function appendMessage(role, text, boundaryTested) {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${role}`;
    bubble.textContent = text;
    
    if (boundaryTested && role === 'model') {
      bubble.classList.add('boundary-glow');
    }
    
    chatMessagesContainer.appendChild(bubble);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  }

  function appendSystemMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble system';
    bubble.textContent = text;
    chatMessagesContainer.appendChild(bubble);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  }

  function updateTurnCounter() {
    turnCounter.textContent = `Turns: ${state.turnsCount} / ${state.maxTurns}`;
  }

  function disableChatInput() {
    chatInputForm.classList.add('hidden');
    limitBanner.classList.remove('hidden');
  }

  // ── RESET ──
  function resetApp() {
    // Reset forms
    charNameInput.value = '';
    charPersonalityInput.value = '';
    charForbiddenInput.value = '';
    chatMessageInput.value = '';

    // Reset controls
    chatInputForm.classList.remove('hidden');
    limitBanner.classList.add('hidden');
    chatMessageInput.disabled = false;
    btnSend.disabled = false;

    // View panels
    chatView.classList.add('hidden');
    creatorView.classList.remove('hidden');
    
    state.name = '';
    state.personality = '';
    state.forbidden = '';
    state.history = [];
    state.turnsCount = 0;
  }

  // ── UI UTILITIES ──
  function showFieldError(id, msg) {
    const element = document.getElementById(id);
    if (element) element.textContent = msg;
  }

  function clearFieldError(id) {
    const element = document.getElementById(id);
    if (element) element.textContent = '';
  }

  function setLoading(loading) {
    state.isLoading = loading;
  }

  function showToast(message) {
    if (state.toastTimeout) clearTimeout(state.toastTimeout);
    toastText.textContent = message;
    errorToast.classList.remove('hidden');
    state.toastTimeout = setTimeout(hideToast, 5000);
  }

  function hideToast() {
    errorToast.classList.add('hidden');
  }

  // DOMContentLoaded trigger
  document.addEventListener('DOMContentLoaded', init);

  return {
    init: init,
    reset: resetApp
  };
})();
