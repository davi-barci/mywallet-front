import styled from "styled-components"
import { BiExit } from "react-icons/bi"
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai"
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import UsuarioLogadoContext from "../contexts/UsuarioLogado";
import { useNavigate } from "react-router-dom";

export default function HomePage() {

  const [listaTransacoes, setListaTransacoes] = useState([]);
  const [valorTotal, setValorTotal] = useState(null);
  const {usuario, setUsuario} = useContext(UsuarioLogadoContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(usuario === null) return navigate("/");

    const config = {
        headers: {
            Authorization: `Bearer ${usuario.token}`
        }
    };

    axios
    .get(`${process.env.REACT_APP_API_URL}/home`, config)
    .then(res => {
      setListaTransacoes(res.data);
      const totalEntrada = res.data.filter(elem => elem.tipo === "entrada").reduce(function (acc, obj) { return acc + obj.valor; }, 0);
      const totalSaida = res.data.filter(elem => elem.tipo === "saida").reduce(function (acc, obj) { return acc + obj.valor; }, 0);
      setValorTotal(totalEntrada-totalSaida);
    })
    .catch(err => {
        console.log(err);
        alert("Ocorreu um erro durante o carregamento das transações!");
    });
  }, [listaTransacoes]);
  
  function logoutApp(){
      if (window.confirm("Você realmente deseja sair dessa conta?")){
          localStorage.removeItem("usuario");
          setUsuario(null);
          navigate("/");
      }
  }

  return (
    <HomeContainer>
      <Header>
        <h1>Olá, {(usuario !== null) && usuario.usuario}</h1>
        <BiExit onClick={logoutApp}/>
      </Header>

      <TransactionsContainer>
        <ul>
          {listaTransacoes.map((op, index) => 
            <ListItemContainer key={index}>
              <div>
                <span>{op.data}</span>
                <strong>{op.descricao}</strong>
              </div>
              <Value color={(op.tipo === "entrada") ? "positivo" : "negativo"}>{op.valor.toFixed(2).replace('.', ',')}</Value>
            </ListItemContainer>
          )}
        </ul>

        <article>
          <strong>Saldo</strong>
          <Value color={(valorTotal > 0) ? "positivo" : "negativo"}>{(valorTotal === null) ? "00,00" : valorTotal.toFixed(2).replace('.', ',')}</Value>
        </article>
      </TransactionsContainer>


      <ButtonsContainer>
        <button onClick={() => navigate("/nova-transacao/entrada")}>
          <AiOutlinePlusCircle />
          <p>Nova <br /> entrada</p>
        </button>
        <button onClick={() => navigate("/nova-transacao/saida")}>
          <AiOutlineMinusCircle />
          <p>Nova <br />saída</p>
        </button>
      </ButtonsContainer>

    </HomeContainer>
  )
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
`
const TransactionsContainer = styled.article`
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  article {
    display: flex;
    justify-content: space-between;   
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`
const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;
  
  button {
    width: 50%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 18px;
    }
  }
`
const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) => (props.color === "positivo" ? "green" : "red")};
`
const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  margin-right: 10px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
`