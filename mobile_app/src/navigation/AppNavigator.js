import { NavigationContainer } from '@react-navigation/native';
import React, { useContext } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import RootNavigator from './RootNavigator';

export default function AppNavigator() {
  const{userToken,isLoading}=useContext(AuthContext)
  if (isLoading){
    return(
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text>Đang tải..</Text>
            <ActivityIndicator size={'large'}/>
        </View>
    );
  }
  return (
      <NavigationContainer>
            {userToken !== null ?<RootNavigator/>:<AuthNavigator/>}
	    </NavigationContainer>
       
  );
}

