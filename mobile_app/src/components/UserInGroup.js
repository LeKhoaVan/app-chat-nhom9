import { Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import Ionicons  from 'react-native-vector-icons/Ionicons'

export default function UserInGroup({user}) {
    const {userInfo,currentChat,authorize} = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
  return (
    <TouchableOpacity 
        style={{flexDirection:'row',alignItems:'center',paddingHorizontal:20,paddingVertical:10}}
        onLongPress={()=>setModalVisible(user._id==userInfo._id ? false:true)}>
        <Image source={{uri:user.avt}}
                style={{width:50,height:50,borderRadius:100,marginRight:20}}/>
        <View>
            <Text  style={{fontSize:17}}>{user.username==userInfo.username?"Bạn":user.username}</Text>
            <Text>{authorize.map( (auth)=>(
                              auth===user._id ? "Quản trị viên" : ""
                            ))}</Text>
        </View>
        {user._id!=userInfo._id?
            <Ionicons name='person-add-outline' size={20} color={'#056282'} style={{marginLeft:'auto'}}/>
            :<></>}
        <Modal
                        visible={modalVisible}
                        transparent={true}
                        onRequestClose={() => setModalVisible(false)}
                        animationType='slide'
                        hardwareAccelerated>
                        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                            <View style={styles.centered_view} >
                                <View style={styles.modal_cont}>
                                    <View
                                        style={styles.modal_title}>
                                        <Text style={{fontSize:18,fontWeight:'400',textAlign:'center'}}>Thông tin thành viên</Text>
                                        <Ionicons name='close-outline' size={26}  />
                                    </View>
                                    <TouchableOpacity
                                        style={styles.info}>
                                        <Image source={{uri:user.avt}}
                                            style={{width:50,height:50,borderRadius:100,marginRight:20}}/>
                                        <Text  style={{fontSize:17,fontWeight:'500'}}>{user.username==userInfo.username?"Bạn":user.username}</Text>
                                        <Ionicons name='chatbubble-ellipses-outline' size={26} color={'#056282'} 
                                            style={{marginLeft:'auto',}}/>

                                    </TouchableOpacity>
                                    <View
                                        style={styles.modal_body}>
                                        <TouchableOpacity
                                            style={styles.choose}>
                                            <Text style={styles.text_choose}>Xem trang cá nhân</Text>
                                        </TouchableOpacity>
                                        {authorize.map( (auth)=>(
                                            auth != userInfo._id || user._id == userInfo._id ?  
                                            <></> :
                                            <View> 
                                                {authorize.some( (auth1)=>( 
                                                    auth1 === user._id)) ? 
                                                    <></> : 
                                                    <TouchableOpacity
                                                        key={user._id}
                                                        style={styles.choose}>
                                                        <Text style={styles.text_choose}>Chỉ định quản trị viên</Text>
                                                    </TouchableOpacity>
                                                } 
                                        
                                                {authorize.map( (auth1)=>( 
                                                    auth1 === user._id ?
                                                    <TouchableOpacity
                                                        key={user._id}
                                                        style={styles.choose}>
                                                        <Text style={styles.text_choose}>Gỡ quyền quản trị viên</Text>
                                                    </TouchableOpacity>:<></>
                                                ))}
                                        
                                                <TouchableOpacity
                                                    style={styles.choose}>
                                                    <Text style={[styles.text_choose,{color:'#FD2828'}]}>Xóa khỏi nhóm</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
    </TouchableOpacity>
    
  )
}

const styles = StyleSheet.create({
    centered_view: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'flex-end',
        backgroundColor: '#00000099',
      },
      modal_cont: {
        width: "100%",
        backgroundColor: '#ffffff',
        borderTopStartRadius:20,
        borderTopEndRadius:20,
      },
      modal_title: {
        borderBottomWidth:1,
        borderBottomColor:'#F5F5F5',
        padding:15,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
      },
      info: {
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'#F5F5F5',
        padding:10,
      },
      modal_body:{
        padding:10,
      },
      choose:{
        height:50,
        justifyContent:'flex-start',
        alignItems:'center',
        flexDirection:'row',
      },
      text_choose:{
            fontSize:16,
      }
})