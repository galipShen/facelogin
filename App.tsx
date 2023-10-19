import React from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';

function App(): JSX.Element {
  function alert(_arg0: string) {
    throw new Error('Function not implemented.');
  }

  return (
    <View style={styles.container}>
      <View style={styles.socialBox}>
        <Pressable
          style={styles.googleButton}
          // title={'Sign in with Google'}
          onPress={() => {
            GoogleSignin.configure({
              androidClientId:
                '596708267102-kd3o2dg1cfh4d7grv35j3s6rivohdrja.apps.googleusercontent.com',
              iosClientId: 'ADD_YOUR_iOS_CLIENT_ID_HERE',
            });
            GoogleSignin.hasPlayServices()
              .then(hasPlayService => {
                if (hasPlayService) {
                  GoogleSignin.signIn()
                    .then(userInfo => {
                      console.log(JSON.stringify(userInfo));
                    })
                    .catch(e => {
                      console.log('ERROR IS: ' + JSON.stringify(e));
                    });
                }
              })
              .catch(e => {
                console.log('ERROR IS: ' + JSON.stringify(e));
              });
          }}>
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </Pressable>
        <LoginButton
          style={styles.defaultButtonStyle}
          onLoginFinished={(error, result) => {
            if (error) {
              alert('login has error: ' + result.error);
            } else if (result.isCancelled) {
              alert('login is cancelled.');
            } else {
              AccessToken.getCurrentAccessToken().then(data => {
                let accessToken = data.accessToken;
                alert(accessToken.toString());

                const responseInfoCallback = (error, result) => {
                  if (error) {
                    console.log(error);
                    alert('Error fetching data: ' + error.toString());
                  } else {
                    console.log(result);
                    alert('Success fetching data: ' + result.toString());
                  }
                };

                const infoRequest = new GraphRequest(
                  '/me',
                  {
                    accessToken: accessToken,
                    parameters: {
                      fields: {
                        string: 'email,name,first_name,middle_name,last_name',
                      },
                    },
                  },
                  responseInfoCallback,
                );

                // Start the graph request.
                new GraphRequestManager().addRequest(infoRequest).start();
              });
            }
          }}
          onLogoutFinished={() => alert('logout.')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
    justifyContent: 'center',
  },
  socialBox: {
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: 'blue',
    height: '15%',
    width: '100%',
    justifyContent: 'center',
  },
  googleButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  defaultButtonStyle: {
    height: '15%',
    width: '100%',
  },
});

export default App;
