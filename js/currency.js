// Shared currency module — all stored monetary values are in BRL.
// Display is converted to the user-selected currency using a saved rate.
(function () {
    const STORAGE_KEY = 'currency_settings';
    const DEFAULT_SETTINGS = { code: 'BRL', rate: 1, updatedAt: null };

    function getCurrency() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return { ...DEFAULT_SETTINGS };
            const parsed = JSON.parse(raw);
            if (!parsed.code || typeof parsed.rate !== 'number') return { ...DEFAULT_SETTINGS };
            return parsed;
        } catch {
            return { ...DEFAULT_SETTINGS };
        }
    }

    function setCurrency(code, rate) {
        const settings = { code, rate, updatedAt: Date.now() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        return settings;
    }

    function resetCurrency() {
        localStorage.removeItem(STORAGE_KEY);
        return { ...DEFAULT_SETTINGS };
    }

    function getPrefix(code) {
        return code === 'BRL' ? 'R$' : code;
    }

    function getLocale(code) {
        return code === 'BRL' ? 'pt-BR' : 'en-US';
    }

    // brlVal is always stored in BRL; convert and format for display.
    function formatMoney(brlVal) {
        const { code, rate } = getCurrency();
        const converted = (Number(brlVal) || 0) * rate;
        return `${getPrefix(code)} ${converted.toLocaleString(getLocale(code), {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    // Convert a value typed in the current display currency back to BRL for storage.
    function toBRL(displayVal) {
        const { rate } = getCurrency();
        if (!rate) return Number(displayVal) || 0;
        return (Number(displayVal) || 0) / rate;
    }

    // Convert a BRL value to the current display currency (for form inputs).
    function fromBRL(brlVal) {
        const { rate } = getCurrency();
        return (Number(brlVal) || 0) * rate;
    }

    window.Currency = {
        getCurrency,
        setCurrency,
        resetCurrency,
        formatMoney,
        toBRL,
        fromBRL,
        getPrefix
    };
})();
