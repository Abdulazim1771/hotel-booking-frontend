const get = (id) => document.getElementById(id);
const day = 86_400_000;
const currentDate = new Date();
const today = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
const toISO = (date) => new Date(date).toISOString().slice(0, 10);
const demoCheckIn = toISO(today + 7 * day);
const demoCheckOut = toISO(today + 9 * day);
const dateLabel = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const formatDate = (date) => dateLabel.format(new Date(date));
const formatPrice = (amount) => money.format(amount);
const partyLabel = (guests) => `${guests} ${guests === 1 ? 'guest' : 'guests'}`;

const rooms = [
  { id: 'standard', name: 'Standard', maxGuests: 2, bed: 'Queen bed', capacity: 4, rate: 125, image: 'standard.jpg', alt: 'Queen bed with white linens and two bedside lamps', description: 'A quiet retreat with soft linens and everything you need to settle in.' },
  { id: 'deluxe', name: 'Deluxe', maxGuests: 3, bed: 'King bed', capacity: 2, rate: 165, image: 'deluxe.jpg', alt: 'King bed, oak paneling, and floor-to-ceiling curtains', description: 'Extra space to slow down, with a king bed and a spot to read.' },
  { id: 'suite', name: 'Suite', maxGuests: 4, bed: 'King bed + sofa bed', capacity: 1, rate: 245, image: 'suite.jpg', alt: 'Suite lounge with a linen sofa and wide city-facing windows', description: 'A separate lounge and generous space for a longer stay.' },
];

const reservations = [
  { id: 'STL-1001', room: rooms[0], guest: 'Alex Rivera', checkIn: demoCheckIn, checkOut: demoCheckOut, guests: 2, total: 250, status: 'Confirmed' },
  { id: 'STL-1002', room: rooms[1], guest: 'Sam Chen', checkIn: demoCheckIn, checkOut: demoCheckOut, guests: 2, total: 330, status: 'Confirmed' },
];

let stay = { checkIn: demoCheckIn, checkOut: demoCheckOut, guests: 2, nights: 2 };
let searched = false;
let signedIn = false;
let pendingRoom;
let cancellation;

const dialog = get('booking-dialog');
const checkIn = get('check-in');
const checkOut = get('check-out');
const arrivalDate = get('arrival-date');
checkIn.min = toISO(today);
checkIn.max = toISO(today + 179 * day);
checkIn.value = demoCheckIn;
checkOut.min = toISO(today + 8 * day);
checkOut.max = toISO(today + 180 * day);
checkOut.value = demoCheckOut;
arrivalDate.value = demoCheckIn;

function showScreen(screen) {
  get('stay').hidden = !['stay', 'rooms'].includes(screen);
  get('bookings').hidden = screen !== 'bookings';
  get('staff').hidden = screen !== 'staff';
  const viewSwitch = document.querySelector('.view-switch');
  viewSwitch.dataset.screen = screen === 'staff' ? 'stay' : 'staff';
  viewSwitch.firstChild.textContent = screen === 'staff' ? 'Guest view ' : 'Staff view ';

  document.querySelectorAll('.main-nav button').forEach((button) => {
    if (button.dataset.screen === screen) {
      button.setAttribute('aria-current', screen === 'rooms' ? 'location' : 'page');
    } else {
      button.removeAttribute('aria-current');
    }
  });

  if (screen === 'bookings') renderBookings();
  if (screen === 'staff') renderArrivals();
  const title = get(screen === 'stay' ? 'hero-title' : `${screen}-title`);
  title.focus({ preventScroll: true });
  if (screen === 'rooms') get('rooms').scrollIntoView({ block: 'start' });
  else window.scrollTo(0, 0);
}

function roomIsAvailable(room) {
  for (let night = Date.parse(stay.checkIn); night < Date.parse(stay.checkOut); night += day) {
    const date = toISO(night);
    const reserved = reservations.filter((booking) =>
      booking.room.id === room.id && booking.status === 'Confirmed' &&
      booking.checkIn <= date && date < booking.checkOut
    ).length;
    if (reserved >= room.capacity) return false;
  }
  return true;
}

