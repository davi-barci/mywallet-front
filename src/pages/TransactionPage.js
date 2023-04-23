import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import UsuarioLogadoContext from "../contexts/UsuarioLogado";
import axios from "axios";

export default function TransactionsPage() {
  const {tipo} = useParams();
  const [formTransaction, setFormTransaction] = useState({valor:"", descricao:""});
  const {usuario} = useContext(UsuarioLogadoContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(usuario === null) return navigate("/");
  }, []);

  function handleForm(e){
    setFormTransaction({...formTransaction, [e.target.name]: e.target.value});
  }

  function realizarTransacao(e){
    e.preventDefault();

    const config = {
      headers: {
          Authorization: `Bearer ${usuario.token}`
      }
    };

    formTransaction.valor = Number(formTransaction.valor);

    console.log(formTransaction);

    axios
    .post(`${process.env.REACT_APP_API_URL}/nova-transacao/${tipo}`, formTransaction, config)
    .then(res => {
        alert("Transação realizada com sucesso!");
        navigate("/home");
    })
    .catch(err => {
        console.log(err);
        if (err.response.status === 422){
          alert("Dados Inválidos!"); 
        }else{
          alert("Ocorreu algum erro durante a requisição, tente novamente...");
        }
    });
  }

  return (
    <TransactionsContainer>
      <h1>Nova {tipo}</h1>
      <form onSubmit={realizarTransacao}>
        <input 
          placeholder="Valor" 
          type="number"
          name="valor"
          value={formTransaction.valor}
          onChange={handleForm}
          required
        />
        <input 
          placeholder="Descrição" 
          type="text" 
          name="descricao"
          value={formTransaction.descricao}
          onChange={handleForm}
          required
        />
        <button type="submit">Salvar {tipo}</button>
      </form>
    </TransactionsContainer>
  )
}

const TransactionsContainer = styled.main`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
  }
`
