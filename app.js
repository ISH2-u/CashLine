document.addEventListener('DOMContentLoaded', () => {
    const totalCashInput = document.getElementById('totalCash');
    const monthlyBurnInput = document.getElementById('monthlyBurn');
    const expInputs = document.querySelectorAll('.exp-input');
    const calcBtn = document.getElementById('calcBtn');
    const resetBtn = document.getElementById('resetBtn');
    const errorMsg = document.getElementById('errorMsg');
    const themeToggle = document.getElementById('themeToggle');
    const runningTotalValue = document.getElementById('runningTotalValue');
    
    // Sections & Display elements
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsPanel = document.getElementById('resultsPanel');
    const runwayNumber = document.getElementById('runwayNumber');
    const flatlineDate = document.getElementById('flatlineDate');
    const daysToZero = document.getElementById('daysToZero');
    const stateBadgeText = document.getElementById('stateBadgeText');
    const pulsePath = document.getElementById('pulsePath');
    const smartTipCard = document.getElementById('smartTipCard');
    const smartTipText = document.getElementById('smartTipText');
    
    let depletionChartInstance = null;

    // ---- THEME TOGGLE ----
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        themeToggle.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
        
        // Retrigger calculation if chart is active to update colors
        if (!resultsContainer.classList.contains('hidden')) {
            const cash = parseNumber(totalCashInput.value);
            const burn = parseNumber(monthlyBurnInput.value);
            renderChart(cash, burn, cash / burn);
        }
    });

    // ---- UI INTERACTIONS ----
    const setupCollapsible = (btnId, iconId, sectionId) => {
        const btn = document.getElementById(btnId);
        const icon = document.getElementById(iconId);
        const section = document.getElementById(sectionId);
        
        btn.addEventListener('click', () => {
            section.classList.toggle('expanded');
            icon.style.transform = section.classList.contains('expanded') ? 'rotate(45deg)' : 'rotate(0deg)';
        });
    };

    setupCollapsible('toggleBreakdown', 'breakdownIcon', 'breakdownSection');
    setupCollapsible('toggleTips', 'tipsIcon', 'tipsSection');

    // ---- FORMATTING ----
    const formatCurrency = (val) => val ? new Intl.NumberFormat('en-IN').format(val) : '';
    const parseNumber = (str) => {
        const parsed = parseInt(str.replace(/,/g, ''), 10);
        return isNaN(parsed) ? 0 : parsed;
    };

    const handleInputFormat = (e) => {
        let currentVal = e.target.value.replace(/,/g, '').replace(/[^\d]/g, '');
        if (currentVal !== '') {
            e.target.value = formatCurrency(currentVal);
        }
    };

    totalCashInput.addEventListener('input', handleInputFormat);
    monthlyBurnInput.addEventListener('input', handleInputFormat);
    expInputs.forEach(input => input.addEventListener('input', (e) => {
        handleInputFormat(e);
        calculateBurnRateFromExpenses();
    }));

    const calculateBurnRateFromExpenses = () => {
        let totalExps = 0;
        expInputs.forEach(input => totalExps += parseNumber(input.value));
        if (totalExps > 0) {
            monthlyBurnInput.value = formatCurrency(totalExps);
        } else {
            monthlyBurnInput.value = '';
        }
        if (runningTotalValue) {
            runningTotalValue.textContent = `₹${formatCurrency(totalExps) || '0'}`;
        }
    };

    // ---- ANIMATION ----
    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // smooth easing
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentVal = (start + (end - start) * easeOutQuart).toFixed(1);
            obj.innerHTML = currentVal;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end.toFixed(1);
            }
        };
        window.requestAnimationFrame(step);
    };

    // ---- MAIN LOGIC ----
    calcBtn.addEventListener('click', () => {
        const cash = parseNumber(totalCashInput.value);
        const burn = parseNumber(monthlyBurnInput.value);

        if (!cash || !burn || cash <= 0 || burn <= 0) {
            errorMsg.textContent = "Please enter valid numbers greater than zero.";
            errorMsg.classList.remove('hidden');
            return;
        }
        
        errorMsg.classList.add('hidden');
        const monthsRunway = cash / burn;
        
        // Dates
        const totalDays = Math.floor(monthsRunway * 30.436875);
        const depletedDate = new Date();
        depletedDate.setDate(new Date().getDate() + totalDays);
        const formattedDate = depletedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

        resultsContainer.classList.remove('hidden');
        
        updateUIState(monthsRunway);
        animateValue(runwayNumber, 0, monthsRunway, 2000);
        flatlineDate.textContent = formattedDate;
        
        // Animate Days
        let startT = null;
        const stepD = (timestamp) => {
            if (!startT) startT = timestamp;
            const p = Math.min((timestamp - startT) / 2000, 1);
            const easedP = 1 - Math.pow(1 - p, 4);
            daysToZero.textContent = Math.floor(easedP * totalDays).toLocaleString();
            if (p < 1) window.requestAnimationFrame(stepD);
        };
        window.requestAnimationFrame(stepD);

        renderChart(cash, burn, monthsRunway);

        // Sequence reveal
        document.querySelectorAll('.fade-in-up').forEach((el, index) => {
            el.classList.remove('visible');
            setTimeout(() => el.classList.add('visible'), index * 150 + 100);
        });
        
        setTimeout(() => resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    });

    const getBtnStateClasses = (state) => {
        switch (state) {
            case 'safe':
                return 'from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 dark:from-teal-500 dark:to-emerald-400 shadow-[0_10px_40px_-10px_rgba(13,148,136,0.7)] dark:shadow-[0_10px_40px_-10px_rgba(45,212,191,0.7)]';
            case 'warning':
                return 'from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 dark:from-amber-500 dark:to-yellow-400 shadow-[0_10px_40px_-10px_rgba(217,119,6,0.7)] dark:shadow-[0_10px_40px_-10px_rgba(251,191,36,0.7)]';
            case 'danger':
                return 'from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 dark:from-rose-500 dark:to-red-400 shadow-[0_10px_40px_-10px_rgba(225,29,72,0.7)] dark:shadow-[0_10px_40px_-10px_rgba(251,113,133,0.7)]';
            default: // default primary purple/cyan mix
                return 'from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 dark:from-cyan-500 dark:to-blue-600 dark:hover:from-cyan-400 dark:hover:to-blue-500 shadow-[0_10px_40px_-10px_rgba(79,70,229,0.7)] dark:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.7)]';
        }
    };

    const baseBtnClasses = "w-full py-5 mt-8 bg-gradient-to-r text-white text-xl font-black rounded-2xl uppercase tracking-widest transition-all duration-500 hover:-translate-y-1 hover:shadow-lg active:scale-95 border border-white/20";

    const updateUIState = (months) => {
        // Reset state classes
        resultsPanel.classList.remove('status-safe', 'status-warning', 'status-danger', 'active-status');
        pulsePath.classList.remove('anim-safe', 'anim-warning', 'anim-danger', 'anim-idle');
        smartTipCard.classList.remove('border-teal-500', 'border-amber-500', 'border-rose-500');

        let state = months >= 6 ? 'safe' : months >= 3 ? 'warning' : 'danger';

        resultsPanel.classList.add(`status-${state}`, 'active-status');
        pulsePath.classList.add(`anim-${state}`);
        
        // Change button color to match state
        calcBtn.className = `${baseBtnClasses} ${getBtnStateClasses(state)}`;
        
        if (state === 'safe') {
            stateBadgeText.textContent = "HEALTHY";
            smartTipCard.classList.add('border-teal-500');
            smartTipText.innerHTML = "Your cash position is incredibly absolute. Double down on product velocity, scaling initiatives, and strategic hires without fear.";
        } else if (state === 'warning') {
            stateBadgeText.textContent = "WARNING";
            smartTipCard.classList.add('border-amber-500');
            smartTipText.innerHTML = "You have entered the danger window. Start fundraising immediately. VC cycles close slower than you anticipate. <strong>Act today.</strong>";
        } else {
            stateBadgeText.textContent = "CRITICAL";
            smartTipCard.classList.add('border-rose-500');
            smartTipText.innerHTML = "<strong>EMERGENCY:</strong> Imminent flatline detected. Execute deep cuts on all non-essential outflows and secure bridge funding immediately.";
        }
    };

    const renderChart = (totalCash, burnRate, monthsRunway) => {
        const isDark = document.documentElement.classList.contains('dark');
        const ctx = document.getElementById('depletionChart').getContext('2d');
        if (depletionChartInstance) depletionChartInstance.destroy();

        let labels = [];
        let dataPoints = [];
        const limit = Math.ceil(monthsRunway);
        
        // Sophisticated colors
        let lineColor = isDark ? '#fb7185' : '#e11d48'; // Rose
        if(monthsRunway >= 6) lineColor = isDark ? '#2dd4bf' : '#0d9488'; // Teal
        else if(monthsRunway >= 3) lineColor = isDark ? '#fbbf24' : '#d97706'; // Amber

        for (let i = 0; i <= limit; i++) {
            labels.push(i === 0 ? "Now" : "Month " + i);
            let rem = totalCash - (burnRate * i);
            dataPoints.push(Math.max(rem, 0));
        }
        
        if (monthsRunway % 1 !== 0) {
            labels.push("Zero");
            dataPoints.push(0);
        }

        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        
        // Define exact rgb based on above
        let rgbString = '';
        if(monthsRunway >= 6) rgbString = isDark ? '45, 212, 191' : '13, 148, 136';
        else if(monthsRunway >= 3) rgbString = isDark ? '251, 191, 36' : '217, 119, 6';
        else rgbString = isDark ? '251, 113, 133' : '225, 29, 72';

        gradient.addColorStop(0, `rgba(${rgbString}, ${isDark ? 0.4 : 0.2})`);
        gradient.addColorStop(1, `rgba(${rgbString}, 0.0)`);

        Chart.defaults.color = isDark ? "#94a3b8" : "#64748b";
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.font.weight = "600";

        depletionChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Remaining Cash',
                    data: dataPoints,
                    borderColor: lineColor,
                    backgroundColor: gradient,
                    borderWidth: 4,
                    pointBackgroundColor: isDark ? '#111' : '#fff',
                    pointBorderColor: lineColor,
                    pointBorderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1500, easing: 'easeOutQuart' },
                interaction: { intersect: false, mode: 'index' },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
                        titleColor: isDark ? '#f8fafc' : '#0f172a',
                        bodyColor: lineColor,
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        borderWidth: 1,
                        titleFont: { size: 14, weight: '800' },
                        bodyFont: { size: 15, weight: 'bold' },
                        padding: 16,
                        cornerRadius: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', drawBorder: false } },
                    y: {
                        beginAtZero: true,
                        grid: { color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', drawBorder: false },
                        ticks: {
                            callback: value => '₹ ' + (value/100000 >= 1 ? (value/100000) + 'L' : value)
                        }
                    }
                }
            }
        });
    };

    resetBtn.addEventListener('click', () => {
        totalCashInput.value = '';
        monthlyBurnInput.value = '';
        expInputs.forEach(i => i.value = '');
        if (runningTotalValue) runningTotalValue.textContent = '₹0';
        resultsContainer.classList.add('hidden');
        document.querySelectorAll('.fade-in-up').forEach(el => el.classList.remove('visible'));
        pulsePath.classList.remove('anim-safe', 'anim-warning', 'anim-danger');
        pulsePath.classList.add('anim-idle');
        
        // Reset Button Color
        calcBtn.className = `${baseBtnClasses} ${getBtnStateClasses('default')}`;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
