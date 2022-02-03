let cart = []
let modalQt = 1
let modalKey = 0

// Listagem das Pizzas
pizzaJson.map((item, index) => {
  let pizzaItem = document.querySelector('.pizza-item').cloneNode(true)

  // Definindo a pizza selecionada
  pizzaItem.setAttribute('data-key', index)
  // Preenchendo os dados do objeto pizza
  pizzaItem.querySelector('.pizza-item--img img').src = item.img
  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description

  pizzaItem.querySelector('a').addEventListener('click', (e) => {
    // Previna a ação padrão do link
    e.preventDefault()
    // Pegando o key do objeto pizza
    let key = e.target.closest('.pizza-item').getAttribute('data-key')
    // Zera com a quantidade sempre de 1
    modalQt = 1
    modalKey = key

    // preencher as informações da pizza selecionada
    document.querySelector('.pizzaBig img').src = pizzaJson[key].img
    document.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name
    document.querySelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
    // Remover a seleção do item selecionado do tamanho
    document.querySelector('.pizzaInfo--sizes .selected').classList.remove('selected')
    // forEach - para cada um dos itens do array, faça
    document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
      if(sizeIndex == 2) {
        size.classList.add('selected')
      }
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
    })
    document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`

    document.querySelector('.pizzaInfo--qt').innerHTML = modalQt

    // Quando clica na pizza, abre o modal
    const pizzaWind = document.querySelector('.pizzaWindowArea')
    pizzaWind.style.display = 'flex'
    // Quando clicou, aparece os dados da pizza com uma leve animação
    pizzaWind.style.opacity = 0
    setTimeout(() => {
      pizzaWind.style.opacity = 1
    }, 200)
  })

  // Adicionou pizzaItem dentro da div pizza-area
  document.querySelector('.pizza-area').append(pizzaItem)
})

// Eventos do Modal

// Quando clicar no botão fechar, fecha o modal
function closeModal() {
  document.querySelector('.pizzaWindowArea').style.opacity = 0
  setTimeout(() => {
    document.querySelector('.pizzaWindowArea').style.display = 'none'
  }, 500)
}
document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(
(item) => {
  item.addEventListener('click', closeModal)
})

document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', () => {
  if(modalQt > 1) {
    modalQt--
    document.querySelector('.pizzaInfo--qt').innerHTML = modalQt
  }
})

document.querySelector('.pizzaInfo--qtmais').addEventListener('click', () => {
  modalQt++
  document.querySelector('.pizzaInfo--qt').innerHTML = modalQt
})

document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
  size.addEventListener('click', () => {
    document.querySelector('.pizzaInfo--sizes .selected').classList.remove('selected')
    size.classList.add('selected')
    
  })
})

document.querySelector('.pizzaInfo--addButton').addEventListener('click', () => {
  // Seleciona o tamanho da pizza (Pequeno, Médio, Grande)
  let size = parseInt(document.querySelector('.pizzaInfo--sizes .selected').getAttribute('data-key')
)
  let identifier = `${pizzaJson[modalKey].id}'@'${size}`
  let key = cart.findIndex((item) => item.identifier == identifier)
  if(key > -1) {
    cart[key].qt += modalQt
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt
    })   
  }  
  updateCart()
  closeModal()
})

document.querySelector('.menu-openner').addEventListener('click', () => {
  if(cart.length > 0) {
    document.querySelector('aside').style.left = '0'
  }})

document.querySelector('.menu-closer').addEventListener('click', () => {
  document.querySelector('aside').style.left = '100vw'
})

// Incluindo o carrinho ou removendo o carrinho
function updateCart() {
  document.querySelector('.menu-openner span').innerHTML = cart.length

  if(cart.length > 0) {
    document.querySelector('aside').classList.add('show')
    document.querySelector('.cart').innerHTML = ''

    let subtotal = 0
    let desconto = 0
    let total = 0

    for(let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id)
      subtotal += pizzaItem.price * cart[i].qt
      let cartItem = document.querySelector('.cart--item').cloneNode(true)
      let pizzaSizeName
      switch(cart[i].size) {
        case 0:
          pizzaSizeName = 'P'
          break
        case 1:
          pizzaSizeName = 'M'
          break
        case 2:
          pizzaSizeName = 'G'
          break
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

      cartItem.querySelector('img').src = pizzaItem.img
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
        if(cart[i].qt > 1) {
          cart[i].qt--
        } else {
          cart.splice(i, 1)
        }
        updateCart()
      })

      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
        cart[i].qt++
        updateCart()
      })
      // Adicionou a classe cart--item
      document.querySelector('.cart').append(cartItem)
    }

    // Calculando o desconto
    desconto = subtotal * 0.1
    total = subtotal - desconto

    document.querySelector('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
    document.querySelector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
    document.querySelector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

  } else {
    document.querySelector('aside').classList.remove('show')
    document.querySelector('aside').style.left = '100vw'
  }
}
