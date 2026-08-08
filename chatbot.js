
const chatBox = document.getElementById('vvChatBox');
const chatMessages = document.getElementById('vvMessages');
const chatInput = document.getElementById('vvInput');

const answers = [
  {
    keys: ['use','usage','kaise','lene','lena','dosage','dose'],
    answer: 'Label ke mutabik: subah khali pet ½ teaspoon gungune pani ke saath. Shaam ko dinner se 30 minutes pehle ½ teaspoon gungune pani ke saath. Recommended usage se zyada na lein.'
  },
  {
    keys: ['price','cost','kitne','rate'],
    answer: 'Karela Jamun Powder 200g ka MRP ₹2,499 hai aur current website offer ₹1,499 hai.'
  },
  {
    keys: ['shipping','delivery','free'],
    answer: 'Free shipping available hai aur eligible locations par Cash on Delivery bhi available hai.'
  },
  {
    keys: ['return','replacement','damage','broken'],
    answer: 'Damaged, broken ya packaging/seal issue ke liye 7-day replacement request ki ja sakti hai. Clear photo/video WhatsApp ya email par bhejna hoga for verification.'
  },
  {
    keys: ['amazon'],
    answer: 'Aap product page ke “Buy on Amazon” button se Amazon listing open kar sakte hain.'
  },
  {
    keys: ['whatsapp','order'],
    answer: 'WhatsApp order ke liye +91 87962 57205 par message karein. Aap website ke WhatsApp button ka bhi use kar sakte hain.'
  }
];

function botReply(text){
  const t = text.toLowerCase();
  const found = answers.find(x => x.keys.some(k => t.includes(k)));
  return found ? found.answer :
    'Main product information, usage, price, shipping, replacement aur ordering ke basic questions me help kar sakta hoon. Specific health condition ke liye qualified healthcare professional se advice lein.';
}

function addMessage(text, who){
  const div = document.createElement('div');
  div.className = 'vv-msg ' + who;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendChat(){
  const value = chatInput.value.trim();
  if(!value) return;
  addMessage(value,'user');
  chatInput.value = '';
  setTimeout(() => addMessage(botReply(value),'bot'), 350);
}

document.querySelectorAll('[data-chat-open]').forEach(btn => {
  btn.addEventListener('click', () => {
    chatBox.classList.add('open');
    chatInput.focus();
  });
});
document.querySelectorAll('[data-chat-close]').forEach(btn => {
  btn.addEventListener('click', () => chatBox.classList.remove('open'));
});
document.getElementById('vvSend').addEventListener('click', sendChat);
chatInput.addEventListener('keydown', e => { if(e.key === 'Enter') sendChat(); });
