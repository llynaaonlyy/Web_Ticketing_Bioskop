const params = new URLSearchParams(window.location.search);
const filmKey = params.get('film');

document.getElementById('judulFilm').textContent = filmData[filmKey].judul;

const pricePerSeat = filmData[filmKey].harga;

const bookedKey = `bookedSeats_${filmKey}`;

const seats = document.querySelectorAll('.seat');
const selectedSeatsText = document.getElementById('selectedSeats');
const totalPriceText = document.getElementById('totalPrice');

let selectedSeats = [];
let bookedSeats = JSON.parse(localStorage.getItem(bookedKey)) || [];

seats.forEach(seat => {
    const seatNumber = seat.dataset.seat;
    if (bookedSeats.includes(seatNumber)) {
        seat.classList.add('booked');
    }
});

seats.forEach(seat => {
    seat.addEventListener('click', () => {
        if (seat.classList.contains('booked')) return;

        const seatNumber = seat.dataset.seat;
        seat.classList.toggle('selected');

        if (selectedSeats.includes(seatNumber)) {
            selectedSeats = selectedSeats.filter(s => s !== seatNumber);
        } else {
            selectedSeats.push(seatNumber);
        }

        updateInfo();
    });
});

function updateInfo() {
    selectedSeatsText.textContent = selectedSeats.join(', ') || '-';
    totalPriceText.textContent =
        'Rp ' + (selectedSeats.length * pricePerSeat).toLocaleString('id-ID');
}

function lanjut() {
    if (selectedSeats.length === 0) {
        alert('Pilih minimal 1 kursi!');
        return;
    }

    localStorage.setItem(`tempSeats_${filmKey}`, JSON.stringify(selectedSeats));

    localStorage.setItem('filmKey', filmKey);
    localStorage.setItem('filmJudul', filmData[filmKey].judul);
    localStorage.setItem('seats', JSON.stringify(selectedSeats));
    localStorage.setItem('total', selectedSeats.length * pricePerSeat);

    window.location.href = 'pembayaran.html';
}