function renderRooms() {
  const matching = searched ? rooms.filter((room) => room.maxGuests >= stay.guests) : rooms;
  const availableCount = matching.filter(roomIsAvailable).length;

  get('availability-summary').textContent = searched
    ? `${availableCount} available · ${formatDate(stay.checkIn)} to ${formatDate(stay.checkOut)} · ${partyLabel(stay.guests)}`
    : 'Three ways to stay. Pay at the hotel.';

  get('room-grid').innerHTML = matching.map((room) => {
    const available = roomIsAvailable(room);
    const price = searched ? room.rate * stay.nights : room.rate;
    const priceLabel = searched ? `Total for ${stay.nights} ${stay.nights === 1 ? 'night' : 'nights'}` : 'Per night';
    return `
      <article class="room-card">
        <div class="room-image">
          <img src="assets/${room.image}" alt="${room.alt}">
          <span class="room-index" aria-hidden="true">0${rooms.indexOf(room) + 1}</span>
        </div>
        <div class="room-body">
          <h3>${room.name}</h3>
          <p class="room-meta">Up to ${partyLabel(room.maxGuests)} · ${room.bed}</p>
          <p class="room-description">${room.description}</p>
          <div class="room-action">
            <p>${formatPrice(price)} <small>${priceLabel}</small></p>
            <button class="button button-outline" type="button" data-room="${room.id}"
              aria-label="${available ? `Select ${room.name}` : `${room.name} is sold out`}" ${available ? '' : 'disabled'}>
              ${available ? 'Select room <span aria-hidden="true">↗</span>' : 'Sold out'}
            </button>
          </div>
        </div>
      </article>`;
  }).join('') + (availableCount === 0
    ? '<div class="empty"><h3>No rooms for these dates</h3><p>Try changing your dates or the number of guests.</p></div>'
    : '');
}

function updateStay() {
  const invalidField = [checkIn, checkOut].find((field) => !field.validity.valid);
  if (invalidField) {
    let message = invalidField === checkIn ? 'Choose a check-in date within the booking window.' : 'Choose a checkout date within the booking window.';
    if (invalidField === checkOut && checkOut.validity.rangeUnderflow) {
      message = 'Choose a checkout date after check-in.';
    }
    get('date-error').textContent = message;
    get('date-error').hidden = false;
    invalidField.setAttribute('aria-describedby', 'date-error');
    invalidField.setAttribute('aria-invalid', 'true');
    invalidField.focus();
    return false;
  }
  const nights = (checkOut.valueAsNumber - checkIn.valueAsNumber) / day;
  stay = { checkIn: checkIn.value, checkOut: checkOut.value, guests: Number(get('guests').value), nights };
  return true;
}

function showDialog(step, title, content) {
  get('dialog-content').innerHTML = `
    <button type="button" class="dialog-close" aria-label="Close dialog" data-dialog="close">×</button>
    <div class="dialog-header">
      <p class="eyebrow hero-kicker"><span></span> ${step}</p>
      <h2 id="dialog-title" tabindex="-1">${title}</h2>
    </div>
    <div class="dialog-body">${content}</div>`;
  if (!dialog.open) dialog.showModal();
  get('dialog-title').focus();
}

function showReview() {
  const total = pendingRoom.rate * stay.nights;
  showDialog('Review your stay', pendingRoom.name, `
    <dl class="summary-grid">
      <div><dt>Check-in</dt><dd>${formatDate(stay.checkIn)}</dd></div>
      <div><dt>Check-out</dt><dd>${formatDate(stay.checkOut)}</dd></div>
      <div><dt>Guests</dt><dd>${partyLabel(stay.guests)}</dd></div>
      <div><dt>Nightly rate</dt><dd>${formatPrice(pendingRoom.rate)}</dd></div>
    </dl>
    <div class="booking-total"><span>Total for ${stay.nights} ${stay.nights === 1 ? 'night' : 'nights'}</span><strong>${formatPrice(total)}</strong></div>
    <p class="dialog-note">Pay at the hotel. Cancel before check-in day.</p>
    <button class="button button-primary" type="button" data-dialog="confirm">Confirm booking <span aria-hidden="true">↗</span></button>`);
}

function chooseRoom(room) {
  if (!updateStay()) return;
  if (room.maxGuests < stay.guests || !roomIsAvailable(room)) {
    searched = true;
    renderRooms();
    showScreen('rooms');
    return;
  }
  pendingRoom = room;
  if (signedIn) showReview();
  else showDialog('Guest sign-in', 'Sign in to continue', `
    <p>Your room and dates are saved while you sign in.</p>
    <p class="dialog-note">Use the demo guest account to preview checkout.</p>
    <button class="button button-primary" type="button" data-dialog="sign-in">Continue as demo guest <span aria-hidden="true">↗</span></button>`);
}

function confirmReservation() {
  if (!roomIsAvailable(pendingRoom)) {
    searched = true;
    renderRooms();
    showDialog('Availability changed', 'That room is sold out', `
      <p>Try a different room or change your travel dates.</p>
      <button class="button button-primary" type="button" data-dialog="rooms">Back to rooms</button>`);
    return;
  }
  const id = `STL-${1001 + reservations.length}`;
  reservations.push({ id, room: pendingRoom, guest: 'Demo guest', owner: true, ...stay, total: pendingRoom.rate * stay.nights, status: 'Confirmed' });
  renderRooms();
  showDialog('Booking confirmed', 'See you at STILL.', `
    <p>Your booking reference is <strong>${id}</strong>.</p>
    <p>${pendingRoom.name} · ${formatDate(stay.checkIn)} to ${formatDate(stay.checkOut)} · ${partyLabel(stay.guests)}</p>
    <p class="dialog-note">Your total is ${formatPrice(pendingRoom.rate * stay.nights)}, payable at the hotel.</p>
    <button class="button button-primary" type="button" data-dialog="bookings">View my bookings <span aria-hidden="true">↗</span></button>`);
}

