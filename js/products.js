//Variables locales
let item = localStorage.getItem("catID");
const URLProducts = `https://japceibal.github.io/emercado-api/cats_products/${item}.json`;
const productList = document.getElementById("container-list");
const busqueda = document.getElementById("busqueda"); //Se genera constante busqueda


function productos(listaDeProductos, textobuscado) {
  productList.innerHTML = ""; // Vacía el contenido de productList para volver a generarlo
  for (let producto of listaDeProductos) {
    //Recorremos la listaDeProductos buscando en cada producto
    if (
      producto.name.toLowerCase().includes(textobuscado) ||
      producto.description.toLowerCase().includes(textobuscado)
    ) {
      //Se evalua que el nombre o la descripcion incluya el texto buscado (el texto lo comparamos transformandolo todo a minuscula)
      //Generamos nuestra estructura html
      let divProductContainer = document.createElement("div");
      divProductContainer.classList.add("car-card");
      productList.appendChild(divProductContainer);
      divProductContainer.innerHTML += `<img src="${producto.image}" alt= "imagen del producto" >`;
      divProductContainer.innerHTML += `<p> ${producto.name} - ${producto.currency} ${producto.cost}
      <span class="product-value"> ${producto.soldCount} vendidos </span> </p>`;
      divProductContainer.innerHTML += `<p> ${producto.description} </p>`;

      divProductContainer.addEventListener("click", () => {
        //Agregamos el evento click en el div anteriormente creado
        localStorage.setItem("id_producto", producto.id);
        window.location.href = "product-info.html";
      });
    }
  }
}

function clasificacion_products(dato) {
  //Creamos la funcion para clasificar el producto en funcion del dato
  fetch(URLProducts)
    .then((response) => response.json())
    .then((data) => {
      categoria(data.catName); //Llamamos a la funcion categoria para colocar en el parrafo el nombre de la categoria

      if (dato == "0") {
        data.products.sort(function (a, b) {
          //Clasificacion acendente (Precio)
          return a.cost - b.cost;
        });
      } else if (dato == "1") {
        data.products.sort(function (a, b) {
          //Clasificacion decendente (Precio)
          return b.cost - a.cost;
        });
      } else if (dato == "2") {
        data.products.sort(function (a, b) {
          //Clasificacion decendente (Relevancia)
          return b.soldCount - a.soldCount;
        });
      }
      productos(data.products, "");
    });
}

function categoria(categoria) {
  //Colocamos en el parrafo el nombre de la categoria
  let categoryParagraph = document.getElementById("category-paragraph");
  categoryParagraph.innerHTML = `Verás aquí todos los productos de la categoría ${categoria} `;
}

fetch(URLProducts)
  .then((response) => response.json())
  .then((data) => {
    categoria(data.catName);
    productos(data.products, "");
  }); //Se incluyen todos los productos

busqueda.addEventListener("input", function () {
  //Si se utiliza el input de busqueda
  const textobuscado = busqueda.value.toLowerCase(); //Transformamos a minuscula
  fetch(URLProducts)
    .then((response) => response.json())
    .then((data) => {
      categoria(data.catName);
      productos(data.products, textobuscado); //Llama a productos con el termino de busqueda nuevo
    });
});

//Variables locales
const inputMinimo = document.getElementById("input-minimo");
const inputMaximo = document.getElementById("input-maximo");
const botonFiltrarRangos = document.getElementById("boton-filtrar-por-rangos");

function filtrarMinMax(lista) {
  if (inputMaximo.value !== "" && inputMinimo.value !== "") {
    //En el caso que rellene los dos campos, controlamos que los dos no esten vacios
    return lista.filter((item) => {
      //Utilizamos .filter para filtrar y utilizamos una funcion flecha para aplicar la siguiente condicion
      return item.cost >= inputMinimo.value && item.cost <= inputMaximo.value;
    });
  } else if (inputMaximo.value !== "") {
    //En caso que solo rellene el inputMaximo
    return lista.filter((item) => {
      return item.cost <= inputMaximo.value;
    });
  } else if (inputMinimo.value !== "") {
    //En caso que solo rellene el inputMinimo
    return lista.filter((item) => {
      return item.cost >= inputMinimo.value;
    });
  }
}
botonFiltrarRangos.addEventListener("click", () => {
  //Evento click para el boton filtrar
  if (inputMaximo.value !== "" || inputMinimo.value !== "") {
    //Controlamos que no esten vacios
    fetch(URLProducts)
      .then((response) => response.json())
      .then((data) => {
        productos(filtrarMinMax(data.products), ""); //Llamamos a la funcion filtrarMinMax anteriormente definida
      });
  } else {
    alert("Ingrese valor minimo o maximo para poder filtrar");
  }
});
