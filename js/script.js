// Función para calcular el IMC:
function calculateIMC(weight, height) {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(2);
}

// Función para obtener la categoría del IMC:
function getBMICategory(bmi) {
  if (bmi < 18.5) {
      return 'Bajo peso';
  } else if (bmi >= 18.5 && bmi < 24.9) {
      return 'Peso normal';
  } else if (bmi >= 25 && bmi < 29.9) {
      return 'Sobrepeso';
  } else {
      return 'Obesidad';
  }
}

// Función para obtener el peso ideal
function getIdealWeight(height) {
  const heightInMeters = height / 100;
  const idealBMI = 24.9; // Límite superior del rango de IMC para "Peso normal"
  return (idealBMI * (heightInMeters * heightInMeters)).toFixed(2);
}

// Función para obtener el peso mínimo dentro del rango de "Peso normal"
function getMinWeight(height) {
  const heightInMeters = height / 100;
  const minBMI = 18.5; // Límite inferior del rango de IMC para "Peso normal"
  return (minBMI * (heightInMeters * heightInMeters)).toFixed(2);
}

// Función para mostrar el resultado en el DOM:
function showResult(bmi, category, weightDifference) {
  const resultDiv = $('#result');
  let message = `Su IMC es: ${bmi} - ${category}`;

  if (weightDifference) {
      if (category === 'Sobrepeso' || category === 'Obesidad') {
          message += `<br>Debe bajar ${Math.abs(weightDifference)} kg para alcanzar el peso normal.`;
      } else if (category === 'Bajo peso') {
          const idealWeight = getIdealWeight($('#height').val());
          const currentWeight = $('#weight').val();
          weightDifference = (idealWeight - currentWeight).toFixed(2);
          message += `<br>Debe subir ${Math.abs(weightDifference)} kg para alcanzar el peso normal.`;
      }
  }

  resultDiv.html(`<div class="alert alert-success white-text" role="alert">${message}</div>`);
}

// Función para mostrar el historial desde localStorage:
function showHistory() {
  const historyDiv = $('#history');
  const history = JSON.parse(localStorage.getItem('history')) || [];
  historyDiv.empty();
  history.forEach((result) => {
      const historyItem = `<li class="list-group-item">${result}</li>`;
      historyDiv.append(historyItem);
  });
}
$(document).ready(function() {
  const form = $('#imcForm');

  form.on('submit', function(event) {
    event.preventDefault();

    const weight = parseFloat($('#weight').val());
    const height = parseFloat($('#height').val());

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
      const errorDiv = '<div class="alert alert-danger white-text" role="alert">Por favor, ingrese valores válidos para peso y estatura.</div>';
      $('#result').html(errorDiv);
      return;
    }

    const bmi = calculateIMC(weight, height);
    const bmiCategory = getBMICategory(bmi);

    let weightDifference = null;
    if (bmiCategory === 'Sobrepeso' || bmiCategory === 'Obesidad') {
      const idealWeight = getIdealWeight(height);
      const currentWeight = weight;
      weightDifference = (currentWeight - idealWeight).toFixed(2);
    } else if (bmiCategory === 'Bajo peso') {
      const idealWeight = getIdealWeight(height);
      const currentWeight = weight;
      weightDifference = (idealWeight - currentWeight).toFixed(2);
    }

    showResult(bmi, bmiCategory, weightDifference);

    // Guardar resultado en el historial:
    const result = $('#result').html();
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.push(result);
    localStorage.setItem('history', JSON.stringify(history));

    // Actualizar el historial en la página
    showHistory();
  });

  // Mostrar historial al cargar la página
  showHistory();
});

// Evento para limpiar el historial:
$(document).ready(function() {
  const clearHistoryButton = $('#clearHistoryButton');

  clearHistoryButton.on('click', function() {
    // Limpiar el historial en localStorage:
    localStorage.removeItem('history');

    // Actualizar el historial en la página:
    showHistory();
  });
});