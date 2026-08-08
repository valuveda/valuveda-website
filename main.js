const WHATSAPP='918796257205';
const PHONE='918796257205';
const ingredients=[
['Karela','Momordica charantia L.','Traditionally used as a bitter Ayurvedic botanical in metabolic and digestive wellness formulations.'],
['Jamun','Syzygium cumini','Traditionally used in Ayurvedic wellness practices associated with metabolic and digestive support.'],
['Neem','Azadirachta indica','Traditionally valued in Ayurveda for its bitter botanical profile and everyday wellness use.'],
['Tulsi','Ocimum tenuiflorum','Traditionally used in Ayurveda for general wellness and respiratory support.'],
['Ashwagandha','Withania somnifera','Traditionally used as a rejuvenating Ayurvedic herb for general vitality and wellness.'],
['Bael','Aegle marmelos','Traditionally used in Ayurvedic preparations for digestive wellness.'],
['Vijaysar','Pterocarpus marsupium','A traditional Ayurvedic botanical often used in formulations focused on metabolic wellness.'],
['Shatavari','Asparagus racemosus','Traditionally used as a nourishing Ayurvedic herb for general wellness.'],
['Methi','Trigonella foenum-graecum','Traditionally used in food and Ayurveda for digestive and metabolic wellness.'],
['Saunf','Foeniculum vulgare','Traditionally used to support comfortable digestion and as an aromatic herb.'],
['Gudmar','Gymnema sylvestre','A well-known Ayurvedic botanical traditionally associated with metabolic and sugar-management wellness.'],
['Harsingar','Nyctanthes arbor-tristis','Traditionally used in Ayurveda as a botanical ingredient for general wellness.'],
['Manjistha','Rubia cordifolia','Traditionally valued in Ayurveda as a cleansing and skin-supportive botanical.'],
['Chirata','Swertia chirata','A bitter Ayurvedic botanical traditionally used in digestive and general wellness preparations.'],
['Dalchini','Cinnamomum verum','Traditionally used as an aromatic spice and Ayurvedic botanical for digestive wellness.']
];

document.querySelectorAll('[data-whatsapp]').forEach(a=>{const msg=encodeURIComponent('Hello ValuVeda Wellness, I want to order Karela Jamun Powder 200g.');a.href=`https://wa.me/${WHATSAPP}?text=${msg}`;});
document.querySelectorAll('[data-call]').forEach(a=>a.href=`tel:+${PHONE}`);
const grid=document.getElementById('herbGrid');
if(grid){grid.innerHTML=ingredients.map((x,i)=>{const slug=x[0].toLowerCase().replace(' ','-');return `<article class="herb-card"><img src="assets/ingredient-${slug}.jpg" alt="${x[0]} ingredient"><div><b>${x[0]}</b><small>${x[1]}</small><span>${x[2]}</span></div></article>`;}).join('');}
document.getElementById('year')?.replaceChildren(document.createTextNode(new Date().getFullYear()));
const menu=document.querySelector('.menu');menu?.addEventListener('click',()=>document.querySelector('.nav')?.classList.toggle('mobile-open'));
const showOrder=document.getElementById('showOrder');showOrder?.addEventListener('click',()=>{const p=document.getElementById('orderPanel');if(p){document.getElementById('formQty').value=document.getElementById('qty').value||1;p.classList.add('visible');p.scrollIntoView({behavior:'smooth',block:'start'});}});
