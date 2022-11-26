import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import GroupSearch from '../components/GroupSearch';
import AntDesign from 'react-native-vector-icons/AntDesign'

export default function GroupsScreen({navigation}) {
  const [listGroup, setListGroup] = useState([])
  const { userInfo, setListUserGroupNew, conversations } = useContext(AuthContext);
  useEffect(() => {
    const loadGroup = async () => {
      let listG = []
      conversations.forEach((c) => {
        if (c.name != null) {
          listG.push(c)
        }
      });
      setListGroup(listG)
    }
    loadGroup();
  }, [conversations])

  return (
    <View
      style={{
      }}>
      <TouchableOpacity
        style={{
          flexDirection:'row',
          alignItems:'center',
          backgroundColor:'#fff',
          padding:10,
        }}
        onPress={() => {
          navigation.navigate('CreateGroup')
          setListUserGroupNew([]);
        }}>
        <AntDesign name='addusergroup' size={30} color={'#056282'} 
          style={{
              backgroundColor:'#EAFAF8',
              borderRadius:100,
              padding:5,
              marginRight:15,
          }}/>
        <Text style={{
          fontSize:16,
        }}>Tạo nhóm mới</Text>
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 15,
          padding:10,

        }}>
        Nhóm đã tham gia ({listGroup.length})
      </Text>
      <ScrollView>
        {listGroup.map((g) => (
          <GroupSearch key={g._id} item={g} />
        ))
        }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({})