import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  StackActions,
} from '@react-navigation/native';
import React, { type ComponentType } from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

type ParamList = {
  route: RouteProp<ParamListBase, string> & { params?: Record<string, string> };
  navigation: NavigationProp<ParamListBase>;
};

const targetUrl = 'http://localhost:3000';

const WebviewContainer: ComponentType<ParamList> = ({ navigation, route }) => {
  const url = route.params?.url ?? targetUrl;

  const requestOnMessage = async (e: WebViewMessageEvent): Promise<void> => {
    const nativeEvent = JSON.parse(e.nativeEvent.data);

    if (nativeEvent?.type === 'ROUTER_EVENT') {
      const { path } = nativeEvent;
      if (path === 'back') {
        const popAction = StackActions.pop(1);
        navigation.dispatch(popAction);
      } else {
        const pushAction = StackActions.push('WebViewContainer', {
          isStack: true,
          url: path,
        });

        navigation.dispatch(pushAction);
      }
    }
  };

  return (
    <WebView
      originWhitelist={['*']}
      source={{ uri: url }}
      onMessage={requestOnMessage}
    />
  );
};

export default WebviewContainer;
