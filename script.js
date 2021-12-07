let cart =    [];
let modalQt =  1;
let modalKey = 0;
let key = 0;

const c = el =>  document.querySelector(el);
const cs = el => document.querySelectorAll(el);


pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src =     item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML =  item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML =  item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

    pizzaItem.querySelector('a').addEventListener('click',  (e) =>{  //funcao de clique para abrir o modal 
        e.preventDefault();
        modalQt = 1;
      
        key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key;


        //inicio do preenchimento dos dados do modal
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
         c('.pizzaInfo--size.selected').classList.remove('selected');
        
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

        })
        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';

        setTimeout(()=>{                                    //delay para setar animacao do modal
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);

    })


    c('.pizza-area').append( pizzaItem ); //insercao das pizzas na tela
}); //fim eventos do map das pizzas


//eventos do modal


const closeModal = () =>{                                   //funcao para fechar o modal
    c('.pizzaWindowArea').style.opacity = 0;

    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    },500)
}


cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((button) =>{ //fechar modal web e mobile
    button.addEventListener('click' , closeModal);
})

c('.pizzaInfo--qtmais').addEventListener("click" , () =>{   //aumenta quantidade de pizza no modal
    modalQt++;
    atualizaQTPizza();
})


c('.pizzaInfo--qtmenos').addEventListener("click" , () =>{  //diminiu quntidade de pizza no modal
    if(modalQt > 1){                                        //nao pode ser menos que um
        modalQt--;
        atualizaQTPizza();        
    }
})

cs('.pizzaInfo--size').forEach((size,sizeIndex)=>{          //efeito de click no tamanho das pizzas no modal
    size.addEventListener('click', (e)=>{
         c('.pizzaInfo--size.selected').classList.remove('selected');
         size.classList.add('selected');
    })
})

const atualizaQTPizza = () =>{                               //atualiza quantidade de pizzas no modal
    document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${(pizzaJson[key].price * modalQt).toFixed(2)}` //atualiza preço subtotal item
}

c('.pizzaInfo--addButton').addEventListener('click', () =>{  //adiciona pizza ao carrinho   
    modalKey;                                                                       //qual a pizza selecionada
    modalQt;                                                                        //quantidade da pizza    
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));   //tamanho selecionado
    
    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=> item.identifier == identifier);

    if (key > -1){
        cart[key].qt += modalQt;
    } else {
        cart.push({ 
            identifier, //adiciona os dados no array do carrinho
            id: pizzaJson[modalKey].id,
            qt: modalQt,
            size
        })
    }

    
    updateCart();
    closeModal(); //depois de adicionar fecha o modal
})  

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
})

c('.menu-closer').addEventListener('click', (item)=>{
    c('aside').style.left = '100vw';
})

const updateCart = () =>{
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total    = 0;



        for(let i in cart){
            let pizzaItem = pizzaJson.find(item => item.id == cart[i].id);
            let cartItem = c('.models .cart--item').cloneNode(true);
            let pizzaSizeName;

            subtotal += pizzaItem.price * cart[i].qt;


            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = "P";
                    break
                case 1:
                    pizzaSizeName = "M";
                    break
                case 2:
                    pizzaSizeName ="G";
                    break
            }
            
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{
                if(cart[i].qt > 1){
                    cart[i].qt --;                   
                } else {
                    cart.splice(i,1);                    
                }
                updateCart();
            }) 

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () =>{
                cart[i].qt ++;
                updateCart();
            })
            
            
            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML    = `R$ ${total.toFixed(2)}`;


    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}