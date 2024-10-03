import { Row, Col, Typography, Button } from "antd";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import { auth, db } from "@/firebase/config";
import {
  FacebookAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from "firebase/auth";
// import { addDoc, collection, doc } from "firebase/firestore";
import { addDocument } from "@/firebase/service";
const { Title } = Typography;
function Login() {
  async function handleLoginWithFacebook() {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const additionalUserInfo = getAdditionalUserInfo(result);
        if (additionalUserInfo.isNewUser) {
          const data = {
            displayName: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
            uid: result.user.uid,
            providerId: additionalUserInfo.providerId,
          }
          const uid = await addDocument("users", data);
          console.log('new user: ', uid);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
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
          <Button
            type="primary"
            icon={<FacebookOutlined />}
            onClick={handleLoginWithFacebook}
          >
            Đăng nhập bằng Facebook
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
