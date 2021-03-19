import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Alert, Button, Card, Col, TabContainer } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Image from 'next/image'


function Login(){

    const [cookies, setCookie, removeCookie] = useCookies(['uid']);

    const router = useRouter()

    const [userName, setUserName] = useState()
    const [password, setPassword] = useState();
    const [loggedInFailed, setLoggedInFailed] = useState(false)
    const [loggedInSuccess, setLoggedInSuccess] = useState(null)
    const [errorMessage, setErrorMessage] = useState()


    function handleSubmit(e){
        e.preventDefault();
        setLoggedInFailed(false)
        
        //router.push('/my-account');

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({"username":userName,"password":password});

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://woocommerce.local/wp-json/jwt-auth/v1/token", requestOptions)
        .then(response => response.text())
        .then(result => {
            result = JSON.parse(result);
            console.log(result)
            if(result.success){
                setLoggedInSuccess(true)
                setCookie('uid', result.data.token)
                setTimeout(() => {
                    router.push('/my-account')
                }, 1500);
                
            }else{
                setErrorMessage(result.message)
                setLoggedInFailed(true);
            }
        })
        .catch(error => {

            console.log('error', error)
        });
    }


    return (
        <div>
            <style js>
                {`
                body {}
                `}
            </style>
        <Container className="justify-content-md-center pt-5">
            <Row className="justify-content-center">
                <Col md="4" className="mb-5 d-flex justify-content-around">
                    <Image src="/logo.png" width={200} height={200}/>  
                </Col> 
            </Row>
            <Row className="justify-content-center">
                
                <Col md="4" className="justify-content-center">
                    
                    <Card bg="white" border="0" className="shadow-lg rounded">
                        <Card.Body>
                            <Form>
                                <Form.Label className="username-label">Användarnamn</Form.Label>
                                <Form.Control value={userName} onChange={e => setUserName(e.target.value)} className="username-field" type="email" />

                                <Form.Label className="password-label mt-3">Lösenord</Form.Label>
                                <Form.Control value={password} onChange={e => setPassword(e.target.value)} className="password-field" type="password" />

                                <Button onClick={handleSubmit} className="mt-3" type="submit">Logga in</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    {loggedInFailed
                        ? <Alert className="mt-3 shadow-lg" variant="warning">{errorMessage}</Alert>
                        : <></>
                    }
                    {loggedInSuccess &&
                        <Alert className="mt-3 shadow-lg" variant="success">Log in successful</Alert>

                    }
                    
                </Col>
            </Row>
        </Container>
        </div>
    );
}

export default Login