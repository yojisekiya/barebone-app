import { useAppBridge } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import { Page, Form, FormLayout, TextField, Button, Card, Text } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import "@shopify/shopify-api/adapters/node";
import { shopifyApi, ApiVersion, Session } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-04";
import { process } from 'process';
// import 'dotenv/config'

function Fulfillment() {
  const app = useAppBridge();
  const redirect = Redirect.create(app);

  const [locationId, setLocationId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [lineItemsToFulfill, setLineItemsToFulfill] = useState('');
  const [trackingUrlBase, setTrackingUrlBase] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleLocationIdChange = useCallback((value) => setLocationId(value), []);
  const handleOrderIdChange = useCallback((value) => setOrderId(value), []);
  const handleLineItemsToFulfillChange = useCallback((value) => setLineItemsToFulfill(value), []);
  const handleTrackingUrlBaseChange = useCallback((value) => setTrackingUrlBase(value), []);
  const handleTrackingNumberChange = useCallback((value) => setTrackingNumber(value), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form submitted");
      // const getResources = () => {
      //   const shopify = shopifyApi({
      //     apiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
      //     apiSecretKey: import.meta.env.VITE_SHOPIFY_API_SECRET,
      //     apiVersion: ApiVersion.April23,
      //     scopes: import.meta.env.VITE_SHOPIFY_API_SCOPES,
      //     isCustomStoreApp: false,
      //     isEmbeddedApp: true,
      //     hostName: import.meta.env.VITE_SHOPIFY_HOST,
      //     // Mount REST resources.
      //     // restResources,
      //   });
      // }
      // getResources();
      // const shopify = shopifyApi({
      //   apiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
      //   apiSecretKey: import.meta.env.VITE_SHOPIFY_API_SECRET,
      //   apiVersion: ApiVersion.April23,
      //   scopes: import.meta.env.VITE_SHOPIFY_API_SCOPES,
      //   isCustomStoreApp: false,
      //   isEmbeddedApp: true,
      //   hostName: import.meta.env.VITE_SHOPIFY_HOST,
      //   // Mount REST resources.
      //   // restResources,
      // });
      // console.log(shopifyApi);
      // console.log(import.meta.env.VITE_SHOPIFY_API_KEY);
      // console.log(process);
      console.log("after shopify");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Page titll="Fulfillment">
      <Form onSubmit={handleSubmit} action="/fulfillment">
        <FormLayout>
          <TextField
            value={locationId}
            onChange={handleLocationIdChange}
            label="Location ID"
            type="text"
          />
          <TextField
            value={orderId}
            onChange={handleOrderIdChange}
            label="Order ID"
            type="text"
          />
          <TextField
            value={lineItemsToFulfill}
            onChange={handleLineItemsToFulfillChange}
            label="Lineitems to Fulfill"
            type="text"
          />
          <TextField
            value={trackingUrlBase}
            onChange={handleTrackingUrlBaseChange}
            label="Tracking URL Base"
            type="text"
          />
          <TextField
            value={trackingNumber}
            onChange={handleTrackingNumberChange}
            label="Tracking Number"
            type="text"
          />
          <Button submit>Submit</Button>
        </FormLayout>
      </Form>
    </Page>
  );
}

export default Fulfillment