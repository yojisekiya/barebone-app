// import { useAppBridge } from '@shopify/app-bridge-react';
// import { Redirect } from '@shopify/app-bridge/actions';
// import { Page, Form, FormLayout, TextField, Button, Card, Text } from '@shopify/polaris';
// import { useState, useCallback } from 'react';
// import CryptoJS from 'crypto-js';
// console.log("CryptoJS", CryptoJS);

// // Multipass
// function Multipass() {
//   const app = useAppBridge();
//   const redirect = Redirect.create(app);

//   class ShopifyMultipass {
//     constructor(multipassSecret) {
//       // Use the Multipass secret to derive two cryptographic keys,
//       // one for encryption, one for signing
//       this.encryptionKey = CryptoJS.enc.Utf8.parse(multipassSecret.slice(0, 16));
//       this.signatureKey = CryptoJS.enc.Utf8.parse(multipassSecret.slice(16, 32));
//     }

//     generateToken(customerData) {
//       // Store the current time in ISO8601 format.
//       // The token will only be valid for a small timeframe around this timestamp.
//       customerData.created_at = new Date().toISOString();

//       // Serialize the customer data to JSON and encrypt it
//       const plaintext = JSON.stringify(customerData);
//       const ciphertext = this.encrypt(plaintext);

//       // Create a signature (message authentication code) of the ciphertext
//       const signature = this.sign(ciphertext);

//       // Encode everything using URL-safe Base64 (RFC 4648)
//       const token = `${ciphertext}${signature}`;
//       const base64Token = btoa(token).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
//       return base64Token;
//     }

//     generateURL(token, domain) {
//       if (!domain) return;
//       return "https://" + domain + "/account/login/multipass/" + token;
//     }

//     encrypt(plaintext) {
//       const iv = CryptoJS.lib.WordArray.random(16);
//       const encrypted = CryptoJS.AES.encrypt(plaintext, this.encryptionKey, {
//         iv: iv,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7
//       });

//       // Convert the encrypted data to a hexadecimal string
//       return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Hex);
//     }

//     sign(data) {
//       const hmac = CryptoJS.HmacSHA256(data, this.signatureKey);

//       // Convert the HMAC to a hexadecimal string
//       return hmac.toString(CryptoJS.enc.Hex);
//     }
//   }

//   const [email, setEmail] = useState('');
//   const [remoteIp, setRemoteIp] = useState('');
//   const [returnTo, setReturnTo] = useState('');
//   const [url, setURLTo] = useState('Redirect URL will show up here!');

//   const handleEmailChange = useCallback((value) => setEmail(value), []);
//   const handleRemoteIpChange = useCallback((value) => setRemoteIp(value), []);
//   const handleReturnToChange = useCallback((value) => setReturnTo(value), []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const customerData = {
//         email: email,
//         remote_ip: remoteIp,
//       };
//       const multipassSecret = '079c31e72facb758d6ece0f1e383dda0';
//       const domain = "plus-partner-enablement-camp.myshopify.com";
//       const multipass = new ShopifyMultipass(multipassSecret);
//       const token = multipass.generateToken(customerData);
//       setURLTo(multipass.generateURL(token, domain).toString())
//       console.log('Generated token:', token);
//       console.log('Generated url:', url);
//       let res = await fetch("/multipass", {
//         method: "POST",
//         body: JSON.stringify({
//           token: token,
//           url: url,
//         }),
//       });
//       let resJson = await res.json();
//       console.log(res.status);
//       if (res.status === 200) {
//         setEmail("");
//         setRemoteIp("");
//         setReturnTo("");
//       } else {
//         setMessage("Some error occured");
//       }
//     } catch (err) {
//       console.log(err);
//     }
//     // console.log(res);
//     // redirect.dispatch(Redirect.Action.APP, '/multipass')
//   };

