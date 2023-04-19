import { useState } from 'react'
import { Row, Col, FormControl, Button } from 'react-bootstrap'
import { create } from 'ipfs-http-client'

const projectSecret = process.env.REACT_APP_INFURA_API_KEY || ''
const projectId = process.env.REACT_APP_INFURA_PROJECT_ID || ''
const huggingFaceKey = process.env.REACT_APP_HUGGING_FACE_KEY || ''

const Create = ({ nft, provider, fetchAccountInfo }) => {
  const [file, setFile] = useState();
  const [studentID, setStudentID] = useState('')
  const [cid, setCID] = useState(null);

  const [message, setMessage] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);

  const handleChange = async(e) => {
    console.log(e.target.files);
    const data = await readFileDataAsBase64(e);
    console.log(data);
    const cid = await uploadImage(data)
    setCID(cid);
    console.log("This is cid");
    console.log(cid);
}

const readFileDataAsBase64 = async(e) => {
  const file = e.target.files[0];
  const buffer = await file.arrayBuffer();
  return buffer;

}

  const handleSubmit = async e => {
    e.preventDefault()

    if (studentID === '') {
      window.alert('Please provide a student ID')
      return
    }

    setIsWaiting(true)

    // display image before minting
    setIsWaiting(false)
    await mintImage(cid)

    setMessage('')
  }

  const uploadImage = async fileContent => {
    setMessage('Uploading Image to IPFS...')
    const uint8Array = new Uint8Array(fileContent)

    // encrypt the authorization
    const authorization = `Basic ${Buffer.from(
      `${projectId}:${projectSecret}`
    ).toString('base64')}`

    const client = await create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization,
      },
    })

    const result = await client.add(uint8Array)
    console.log("Completed: uploadImage");
    console.log(result);
    const cid = result.path;
    setCID(cid);
    console.log(cid);
    return cid
  }

  const mintImage = async cid => {
    setMessage('Waiting for Mint...')

    const signer = await provider.getSigner()
    const transaction = await nft
      .connect(signer)
      .mint(cid, studentID)
    await transaction.wait()

    console.log(transaction);
    // update wallet with minted NFT
    fetchAccountInfo()
  }

  return (
    <div className="container">
      <h2 id="mint">Generate and Mint Badge NFT</h2>
      <form className="prompt" onSubmit={handleSubmit}>

        <Col>
          <Row>
            <FormControl
            type="text"
            placeholder="Enter a student ID"
            value={studentID}
            onChange={e => setStudentID(e.target.value)}
            />
          </Row>

          <Row>
            <div className="App">
                <h2>Add Image:</h2>
                <input type="file" onChange={handleChange} />
                <img src={file} />
            </div>
          </Row>
          <br/>
          <Row>
            <Button className="mint-btn" type="submit">
            Create & Mint
          </Button>
          </Row>
        </Col>
      </form>
    </div>
  )
}

export default Create
