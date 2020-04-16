import React from 'react';
import Main from './pages/Main';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import '@aws-amplify/ui/dist/style.css';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

function App() {
  return <Main />;
}

export default withAuthenticator(App, true);
