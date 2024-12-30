// Função para formatar valores em BRL com as regras mencionadas
function formatBRL(value) {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  
  document.getElementById('convertButton').addEventListener('click', async () => {
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    let amount = document.getElementById('amount').value;
  
    // Substitui vírgulas por pontos e remove espaços
    amount = amount.replace(',', '.').replace(/\s+/g, '');
    amount = parseFloat(amount);
  
    if (isNaN(amount)) {
      document.getElementById('result').textContent = 'Por favor, insira um valor válido.';
      return;
    }
  
    let apiUrl;
    let conversionRate;
  
    // Determinar a URL da API
    if (fromCurrency === 'BTC' || toCurrency === 'BTC') {
      const cryptoCurrency = fromCurrency === 'BTC' ? 'bitcoin' : toCurrency === 'BTC' ? 'bitcoin' : '';
      const targetCurrency = fromCurrency === 'BTC' ? toCurrency.toLowerCase() : fromCurrency.toLowerCase();
      apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoCurrency}&vs_currencies=${targetCurrency}`;
    } else {
      apiUrl = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;
    }
  
    console.log('API URL:', apiUrl);
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Dados da API:', data);
  
      // Verificar se estamos lidando com Bitcoin
      if (fromCurrency === 'BTC') {
        conversionRate = data.bitcoin[toCurrency.toLowerCase()];
      } else if (toCurrency === 'BTC') {
        conversionRate = 1 / data.bitcoin[fromCurrency.toLowerCase()];
      } else {
        conversionRate = data.rates[toCurrency];
      }
  
      console.log('Taxa de Conversão:', conversionRate);
  
      if (!conversionRate) {
        document.getElementById('result').textContent = 'Erro ao obter a taxa de câmbio.';
        return;
      }
  
      const convertedAmount = (amount * conversionRate).toFixed(toCurrency === 'BTC' ? 8 : 2);
  
      let formattedAmount;
      if (toCurrency === 'BRL') {
        formattedAmount = `R$ ${formatBRL(parseFloat(convertedAmount))}`;
      } else if (toCurrency === 'BTC') {
        formattedAmount = `${convertedAmount} BTC`;
      } else {
        formattedAmount = `${toCurrency} ${convertedAmount}`;
      }
  
      const flagMap = {
        USD: 'usa.png',
        EUR: 'euro.png',
        BRL: 'real.png',
        GBP: 'libra.png',
        BTC: 'bitcoin.png',
      };
  
      const resultHTML = `
        <div class="flex justify-center items-center space-x-4">
          <div>
            <img src="./assets/${flagMap[fromCurrency]}" alt="Bandeira ${fromCurrency}" class="w-12 h-12 inline">
            <p class="text-lg font-bold">${fromCurrency === 'BRL' ? `R$ ${formatBRL(amount)}` : `${fromCurrency} ${amount}`}</p>
          </div>
          <div>
            <img src="./assets/seta.png" alt="Seta" class="w-8 h-8 inline">
          </div>
          <div>
            <img src="./assets/${flagMap[toCurrency]}" alt="Bandeira ${toCurrency}" class="w-12 h-12 inline">
            <p class="text-lg font-bold">${formattedAmount}</p>
          </div>
        </div>
      `;
  
      document.getElementById('result').innerHTML = resultHTML;
    } catch (error) {
      document.getElementById('result').textContent = 'Erro ao acessar a API de conversão.';
      console.error('Erro:', error);
    }
  });
  