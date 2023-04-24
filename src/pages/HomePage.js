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

      <TransactionsContainer display={(listaTransacoes.length === 0) ? "center" : "space-between"}>
        {(listaTransacoes.length !== 0) ?
          <>
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
              <Value color={(valorTotal >= 0) ? "positivo" : "negativo"}>{(valorTotal === null) ? "00,00" : valorTotal.toFixed(2).replace('.', ',')}</Value>
            </article>
          </>
        : <p>Não há registros de entrada ou saída</p>
        }
      </TransactionsContainer>


      <ButtonsContainer>
        <button onClick={() => navigate("/nova-transacao/entrada")}>
          <AiOutlinePlusCircle/>
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
  align-items: center;
  height: 100vh;
  background-color: #8C11BE;
`
const Header = styled.header`
  width: calc(100% - 50px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
  margin-bottom: 22px;
  font-size: 26px;
  color: white;

  svg{
    cursor: pointer;
  }

  h1{
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 700;
    font-size: 26px;
    line-height: 31px;
  }

`
const TransactionsContainer = styled.div`
  width: calc(100% - 50px);
  height: 446px;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  margin-bottom: 13px;
  justify-content: ${props => props.display};
  align-items: ${props => props.display};
  ul{
    height: 400px;
    margin-bottom: 16px;
    overflow-y: auto;
    margin-top: 23px;
  }
  article {
    display: flex;
    justify-content: space-between; 
    margin-bottom: 10px;

    strong {
      font-weight: 700;
      text-transform: uppercase;
      margin-left: 11px;
    }
    div{
      margin-right: 11px;
    }
  }
  p{
    width: 180px;
    height: 46px;
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 23px;
    text-align: center;
    color: #868686;
  }
`
const ButtonsContainer = styled.section`
  display: flex;
  width: calc(100% - 50px);
  gap: 15px;
  
  button {
    width: 50%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #A328D6;
    border-radius: 5px;
    border: none;
    color: white;
    cursor: pointer;
    p {
      font-size: 18px;
      margin-bottom: 9px;
    }
    svg{
      width:25px;
      height:25px;
      margin-top: 9px;
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

  div span {
    color: #c6c6c6;
    margin-right: 10px;
    margin-left: 11px;
  }
  >div:nth-of-type(2){
    margin-right: 11px;
  }
`