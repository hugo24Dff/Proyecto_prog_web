console.log("Ejercicio 1: IMC y FizzBuzz:\n");

const calcularIMC = (peso, altura) => {
    return peso / (altura ** 2);
};

const clasificarIMC = (imc) => {
  let clasificacion = "";

    if (imc < 18.5) {
      clasificacion = "Bajo peso";
    } else if (imc < 25) {
        clasificacion = "Normal";
    } else if (imc < 30) {
        clasificacion = "Sobrepeso";
    } else {
        clasificacion = "Obesidad";
    }
    console.log("Clasificación: " + clasificacion);
};

const fizzBuzz = (n) => {
    for (let i = 1; i <= n; i++) {
        if (i % 3 === 0 && i % 5 === 0) {
            console.log("FizzBuzz");
        } else if (i % 3 === 0) {
            console.log("Fizz");
        } else if (i % 5 === 0) {
            console.log("Buzz");
        } else {
            console.log(i);
        }
    }
};

let opcion;

do{
  opcion = prompt("[1] IMC\n [2] FizzBuzz\n [0] Salir\n Ingrese una opción: ");

  switch (opcion) {
      case "1": {
          let peso = Number(prompt("Ingrese su peso en kg: "));
          console.log("Peso ingresado: " + peso);
          let altura = Number(prompt("Ingrese su altura en metros: "));
          console.log("Altura ingresada: " + altura);

          if (peso <= 0 || altura <= 0) {
              alert("ERROR: Ingrese valores numéricos positivos.");
              break;
          }

          let imc = calcularIMC(peso, altura);
          console.log("IMC calculado: " + imc);
          clasificarIMC(imc);
          break;
      }

      case "2": {
          let n = Number(prompt("Ingrese un número entero positivo: "));
          console.log("Número ingresado: " + n);

          if (n % 1 !== 0|| n <= 0) {
              alert("ERROR: Ingrese un entero positivo válido.");
              break;
          }

          fizzBuzz(n);
          break;
      }

      case "0":
          console.log("Saliendo...");
          break;

      default:
          console.log("Opción no válida.");
  }

} while (opcion !== "0");