//   return (
//     <Page title="Multipass Login">
//       <Form onSubmit={handleSubmit} action="/multipass">
//         <FormLayout>
//           <TextField
//             value={email}
//             onChange={handleEmailChange}
//             label="Email"
//             type="email"
//           />
//           <TextField
//             value={remoteIp}
//             onChange={handleRemoteIpChange}
//             label="Remote IP"
//             type="text"
//           />
//           <TextField
//             value={returnTo}
//             onChange={handleReturnToChange}
//             label="Return to"
//             type="text"
//           />
//           <Button submit>Submit</Button>
//         </FormLayout>
//         <Card>
//           <Text as="h2" variant="bodyMd">
//             {url}
//           </Text>
//         </Card>
//       </Form>
//     </Page>
//   );
// }

// export default Multipass

import { useState, useCallback } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import { getSessionToken, authenticatedFetch } from "@shopify/app-bridge-utils";
import { Page, Card, Layout, Link, List, Badge, Checkbox, TextField, Button, Spinner, VerticalStack } from '@shopify/polaris';

import { _getShopFromQuery, _getAdminFromShop } from "../utils/my_util";

// Multipass sample
// See https://shopify.dev/docs/api/multipass
function Multipass() {
  const app = useAppBridge();
  const redirect = Redirect.create(app);

  const shop = _getShopFromQuery(window);

  const [secret, setSecret] = useState('');
  const secretChange = useCallback((newSecret) => setSecret(newSecret), []);

  const [result, setResult] = useState('');
  const [accessing, setAccessing] = useState(false);

  return (
    <Page title="Multipass SSO sample">
      <VerticalStack gap="5">
        <Card sectioned={true}>
          <Layout>
            <Layout.Section>
              <Link url="https://shopify.dev/docs/api/multipass" target="_blank">Dev. doc</Link>
            </Layout.Section>
            <Layout.Section>
              <List type="number">
                <List.Item>
                  <p>
                    Make sure your Multipass turned on in <Link url={`https://${_getAdminFromShop(shop)}/settings/customer_accounts`} target="_blank">Customer account settings</Link>. Copy your <Badge status='info'>Multipass secret</Badge> from there to paste to the following input.
                  </p>
                  <VerticalStack gap="5">
                    <TextField
                      label="Multipass secret"
                      value={secret}
                      onChange={secretChange}
                      autoComplete="off"
                      placeholder="c8b****************5e9"
                    />
                  </VerticalStack>
                </List.Item>
                <List.Item>
                  <Button primary onClick={() => {
                    setAccessing(true);
                    authenticatedFetch(app)(`/multipass?secret=${secret}`).then((response) => {
                      response.json().then((json) => {
                        console.log(JSON.stringify(json, null, 4));
                        setAccessing(false);
                        if (json.result.response.errors == 0) {
                          setResult('Success!');
                        } else {
                          setResult(`Error! ${JSON.stringify(json.result.response)}`);
                        }
                      }).catch((e) => {
                        console.log(`${e}`);
                        setAccessing(false);
                        setResult('Error!');
                      });
                    });
                  }}>
                    Add your secret to shop metafields
                  </Button>&nbsp;
                  <Badge status='info'>Result: <APIResult res={result} loading={accessing} /></Badge>
                </List.Item>
                <List.Item>
                  Open the <Link onClick={() => {
                    getSessionToken(app).then((sessionToken) => {
                      redirect.dispatch(Redirect.Action.REMOTE, { url: `https://${window.location.hostname}/multipass?sessiontoken=${sessionToken}`, newContext: true });
                    });
                  }}>mock login page with the session token
                  </Link> to test how Multipass SSO works.
                </List.Item>
              </List>
            </Layout.Section>
          </Layout>
        </Card>
      </VerticalStack>
    </Page>
  );
}

function APIResult(props) {
  if (props.loading) {
    return <Spinner accessibilityLabel="Calling Order GraphQL" size="small" />;
  }
  return (<span>{props.res}</span>);
}

export default Multipass