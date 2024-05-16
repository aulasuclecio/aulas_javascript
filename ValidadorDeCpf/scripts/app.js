(()=>{ 
    //  Obtendo os elementos da tela
    const frmValidador = document.getElementById("frmValidador");
    const tagValido = document.getElementById("tagValido");
    const tagInvalido = document.getElementById("tagInvalido");
    const animCarregando = document.getElementById("animCarregando");
    
    const btnSubmit = document.querySelector("button[type=submit]")
    
    //obtendo evento de submit do formulário
    frmValidador.addEventListener("submit", (evento) => {
        evento.preventDefault(); // parar envento de submit
        const cpf = frmValidador.txtCpf.value;

        animCarregando.classList.toggle('w3-hide');
        tagValido.classList.add('w3-hide');
        tagInvalido.classList.add('w3-hide');
        
        btnSubmit.setAttribute("disabled","true");

        setTimeout(() => {        
            if (validarCPF(cpf)){
                tagValido.classList.remove('w3-hide');
                tagInvalido.classList.add('w3-hide');
            }else{
                tagValido.classList.add('w3-hide');
                tagInvalido.classList.remove('w3-hide');
            }
        
            animCarregando.classList.toggle('w3-hide');
            btnSubmit.removeAttribute("disabled");
            // frmValidador.reset();
        }, 2000);
    });

})()