function renderBookings() {
  const mine = reservations.filter((booking) => booking.owner);
  get('booking-list').innerHTML = mine.length ? mine.map((booking) => `
    <article class="reservation">
      <div>
        <span class="badge ${booking.status === 'Confirmed' ? 'badge-confirmed' : ''}">${booking.status}</span>
        <h2>${booking.room.name} · ${booking.id}</h2>
        <p>${formatDate(booking.checkIn)} to ${formatDate(booking.checkOut)} · ${partyLabel(booking.guests)} · ${formatPrice(booking.total)}</p>
      </div>
      ${booking.status === 'Confirmed' && booking.checkIn > toISO(today)
        ? `<button class="button button-outline" type="button" data-cancel="${booking.id}">Cancel booking</button>` : ''}
    </article>`).join('')
    : '<div class="empty"><h2>No bookings yet</h2><p>Your confirmed stays will appear here.</p></div>';
}

function renderArrivals() {
  const arrivals = reservations.filter((booking) => booking.status === 'Confirmed' && booking.checkIn === arrivalDate.value);
  get('arrival-list').innerHTML = arrivals.length ? `
    <div class="table-wrap" tabindex="0" aria-label="Confirmed arrivals table">
      <table aria-labelledby="arrivals-title">
        <thead><tr><th scope="col">Guest</th><th scope="col">Room type</th><th scope="col">Guests</th><th scope="col">Reference</th></tr></thead>
        <tbody>${arrivals.map((booking) => `<tr><td>${booking.guest}</td><td>${booking.room.name}</td><td>${booking.guests}</td><td>${booking.id}</td></tr>`).join('')}</tbody>
      </table>
    </div>` : '<div class="empty"><h3>No confirmed arrivals</h3><p>Choose a different arrival date.</p></div>';
}

function showStaffPanel(panel) {
  get('arrivals').hidden = panel !== 'arrivals';
  get('rates').hidden = panel !== 'rates';
  document.querySelectorAll('[data-staff]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.staff === panel));
  });
}

get('rate-fields').innerHTML = rooms.map((room) => `
  <label>${room.name} <span class="room-meta">USD per night</span>
    <input id="rate-${room.id}" type="number" min="1" max="9999" step="1" value="${room.rate}" required>
  </label>`).join('');

get('availability').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!updateStay()) return;
  searched = true;
  renderRooms();
  showScreen('rooms');
});

get('availability').addEventListener('input', () => {
  get('date-error').hidden = true;
  for (const field of [checkIn, checkOut]) {
    field.removeAttribute('aria-describedby');
    field.removeAttribute('aria-invalid');
  }
  checkOut.min = checkIn.validity.valid ? toISO(checkIn.valueAsNumber + day) : toISO(today + day);
});

arrivalDate.addEventListener('change', renderArrivals);

dialog.addEventListener('close', () => {
  if (document.activeElement === document.body && !get('stay').hidden) {
    get('rooms-title').focus();
  }
});

get('rate-form').addEventListener('submit', (event) => {
  event.preventDefault();
  rooms.forEach((room) => { room.rate = get(`rate-${room.id}`).valueAsNumber; });
  get('rate-feedback').textContent = 'Rates saved.';
  renderRooms();
});

document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const { screen, room, staff, cancel, dialog: action } = button.dataset;
  if (screen) showScreen(screen);
  if (room) chooseRoom(rooms.find((entry) => entry.id === room));
  if (staff) showStaffPanel(staff);
  if (cancel) {
    cancellation = reservations.find((booking) => booking.id === cancel);
    showDialog('My bookings', 'Cancel this booking?', `
      <p>${cancellation.room.name} · ${formatDate(cancellation.checkIn)} to ${formatDate(cancellation.checkOut)}</p>
      <button class="button button-outline" type="button" data-dialog="cancel">Yes, cancel booking</button>
      <button class="button button-primary" type="button" data-dialog="close">Keep booking</button>`);
  }
  if (action === 'close') dialog.close();
  if (action === 'sign-in') {
    signedIn = true;
    showReview();
  }
  if (action === 'confirm') confirmReservation();
  if (action === 'cancel') {
    cancellation.status = 'Cancelled';
    dialog.close();
    renderRooms();
    showScreen('bookings');
  }
  if (action === 'bookings' || action === 'rooms') {
    dialog.close();
    showScreen(action);
  }
});

renderRooms();
