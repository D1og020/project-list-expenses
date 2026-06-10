// VARIAVEIS - Seleciona elementos do form

// Formulario
const form = document.querySelector("form")

// Valores
const amount = document.getElementById("amount")

// Nome da Despesa
const expense = document.getElementById("expense")

// Categoria
const category = document.getElementById("category")

// Seleciono a Lista
const expenseList = document.querySelector("ul")

// Selecione o texto da quantidade de despesas
const expensesQuantity = document.querySelector("aside header p span")

// Seleciono o texto do valor total
const expensesTotal = document.querySelector("aside header h2")

/* ----------------------------------------------------- */

// EVENTOS

// Captura o evento do INPUT para formatar o valor
amount.oninput = () => {

    // Obtem o valor atual do INPUT e remove os caracteres NÃO númericos
    let value = amount.value.replace(/\D/g, "")

    // Transformo o valor em CENTAVOS antes (Ex: 150 / 100 = 1.5 que é equivalente a R$1,50)
    value = Number(value) / 100

    // Atualiza o valor do INPUT
    amount.value = formatCurrencyBRL(value)

}

// Captura valores do formulario
form.onsubmit = (event) => {

    // Evitar o reload da pagina
    event.preventDefault()

    // Crio objeto para armazenar os dados do formulário
    const newExpense = {
        id: new Date().getTime(), // Crio um ID com base no TIMESTAMP
        amount: amount.value, // Capturo o VALOR DA DESPESA
        expense: expense.value, // Capturo o NOME DA DESPESA
        category_id: category.value, // Pego o valor da Categoria. Ex: "food"
        category_name: category.options[category.selectedIndex].text, // Capturo o TEXTO do input da Categoria
        created_at: new Date() // Capturo o momento que a despesa foi criada
    }

    // Chamo a função que adiciona o item da despesa na lista
    expenseAdd(newExpense)
}

// Captura o clique do item da lista
expenseList.addEventListener("click", function(event){

    if(event.target.classList.contains("remove-icon")){
        
        // Obtém a <li> pai do elemento clicado
        const item = event.target.closest(".expense")

        // Remove o item
        item.remove()
    }

    // Atualiza os itens
    updateTotals()

})

/* ----------------------------------------------------- */

// FUNÇÕES

// Formatada o valor em Real BRL
function formatCurrencyBRL(value){

    // Formata o valor da moeda no padrão BRL -> Padrão Real Brasileiro
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    // Retorna o valor formatado no padrão BRL
    return value
}

// Função que cria o item na lista das depesas
function expenseAdd(newExpense){

    try {
        
        // Crio o ELEMENTO <li> (item) para adicionar na lista <ul>
        const expenseItem = document.createElement("li")

        // Atribuo uma CLASS para o meu elemento
        expenseItem.classList.add("expense")

        /* ------------------------------------------------------------ */

        // Crio o ELEMENTO <img> (Icone)
        const expenseIcon = document.createElement("img")

        // Seto os ATRIBUTOS: src e alt para o elemento <img>
        // Crio uma interpolação para passar o nome da imagem dinamicamente
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        /* ------------------------------------------------------------ */

        // Crio o ELEMENTO <div> (Informação da Despesa)
        const expenseInfo = document.createElement("div")
        // Atribuo uma CLASS ao meu elemento
        expenseIcon.classList.add("expense-info")

        /* ------------------------------------------------------------ */

        // Crio o ELEMENTO <strong> (Nome da Despesa)
        const expenseName = document.createElement("strong")
        // Atribuo um VALOR no meu elemento
        expenseName.textContent = newExpense.expense

        /* ------------------------------------------------------------ */

        // Crio o ELEMENTO <span> (Categoria da Despesa)
        const expenseCategory = document.createElement("span")
        // Atribuo um VALOR no meu elemento
        expenseCategory.textContent = newExpense.category_name

        /* ------------------------------------------------------------ */

        // Adiciona NAME e CATEGORY na <div> das Informações da Despesa
        expenseInfo.append(expenseName, expenseCategory)

        /* ------------------------------------------------------------ */

        // Cria o ELEMENTO <span> (Valor da Despesa)
        const expenseAmount = document.createElement("span")

        // Adiciono a CLASS ao elemento
        expenseAmount.classList.add("expense-amount")

        // Adiciono elemento e valor da despesa dentro do proprio conteúdo HTML
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

        /* ------------------------------------------------------------ */

        // Crio o ELEMENTO <img> (Remove o Item da lista)
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")

        /* ------------------------------------------------------------ */

        // Adiciona as informaçõe no item
        // 1º Adiciono o Icone no Item
        // 2º Adiciono as Informações
        // 3º Adiciono o Valor
        // 4º Adiciono o Icone para Remover o item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        // 2º Adiciono o Item na Lista
        expenseList.append(expenseItem)

        // Limpa o formulário, para adicionar um novo item
        formClear()

        // Atualizo os totais
        updateTotals()

    } catch (error) {
        alert("Não foi possivel atualizar a lista de despesas!")
        console.log(error)
    }

}

// Função que calcula a quantidade total das despesas
function updateTotals(){

    try {

        // Capturo a quantidade de itens <li> da lista <ul>
        const items = expenseList.children
        
        // Atualiza a quantide de itens da lista <ul>
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "Despesas" : "Despesa"}`

        /* -------------------------------------------------- */

        // Percorro os itens da lista

        // Variavel para incrementar o valor
        let total = 0

        // Loop para percorrer cada item <li> da lista <ul>
        for (let item = 0; item < items.length ; item++) {
            
            // Seleciono o item da lista
            const itemAmount = items[item].querySelector(".expense-amount")
            
            // Faço a formatação do valor do item -> Utilizo uma expressão regular para isso
            // Significado da expressão regular: pega TUDO que NÃO é digito que é caracter de texto, porém, deixa "." ou "," de FORA 
            // Ao final SUBSTITUI vírgula pelo ponto
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

            // Converte o valor para float
            value = parseFloat(value)

            // SEGURANÇA A MAIS
            if (isNaN(value)) {
                return alert("Não foi possível calcular o valor total. O valor não parece ser um número")
            }

            // Incrementa o VALOR TOTAL
            // A linha abaixo seria equivalente a: total = total + value porém, esta mais curto(short)
            total += Number(value)
        }
        
        // Criando a tag <span> para adionar o R$ formatado
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        // Formata o valor e REMOVE o R$ -> Será exibido pela small com FORMATAÇÃO
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        // Limpo o conteúdo do elemento
        expensesTotal.innerHTML = ""

        // Atribuo o R$ junto ao TOTAL
        expensesTotal.append(symbolBRL, total)

    } catch (error) {
        console.log(error)
        alert("Não foi possível atualizar os totais.")
    }

}

// Função para limpar os valores do formulário
function formClear(){

    // Limpa os inputs
    expense.value = ""
    amount.value = ""
    category.value = ""
    
    // Foca no input do Nome da Despesas
    expense.focus()
}