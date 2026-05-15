document.addEventListener('DOMContentLoaded', () => {
    const currencySelect = document.getElementById('currencySelect');
    const rateInfo = document.getElementById('rateInfo');
    const applyBtn = document.getElementById('applyBtn');
    const resetBtn = document.getElementById('resetBtn');
    const settingsStatus = document.getElementById('settingsStatus');
    const currentCurrencyDisplay = document.getElementById('currentCurrencyDisplay');

    let pendingRate = null;
    let pendingCode = 'BRL';

    // Update the display of current settings
    function updateCurrentDisplay() {
        const settings = Currency.getCurrency();
        if (settings.code === 'BRL') {
            currentCurrencyDisplay.textContent = 'Moeda atual: BRL (Real Brasileiro)';
        } else {
            const date = settings.updatedAt ? new Date(settings.updatedAt).toLocaleString() : 'N/A';
            currentCurrencyDisplay.innerHTML = `
                Moeda atual: <strong>${settings.code}</strong><br>
                Taxa: 1 BRL = ${settings.rate.toFixed(4)} ${settings.code}<br>
                <small style="color: var(--text-muted)">Atualizado em: ${date}</small>
            `;
        }
        currencySelect.value = settings.code;
    }

    // Fetch rate from API
    async function fetchRate(targetCode) {
        if (targetCode === 'BRL') return 1;
        
        try {
            const response = await fetch(`https://open.er-api.com/v6/latest/BRL`);
            if (!response.ok) throw new Error('Falha ao buscar cotação');
            const data = await response.json();
            
            if (data.result === 'success' && data.rates[targetCode]) {
                return data.rates[targetCode];
            } else {
                throw new Error('Moeda não encontrada');
            }
        } catch (error) {
            console.error('Error fetching rate:', error);
            throw error;
        }
    }

    // Handle selection change
    currencySelect.addEventListener('change', async () => {
        const code = currencySelect.value;
        settingsStatus.textContent = '';
        
        if (code === 'BRL') {
            rateInfo.textContent = 'BRL é a moeda base do sistema (Taxa: 1.0000)';
            pendingRate = 1;
            pendingCode = 'BRL';
            return;
        }

        rateInfo.textContent = 'Buscando cotação...';
        applyBtn.disabled = true;

        try {
            const rate = await fetchRate(code);
            rateInfo.innerHTML = `Cotação atual: 1 BRL = <strong>${rate.toFixed(4)} ${code}</strong>`;
            pendingRate = rate;
            pendingCode = code;
            applyBtn.disabled = false;
        } catch (error) {
            rateInfo.textContent = 'Erro ao buscar cotação. Verifique sua conexão.';
            applyBtn.disabled = true;
        }
    });

    // Apply button
    applyBtn.addEventListener('click', async () => {
        const code = currencySelect.value;
        
        settingsStatus.textContent = 'Salvando...';
        settingsStatus.style.color = 'var(--text-secondary)';

        try {
            // Fetch fresh rate one more time to be sure
            const rate = await fetchRate(code);
            Currency.setCurrency(code, rate);
            
            settingsStatus.textContent = 'Configurações aplicadas com sucesso!';
            settingsStatus.style.color = '#10b981'; // Green
            
            updateCurrentDisplay();
            
            setTimeout(() => {
                settingsStatus.textContent = '';
            }, 3000);
        } catch (error) {
            settingsStatus.textContent = 'Erro ao aplicar configurações.';
            settingsStatus.style.color = '#ef4444'; // Red
        }
    });

    // Reset button
    resetBtn.addEventListener('click', () => {
        Currency.resetCurrency();
        updateCurrentDisplay();
        rateInfo.textContent = 'BRL é a moeda base do sistema (Taxa: 1.0000)';
        settingsStatus.textContent = 'Restaurado para BRL.';
        settingsStatus.style.color = 'var(--text-secondary)';
        
        setTimeout(() => {
            settingsStatus.textContent = '';
        }, 3000);
    });

    // Initial load
    updateCurrentDisplay();
    // Trigger change if not BRL to show current rate info
    if (currencySelect.value !== 'BRL') {
        currencySelect.dispatchEvent(new Event('change'));
    } else {
        rateInfo.textContent = 'BRL é a moeda base do sistema (Taxa: 1.0000)';
    }
});
