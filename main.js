// ===============================
// VALUVEDA WELLNESS - MAIN.JS
// ===============================

document.addEventListener('DOMContentLoaded', () => {

  // =========================================
  // CONTACT DETAILS
  // =========================================

  const WHATSAPP = '8796257205';
  const PHONE = '8796257205';

  const whatsappMessage =
    'Hello ValuVeda Wellness, I want to know more about Karela Jamun Powder.';


  // =========================================
  // WHATSAPP BUTTONS
  // =========================================

  document.querySelectorAll('[data-whatsapp]').forEach((button) => {

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const url =
        'https://wa.me/91' +
        WHATSAPP +
        '?text=' +
        encodeURIComponent(whatsappMessage);

      window.location.href = url;
    });

  });


  // =========================================
  // CALL BUTTONS
  // =========================================

  document.querySelectorAll('[data-call]').forEach((button) => {

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      window.location.href = 'tel:+91' + PHONE;
    });

  });


  // =========================================
  // HERB DATA
  // =========================================

  const ingredients = [
    {
      name: 'Jamun',
      botanical: 'Syzygium cumini',
      role: 'Traditionally used in Ayurveda as part of general wellness routines.'
    },
    {
      name: 'Neem',
      botanical: 'Azadirachta indica',
      role: 'Traditionally used in Ayurveda as part of general wellness routines.'
    },
    {
      name: 'Tulsi',
      botanical: 'Ocimum tenuiflorum',
      role: 'Traditionally used in Ayurveda for general wellness.'
    },
    {
      name: 'Ashwagandha',
      botanical: 'Withania somnifera',
      role: 'Traditionally used in Ayurveda for general wellness.'
    },
    {
      name: 'Bael',
      botanical: 'Aegle marmelos',
      role: 'Traditionally used in Ayurveda as a traditional botanical.'
    },
    {
      name: 'Vijaysar',
      botanical: 'Pterocarpus marsupium',
      role: 'Traditionally used in Ayurveda as a botanical ingredient.'
    },
    {
      name: 'Shatavari',
      botanical: 'Asparagus racemosus',
      role: 'Traditionally used in Ayurveda for general wellness.'
    },
    {
      name: 'Methi',
      botanical: 'Trigonella foenum-graecum',
      role: 'Traditionally used as a traditional botanical ingredient.'
    },
    {
      name: 'Saunf',
      botanical: 'Foeniculum vulgare',
      role: 'Traditionally used in traditional wellness routines.'
    },
    {
      name: 'Gudmar',
      botanical: 'Gymnema sylvestre',
      role: 'Traditionally used in Ayurveda as a traditional botanical.'
    },
    {
      name: 'Harsingar',
      botanical: 'Nyctanthes arbor-tristis',
      role: 'Traditionally used as a traditional botanical ingredient.'
    },
    {
      name: 'Karela',
      botanical: 'Momordica charantia',
      role: 'Traditionally used in Ayurveda as part of traditional wellness routines.'
    },
    {
      name: 'Manjistha',
      botanical: 'Rubia cordifolia',
      role: 'Traditionally used in Ayurveda as a traditional botanical.'
    },
    {
      name: 'Chirata',
      botanical: 'Swertia',
      role: 'Traditionally used as a traditional botanical ingredient.'
    },
    {
      name: 'Dalchini',
      botanical: 'Cinnamomum verum',
      role: 'Traditionally used in traditional wellness routines.'
    }
  ];


  // =========================================
  // HERB GRID
  // =========================================

  const herbGrid = document.getElementById('herbGrid');

  if (herbGrid) {

    herbGrid.innerHTML = ingredients.map((item, index) => `
      <button
        type="button"
        class="herb-card"
        data-herb="${index}"
      >
        <b>${item.name}</b>
        <small>${item.botanical}</small>
        <span>${item.role}</span>
      </button>
    `).join('');

  }


  // =========================================
  // HERB MODAL
  // =========================================

  const modal = document.getElementById('herbModal');
  const modalName = document.getElementById('modalName');
  const modalBotanical = document.getElementById('modalBotanical');
  const modalRole = document.getElementById('modalRole');
  const modalClose = modal
    ? modal.querySelector('.close')
    : null;


  if (herbGrid && modal) {

    herbGrid.querySelectorAll('[data-herb]').forEach((button) => {

      button.addEventListener('click', () => {

        const index = Number(button.dataset.herb);
        const item = ingredients[index];

        if (!item) return;

        if (modalName) {
          modalName.textContent = item.name;
        }

        if (modalBotanical) {
          modalBotanical.textContent = item.botanical;
        }

        if (modalRole) {
          modalRole.textContent = item.role;
        }

        modal.classList.add('open');

      });

    });

  }


  // Close modal
  if (modalClose && modal) {

    modalClose.addEventListener('click', () => {
      modal.classList.remove('open');
    });

  }


  // Click outside modal
  if (modal) {

    modal.addEventListener('click', (event) => {

      if (event.target === modal) {
        modal.classList.remove('open');
      }

    });

  }


  // =========================================
  // MOBILE MENU / 3 DOT MENU
  // =========================================

  const menuButton = document.querySelector('.menu');
  const nav = document.querySelector('nav');

  if (menuButton && nav) {

    menuButton.addEventListener('click', (event) => {

      event.preventDefault();
      event.stopPropagation();

      nav.classList.toggle('mobile-open');

    });

  }


  // Close mobile menu after clicking nav link
  if (nav) {

    nav.querySelectorAll('a').forEach((link) => {

      link.addEventListener('click', () => {
        nav.classList.remove('mobile-open');
      });

    });

  }


  // =========================================
  // YEAR
  // =========================================

  const yearElement = document.getElementById('year');

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  // =========================================
  // ADD TO CART
  // =========================================

  const addToCart = document.getElementById('addToCart');

  if (addToCart) {

    addToCart.addEventListener('click', (event) => {

      event.preventDefault();
      event.stopPropagation();

      // Order page
      window.location.href = 'index.html#orderForm';

    });

  }


  // =========================================
  // SUPABASE
  // =========================================

  const SUPABASE_URL =
    'https://szsxzrxcsavthipevdqu.supabase.co';

  const SUPABASE_KEY =
    'sb_publishable_UqD2K5680lBPVNdvk61agw_Wn9cp7fz';


  // =========================================
  // SUPABASE CONNECTION TEST
  // =========================================

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

        const errorText = await response.text();

        console.error(
          'Supabase connection error:',
          errorText
        );

      }

    } catch (error) {

      console.error(
        'Supabase error:',
        error
      );

    }

  }


  // Connection test should NEVER stop other website buttons
  testSupabaseConnection();


  // =========================================
  // ORDER FORM
  // =========================================

  const orderForm = document.getElementById('orderForm');

  if (orderForm) {

    orderForm.addEventListener('submit', async (event) => {

      event.preventDefault();
