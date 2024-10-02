import { Row, Col, Typography, Button } from "antd";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
const { Title } = Typography;
import { auth } from "@/firebase/config";
import { FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
function Login() {
  function handleLoginWithFacebook() {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log(token);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // auth.onAuthStateChanged((user) => {
  //   if (user) {
  //     navigate("/");
  //   }
  // });
  return (
    <div>
      <Row justify="center">
        <Col span={12}>
          <Title style={{ textAlign: "center" }} level={3}>
            Fun D13DT3
          </Title>
        </Col>
      </Row>
      <Row justify="center">
        <Col className="gutter-row" span={12}>
          <Button type="primary" icon={<GoogleOutlined />}>
            Đăng nhập bằng Google
          </Button>
        </Col>
        <Col className="gutter-row" span={12}>
          <Button type="primary" icon={<FacebookOutlined />} onClick={handleLoginWithFacebook}>
            Đăng nhập bằng Facebook
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
