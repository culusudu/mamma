// ==========================================================================
// 1. SINCRO TEMA CHIARO / SCURO (LOCAL STORAGE)
// ==========================================================================
const themeCheckbox = document.getElementById('theme-toggle-checkbox');
const currentSavedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentSavedTheme);

if (currentSavedTheme === 'dark' && themeCheckbox) {
    themeCheckbox.checked = true;
}

if (themeCheckbox) {
    themeCheckbox.addEventListener('change', function() {
        const targetTheme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('theme', targetTheme);
    });
}

// ==========================================================================
// 2. LOGICA DEL CARRELLO REALE (MEMORIA DI PAGINA)
// ==========================================================================
let cart = [];

function updateCartUI() {
    const globalCountElements = document.querySelectorAll('#global-cart-count');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    globalCountElements.forEach(el => el.innerText = totalCount);

    // Gestione specifica per la pagina catalogo
    const summaryList = document.getElementById('cartSummaryList');
    const summaryTotal = document.getElementById('summaryTotal');

    if (!summaryList || !summaryTotal) return;

    if (cart.length === 0) {
        summaryList.innerHTML = `<p style="color: var(--text-muted); font-size: 0.95rem;">Nessun prodotto selezionato. Clicca su "Seleziona" nel catalogo sopra per aggiungere un mazzo fiorito.</p>`;
        summaryTotal.innerText = "€ 0.00";
        return;
    }

    summaryList.innerHTML = "";
    let finalPrice = 0;

    cart.forEach((item, index) => {
        finalPrice += item.price * item.quantity;
        const itemRow = document.createElement('div');
        itemRow.className = 'summary-list-item';
        itemRow.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>€ ${(item.price * item.quantity).toFixed(2)} 
                <button class="btn-remove-item" onclick="removeFromCart(${index})">❌</button>
            </span>
        `;
        summaryList.appendChild(itemRow);
    });

    summaryTotal.innerText = `€ ${finalPrice.toFixed(2)}`;
}

function addToCart(productName, price) {
    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }
    updateCartUI();
    
    // Scorrimento fluido al riepilogo per mostrare l'aggiunta
    document.getElementById('sezione-ordine').scrollIntoView({ behavior: 'smooth' });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// ==========================================================================
// 3. GENERATORE DI MESSAGGIO ORDINE WHATSAPP DIRETTO
// ==========================================================================
const orderForm = document.getElementById('fastOrderForm');
if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (cart.length === 0) {
            alert("Attenzione! Seleziona almeno un prodotto dal catalogo prima di inviare l'ordine.");
            return;
        }

        const nomeMittente = document.getElementById('nome').value;
        const telefono = document.getElementById('telefono').value;
        const destinatario = document.getElementById('destinatario').value;
        const indirizzo = document.getElementById('indirizzo').value;
        const biglietto = document.getElementById('biglietto').value || "Nessun biglietto richiesto.";

        // Creazione elenco prodotti per il testo
        let listaProdottiText = "";
        let totaleConto = 0;
        cart.forEach(item => {
            listaProdottiText += `- ${item.name} (Quantità: x${item.quantity})\n`;
            totaleConto += item.price * item.quantity;
        });

        // Composizione del messaggio formattato per WhatsApp
        const whatsappNumber = "393331234567"; // Sostituire con il numero reale di Erika/Sabiana
        const messageText = `🌸 *NUOVO ORDINE DA UN PENSIERO FIORITO* 🌸\n\n` +
                            `📦 *PRODOTTI RICHIESTI*:\n${listaProdottiText}\n` +
                            `💰 *TOTALE*: € ${totaleConto.toFixed(2)}\n\n` +
                            `👤 *DATI MITTENTE*:\n- Nome: ${nomeMittente}\n- Telefono: ${telefono}\n\n` +
                            `🎁 *DATI SPEDIZIONE*:\n- Destinatario: ${destinatario}\n- Indirizzo: ${indirizzo}\n\n` +
                            `📝 *BIGLIETTO*: "${biglietto}"`;

        const encodedMessage = encodeURIComponent(messageText);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    });
}

// ==========================================================================
// 4. BOTTONE TORNA SU (BACK TO TOP)
// ==========================================================================
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Inizializzazione icone al boot
updateCartUI();