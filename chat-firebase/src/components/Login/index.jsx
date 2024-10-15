import { Row, Col, Button, Tooltip } from "antd";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import { auth, db } from "@/firebase/config";
import {
  FacebookAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  GoogleAuthProvider,
} from "firebase/auth";
import { addDocument, generateKeywords } from "@/firebase/service";
import BgChat from "@/assets/bg-chat.png";
import Logo from "@/assets/logo.png";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
function Login() {
  async function addUserToDB(result) {
    const additionalUserInfo = getAdditionalUserInfo(result);
    if (additionalUserInfo.isNewUser) {
      const data = {
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        uid: result.user.uid,
        providerId: additionalUserInfo.providerId,
        keywords: generateKeywords(result.user.displayName),
        isLoggedIn: true,
        lastLogin: Date.now(),
      };
      await addDocument("users", data);
    } else {
      const userQuery = query(
        collection(db, "users"),
        where("uid", "==", result.user.uid),
        where("providerId", "==", additionalUserInfo.providerId)
      );
      const querySnapshot = await getDocs(userQuery);
      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          isLoggedIn: true,
          lastLogin: Date.now(),
        });
      });
    }
  }
  async function handleLoginWithFacebook() {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        await addUserToDB(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function handleLoginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        await addUserToDB(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div
      style={{
        backgroundImage: `url(${BgChat})`,
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <Row justify="center" gutter={[16, 16]}>
          <Col span={10}>
            {" "}
            <img src={Logo} alt="App Logo" style={{ width: "100px" }} />
          </Col>
          <Col span={14}>
            <Row
              justify="space-between"
              align="middle"
              gutter={[16, 16]}
              style={{ height: "100%", alignItems: "flex-start" }}
            >
              <Col span={24}>
                <Button
                  type="primary"
                  icon={<GoogleOutlined />}
                  style={{ width: "100%" }}
                  onClick={handleLoginWithGoogle}
                >
                  Login with Google
                </Button>
              </Col>
              <Col span={24}>
                <Tooltip
                  trigger="hover"
                  placement="bottom"
                  title="The feature is under maintenance due to the absence of a Facebook app."
                >
                  <Button
                    disabled
                    type="primary"
                    icon={<FacebookOutlined />}
                    onClick={handleLoginWithFacebook}
                    style={{ width: "100%" }}
                  >
                    Login with Facebook
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Login;
