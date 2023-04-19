import { ethers } from 'ethers'
import { Container, Row, Button } from 'react-bootstrap'

const { ethereum } = window

const Splash = ({ setAccount }) => {
  const connectHandler = async () => {
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    })
    setAccount(ethers.utils.getAddress(accounts[0]))
  }

  return (
    <Container className="container">
      <h1>Create a new badge!</h1>
      <Row>
        <Button onClick={connectHandler}>Connect Wallet to Get Started</Button>
      </Row>
    </Container>
  )
}

export default Splash
