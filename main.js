// ================= BASIC SETTINGS =================

const WHATSAPP = '918796257205';
const PHONE = '918796257205';
const ingredients = [
  {
    name: "Jamun",
    botanical: "Syzygium cumini",
    role: "Traditionally used in Ayurveda as part of general wellness practices."
  },
  {
    name: "Neem",
    botanical: "Azadirachta indica",
    role: "Traditionally used in Ayurveda for general wellness."
  },
  {
    name: "Tulsi",
    botanical: "Ocimum tenuiflorum",
    role: "Traditionally used in Ayurveda as a wellness herb."
  },
  {
    name: "Ashwagandha",
    botanical: "Withania somnifera",
    role: "Traditionally used in Ayurveda for general wellness."
  }
];


// ================= WHATSAPP BUTTON =================

document.querySelectorAll('[data-whatsapp]').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();

    const msg =
      'Hello ValuVeda Wellness, I want to know more about Karela Jamun Powder.';

    window.location.href =
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  });
});


// ================= CALL BUTTON =================

document.querySelectorAll('[data-call]').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();

    window.location.href = `tel:+${PHONE}`;
  });
});


// ================= INGREDIENTS / 3 DOT MODAL =================

const grid = document.getElementById('herbGrid');

if (grid) {
  grid.innerHTML = ingredients.map((item, index) => `
    <button class="herb-card" data-herb="${index}">
      <b>${item.name}</b>
      <small>${item.botanical}</small>
      <span>${item.role}</span>
    </button>
  `).join('');
}


const modal = document.getElementById('herbModal');

function closeHerbModal() {
  if (modal) {
    modal.classList.remove('open');
  }
}


// Close button
document.querySelectorAll('.close').forEach((btn) => {
  btn.addEventListener('click', closeHerbModal);
});


// Ingredient buttons
document.querySelectorAll('[data-herb]').forEach((btn) => {
  btn.addEventListener('click', function () {

    const index = Number(this.dataset.herb);
    const item = ingredients[index];

    if (!item) return;

    const name = document.getElementById('modalBotanical');
    const botanical = document.getElementById('modalRole');
    const use = document.getElementById('modalUse');

    if (name) name.textContent = item.name;
    if (botanical) botanical.textContent = item.botanical;

    if (use) {
      use.textContent =
        'This is a traditional/general-wellness description, not a medical diagnosis or treatment claim.';
    }

    if (modal) {
      modal.classList.add('open');
    }
  });
});


// Close modal when clicking outside
if (modal) {
  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      closeHerbModal();
    }
  });
}


// ================= MOBILE MENU =================

const menuButton = document.querySelector('.menu');
const nav = document.querySelector('nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', function (e) {
    e.preventDefault();
    nav.classList.toggle('mobile-open');
  });
}


// ================= ADD TO CART =================

const addToCart = document.getElementById('addToCart');

if (addToCart) {
  addToCart.addEventListener('click', function (e) {
    e.preventDefault();

    window.location.href = 'index.html#orderForm';
  });
}


// ================= SUPABASE =================

// ⚠️ IN DONO LINES ME APNI EXISTING VALUES HI RAKHNA

const SUPABASE_URL = 'YOUR_EXISTING_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_EXISTING_SUPABASE_KEY';


// ================= SUPABASE CONNECTION TEST =================

async function testSupabaseConnection() {

  try {

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/Orders?select=id&limit=1`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (response.ok) {
      console.log('Supabase connected successfully.');
    } else {
      console.error(
        'Supabase connection error:',
        await response.text()
      );
    }

  } catch (error) {

    console.error('Supabase error:', error);

  }
}

testSupabaseConnection();


// ================= SAVE CUSTOMER ORDER =================

const orderForm = document.getElementById('orderForm');

if (orderForm) {

  orderForm.addEventListener('submit', async function (e) {

    e.preventDefault();

    const orderMessage =
      document.getElementById('orderMessage');

    const customerName =
      document.getElementById('customerName')?.value.trim() || '';

    const phone =
      document.getElementById('phone')?.value.trim() || '';

    const address =
      document.getElementById('address')?.value.trim() || '';

    const city =
      document.getElementById('city')?.value.trim() || '';

    const state =
      document.getElementById('state')?.value.trim() || '';

    const pincode =
      document.getElementById('pincode')?.value.trim() || '';

    const quantity =
      Number(document.getElementById('quantity')?.value || 1);

    const paymentMethod =
      document.getElementById('payment')?.value || 'COD';


    if (orderMessage) {
      orderMessage.textContent =
        '⏳ Order save ho raha hai...';
    }


    try {

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/Orders`,
        {
          method: 'POST',

          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },

          body: JSON.stringify({

            customer_name: customerName,
            phone: phone,
            address: address,
            city: city,
            state: state,
            pincode: pincode,
            quantity: quantity,

            payment_method: paymentMethod,

            product:
              'ValuVeda Karela Jamun Powder 200g',

            payment_status:
              paymentMethod === 'COD'
                ? 'pending'
                : 'pending',

            order_status:
              'pending'
          })
        }
      );


      const resultText = await response.text();


      if (!response.ok) {

        console.error(
          'Supabase order error:',
          resultText
        );

        throw new Error(resultText);

      }


      console.log('Order saved successfully:', resultText);


      if (orderMessage) {

        orderMessage.textContent =
          '✅ Order successfully place ho gaya! Aapka order receive ho gaya hai.';

      }


      orderForm.reset();


    } catch (error) {

      console.error(
        'Order save error:',
        error
      );


      if (orderMessage) {

        orderMessage.textContent =
          '❌ Order save nahi hua. Please dobara try karein.';

      }

    }

  });

}
