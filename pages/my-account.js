import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import {useCookies} from 'react-cookie'
import Skeleton from 'react-loading-skeleton'

function MyAccout({ data } ){
    const [cookies, setCookie, removeCookie] = useCookies();
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();

    let content;

    if(isLoaded){
        content = data.uid;
    }else{
        content = <Skeleton count={6}/>
    }
    
    useEffect(() => {
        setTimeout(() => {
            setIsLoaded(true)
        }, 1100);
    })

    function logOut(){
        removeCookie('uid')
        router.push('/login');
    }

    return(
        <Container>
            <Row className="justify-content-center pt-5">
                <Col md={4} style={{wordBreak: "break-word"}}>
                    <h1>My Account</h1>
                    <p>Cookie:</p>
                    {content}
                </Col>
            </Row>
            <Row className="justify-content-center pt-5">
            <Col md={4}>
                <Button onClick={logOut}>
                    Log out
                </Button>
            </Col>
            </Row>
        </Container>
    )
}

export async function getServerSideProps(ctx){

/*  
Dont forget to validate cookie(jwt) is ok by calling
/wp-json/jwt-auth/v1/token/validate.
If it validates, page serves.
Else push user to /login.
*/   
    const cookie = ctx.req.cookies.uid;
    const data = {uid: cookie}
    var logInSuccess = false;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${data.uid}`);

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch("http://woocommerce.local/wp-json/jwt-auth/v1/token/validate/", requestOptions)
    .then(response => response.text())
    .then(result => {
        result = JSON.parse(result)
        logInSuccess = result.success
        
    })
    .catch(error => console.log('error', error));
    
    if(!logInSuccess){
        ctx.res.writeHead(302, {Location: '/login'})
        ctx.res.end()
    } 


    return {props: {data} }  
    
}

export default MyAccout;