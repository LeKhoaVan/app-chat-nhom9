import { StyleSheet, Text, View, TouchableOpacity, FlatList,Image, Modal,TouchableWithoutFeedback} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Navigation} from '@react-navigation/native';
import ChattingScreen from './ChattingScreen';

import Conversation from '../components/Conversation'

export default function MessagesScreen({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const DATA=[
    {
      user_avt:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRqRyIiwYCq4s-fZi1zdmyfSuIPUvg9EyZ_Q&usqp=CAU',
      user_name:'Nguyễn Thái Nguyên',
      last_chat:'hiiiiiiiiiiiiiiiiiii',
      time_last_chat:'10:00',
    },
    {
      user_avt:'data:image/png;base64,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',
      user_name:'Nguyễn Thái Nguyên',
      last_chat:'hiiiiiiiiiiiiiiiiiii',
      time_last_chat:'10:00',
    },
    {
      user_avt:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADhCAMAAADmr0l2AAABblBMVEX////mOx/W4+sdGDj0qYHjjGHOdU0AADMAFTn3q4L7roQAFjnY5e3T4erlLQD+sIXtPB0YFTfkIADjkGTlNBPlMAsABTTkhlYUFzgACTTji2Dl7/boflfV6vMODzbTeE7MZTV2U1KluL/+9/b0sapiRUvI1t7wPR3qX03AhW3jnXvw9Pf86efvjYL3ysX86ObraFj2wbvwl43508+QKi1UIDTaOSHypp6mdGONYlrbmHjFiW84KT/voHbMaj/atarZ09K1xc3sdWb0t7DuhnrENCWbLCwnGTfTNyKpLyo7HDbpWEXoSjN6JjC5MidVPUeGXlhDMEKdbWAAACPlVjboeU+uZEjayMLcs7PgoobenpvesZ/rb2FHHjVqJDJbITOAJy/DfVyTXE7lZkMfCy6kn6daVWdzbn3Iw8k2PFe2tr8AABs2OFFbO0L/4NH4wad5eor4vqHKXirolHvFQy6AS0LbWjhwQkHfko3bu716j9qMAAARhUlEQVR4nO2di1/TShbH20AJSZ/pIyWBprdCwZaHKIqlUC2IVgUFqoiv615x1737uNfd63rV/37nkaTpi86ZpLR+Pvl9/Cg2pcm3Z+acMzMnk0DAly9fvnz58uXLly9fvnz58uXLly9f46n5lY2169fvLSDdu359bWNlftRX5JVWNhZW3x4mkWIO4f8fvl1d2FgZ9fW50crajfU04sqkgz2VziDQ4PqNtR/RmvNrq4fJvmidmIerPxbktYWrCG4wW0sIcn3hB2muK7cPkjEGy3VZMpY8WBh/O15f56KzGd+ujZrgIq3cyPDTmYzJ4I1xNePGXhLU7/opk9y/NmqWHtq4mnRpvJbSyfWNUfN0yEs8E3GcrHht3Vs8irg3LmFjft97PIp4Y9RoRPdgIR2iWOb6qOkC1w6Sw8LDSq6PuJ3eHk7rbCmdXBgh3spBbLh4WMmrIwv894ZtPqp0ckQ9cW+ovc+p5P4I8K4dDs15dit2cOnNdI25eSYSS4ngJhb6eSmRSPAQpmOXnLvdZmueCOf+gyc/N2amscIzjZ/f3Xz6cIkH83K96T4TXyLx9F0YYc1M2JqZCaNXEOaj+5sYH8CZXL08vnWm6JB41Jh2sE10YE7PPP7LLw+ePgwuMWLG9i6L74DFvSQePp7uSefknEGc4cfvHtwPskDGrl4K3vwhi3tZetTHej3tOR2+9SA4GDFzcBl8myx8iUeDzNdJGQ7fZCA8HBe++0A+rPDjzYGI6aHbkKl9BoNwPGzFmYcDCYfdSg+Y+JaehPkIw5sDPzuzPky+dbb0jKeBUsLHgz98mNFin210tPSY1YF2KfxkaeDHD28mgzU/g3pQp6bvDz5B8t5w+NYYh0cJfgOiRnprsAmDyaFk3iusfE9dGJDNhMHYMEZPjAEiuPSzCwMiEz5hSNqGEQ73WMe3D10ZEIkl9Y55PrS4xzo/kfiFLwbamn7Icpqkx8tsrB0QyVUDRQo/Yho9edwN2TKYoMsYQQEZkm6ktKcZzW3m+U9AkFcMTdUMpfPlmV/Yxr9eRsNrzA20R4xQNFEUVaMTTlSPtiqVSmFH7EBkBfSykV5lnuDtCvKGuLNVqlYrBUNVDUNBMgxVVHeOS5NxWZZkWd7e0XiaKGqkb73iY/agXT1QEYvVuCwhyfFqaatwdHJyVDiubCM4adKUJBfENsAHrDNRXnnSefYZ3g4DGhPb8RYIMlccCdnNfo0qfqw6Adm8KJE3gKvsgO09UCxOdqD0UfzI0UWZcjWq2G0v+Ng9TDDxxGlAsRBnwkPGLTsaKVugp0p64Wfesi8hJZz2U5n5JiflZsvRTA8e1dvKeLAqswFYQ3KmocaRzMyH1OqF0+znQyZ0X4uxDjDgI0caKpbZ+p9pwmO7F05Dli3SrucvIAZM3GxZUKyADChVVS5A9yYEGDCYeGf7GKUB4kMm3LESGlATdW1CiAGDiVs2oAozIALcstooxIsiJd2VYexBVuEdgCIMD7XRbStSAOIgVsbV0BcwDGwDVI7YQ4QlCxCSyWC5yrlvgNbhW4BaE9hCUTZjdUKmSRknoJt0BlYG03IyYgkSI4jkgh0ooMvb/HzXgYD2dIxYhQPaycz0Uxifi1lSSIzAgA9sQFCUJ5JKdidkHRCa4o8UMBcTdAwmVCgeTritUA/thPxuhn0mxtSmBShaBsSDwK7xn4PKcVhuWF7mHRSQd3aGeSrNUqJhRokJ6kRluVppNiulqiz3YJRkCR9ulsoyfrvtZcAW5J1gA7dQ240qJ/iKpclmQ1U1TVNVo7AtdwQOWSoVVBEfFtWdCrKi3QmngX2Qe1gIbqH2cILE+fi2otoTZoaIINoAmxOiHRcUcacq20MmaKTnbqPsc2m2zE5oFOTJeAVZTsSik5+KWnDYUD7Cs4V4ZpS+RVVLstVGgblakNePznNUSyboypK2hRqgVmyWtpFKlWZhBzdGZ2xEhxHaSaFZwW/ZrmwVtaq8TU0IG04QxXgAgVGeAj4QDWQGtSRJ28Q/khlDWY5PbjerbZ1Q3q5sS/HWe+JSVYqfYKtqjxmWQDvEFesBk2ktPXwfOjdIItPhNqVOP9r9AnEzym+h0AdwKWKGZ9n+kIMvPRcKvdAmDPvaa7UaMhL6uztKkIPIvI6DaNSrneuhFPjUPAui8CCBlQqF3qtGMW4RlCvHxeJxCTH24JOkEj5ambQQ5WNDfR8KpT6Az8sRKHi6YPAwFdJDogVYKxefqYZiGNpfqz2GT/K2ho4iT/qsYDZouWiIIaQ5sP/m6ISwoaCp58iCumJOyCAA7W8fkd8w/v7rP7rHT3LlH79+NPDRvz1TqYdF2VpDR4A6GJBjUMgRBYPBDxjwRBHL2GmUjY/z88+w4382H/hnuYNPqv4amP8XjvJaYPnfDXK4LCq/YcAQ+NwckZDrlg8C+JsibmODSPHfKQICnA986gT8FJhfpkcDgd9Jm5a2ReMrBkzBv9w0lA+wItENiAI97YS/Bz5qqAv+PTD/3y4vU/s0H/iooqP/CXyiB+UtzfiKDZiCV+aDvcwavwW/GvacU036dFwoFtb+W+s1Yqp9WkMHtz5Zw6n4kWJ8CfFZEOxl4Jm2BRj6YjhmDXEe02us1POoOGGc8/VBeL69z3Vb0p/YgjiVgU860UkL7ZzPi8JzGS4nSsPEuUaGE2DhBRgKCI+DcDfKg0cCPQFUFB7ACWVCe8ELCE3WOO8sw4AoGZ2ggQIkMnmvvQ9xpWrgOMGXiQbT+Pt/j4Z1xjHYhGSJUOUGTMIAQatKDsA5E9AxoGC2IB7PiwTwOQ8gbJVpg/PeVRQn9Pciz+Q9nXMiuXaK58zAQMg1lghSNxoSedaXUJTHkx0YMMvjwYE3GC7w3n2Mx0tk7kiFLU9IVTppiH6dqwsGY7AbffkSGdoJdTJFbY96GQ1YxF+LsqNzdkFoKsMLSDrhCZkOVSGRQqIzasoJAtS5boKNwe4Q5RruEiFA0psmlAYEkC5/4uEgXwu9NMDEhxQaTtAlpq3OWKjf0fE/NT3VcUBu0ilRPBzk8qHgMT2/BYN66gsFVJROE+r5fH5yMnTnzp2O0aGk0El+NFpK/TnugMHTc3Ottme+VpvsnmCzSyxQrv2cc3eFS+uDjrJm1VxvkUidKJ7GluV4uWz+QF4y31Ax112mH3FvHgEE5PaiWNbddWathVwqnOzs7JwUC83m8QlZkWgeF8lLhRJ9h7U+D193GQmgtdCrkXInuaiSWm1crK1qhob+WOXbiqEWyVtsCwJKKTsBYXGQO5PBSpi1CCQfNcvsFE1UjcbOUXFrq3h00jBUUWtFy9baJ3zdxQaEZTK8uSiRde8EKSaRt3DzM5RmdVKupbJ6TQplsylpstpUsLM1cCyx8rQZjoUlGxCWi/KOJoislWwN9y+SRGtFRKffcSgfqk0WNZy7kIyO9kFw+YFDwNEE53jQBLxJ2qiyg68dD/OUk9rnn/744yen/vhjKoVzOg13wjjN7qAVMm2AsPEg54jeBKRxgoyYSL25WK19no3Uz87uWjo7q8/W53DLJDVDdKw0EX7qAhDExz0nQ0XdKLEgjuGYdG6uPtuuN6c1zEWyAbMSz4UTBc/duziVXS8jluIkhuN4WDs9/XzWoqu/mTvVUXjQSOls3PSiDX4DgmfV+OZFLUDz/gmxIsULBjWSPjd3eqp/foP06jP6cW6OmtcoxKWK6UShFUBOQOi86L6rHZusXEZVi4pVmocIMSMW/mlu0uygSlG1wjx/HgOf2XaVygSX3llVa7hvmSsVoTmHQvQ10XwL4fsLfxSEr03wrS615LxLy16KCXXgteqYcQNtuDkfeHXJVZxA2my0CJ3VozVnxYXznqWZhiu/Bq9CcLup32bLho45UkmWHAUyrSJYlKW54uOoa3blRoluWfW/rQk2qVpBsicU43addviWu3NxrNG7GfJSJX6x62OtKhI0LkKybhqRq/a9Ei4CBBFHlYVbLxPEG1eFzfpRo2xWyGKTWYuHctmciZkJP3LhP4k46mR4ig07ldj82SwgRWNf3PXI5BKZjJJklMZQvvDjwTsdDQQE8/HVqnUj3pymFOLEVlWOH5NhkVaIy9WtBm2fCrzAt1tpnh3XuKoNu7T0P/MucjSkR2i0y+EVUtN82s7/3DZPpAzP3S8edEKs5/kvmpWr2BXO9gvql7wXLYWrXtSLToj0fCo/9ZvasduBiacdoYNeAHJV/ELve+mj51NTU/kXDa2bT2u8yKODXGtJ7eK898XVzJqtP6cwYf5c6djNwlDO85jPC0DgjJolt+koFQFEiFNfFK3VBzXly1SeHvEAkPd2evCdL71kAmLE8x2VxkF159zCm5riXGxxiHvXDk/a6IcpW/n8i68NVW18fZHPt151D8jZQj1KZu5MTTkR8+ZfLf3kHpD7JlfALg99AdtgeumO20Qmzb/fA+teeBcppQ8idHsGN/vkubcgrsMfMqCbXWPdTT1hkRLZi5upyzgBXBhsl2s3kz7FpUsXG5GvqqIF6GpPGb7C35YSIVMXGdGVl+G6baklvuL7lkjt2iAjukq3Xe5l4TJSkPLKQYj5UxfncBEjqFwtFJIS50GIed7SHyL3WwK5MWGbAfsgctZoW2dwv6mTi16YPk11AiLEfCdeKJTibqRueyAWaEuZNs314DMhiXTdeiF1yudJ3W0mY4q3Pv253o+vh1I66w67bfJm/8YbPHcrB3s1zwsRTzPgaTxvdsbjyEhjmQ8pIF8olD37FgN+lV49u+A6bOOjWPB1PQvFQ4BCTvgGegKld9ttA+bXMsmDl7lcLqQPJmqXXs4JQu7KywPmxwFlvNv0ntXPpGOZ1fruYkTIvQEDZu9GhMjibi53th9jM6OX2xgvMBCmY7G3LyM5dJERQYC30awgCBH85URywst1BkZvHxg2aDmU0Am5HL7KK+ivXBloQv1VDv8q+m7wb+eE14Med+thA8Wav8C/pZFn2DfpbDOcAU2YrQsCNb5gMb7c6/8YbXRWj7e77+NJEVzs6rfvuZx9ZYIQxXYAmtA0YNTxMYgx8v3bQR9I7x9Y0P0wDdQskwhOaKOzTQjrhaQHLl5p/yD0Ejbkt4Pup4bHhvBQDcc8N7Zb7HDv9fdIJxy5KmrCNwDC7F1iwMXuD6OQ31/vbaJTpq1L4FrwHCSrG+JGufoaG64HXMuEQiTF3EhJDHT2wB6QucXvr/evxugTVb3ugFRk7BsLfsN268dGFb1C/skyEuopAtHeA3tTRr6vpmNebHzbUwvJTPB15GI2einEGKgbMhHqeh2/e7e/AdsohdfDe2Tm6r6QY7gIqzuxEepZwtftYfoptzwsvkBglvEaBIG0t0hdH0iopwhfdFADbWl2eHyBAOtFoAsW8HULtQG+NFsWyGf29qA9P3qYfIgwyngZi4QQR4sLjKiT+NA3QoyAj4OwXu6HqGdf1Un2Ok58IELarXJnCLGLUdez1To1X3Ss+AD9cNG88Eiu/iaUdUAiuGzqTZ0GHPtt48IH8jS7EXMAFKnffZXKmkq9umvSoea5y+4/L4kPEC3Q1S9GLBKUU9axhFZ6HkHms76DgYoONT50EDL2Q2TEFmL3QXyU2XyXyRcILLMS4i6GEbswIhHzCCvfEPOXnoSsgNROu4uYiNKQH1C6il5kxxMumS/A7mqosXavIJ7FxWhUiKJ/yP8EZrxLdC9OMXdEyhhd3N1FYAhtd3cx2qPR9tfldr+WlgUAotU0I3ZTZcYbQfO0xJrVuFF0JM3T0nJ0yIijNB/VcI04qt7nFHvA4NCozUc1O6x2OgbmMzUExOg4tE6HIt4ijhse0rKXVhw/PCJIavMD4mGh3MYlZDQaGQ/P2U/L7swYnR1vPKJlFPs5KNEvjbnxHFqOQBGjwo9gO6eWZ3HkYMCM4n73o9GZWqaU/TCjAmX7MeFsIcpZ1GKjTv9K/heZ/eHZ2rXs0KivxZcvX758+fLly5cvX758+fLly5cvX/31f8rolgDByjy0AAAAAElFTkSuQmCC',
      user_name:'Nguyễn Thái Nguyên',
       last_chat:'hiiiiiiiiiiiiiiiiiii',
      time_last_chat:'10:00',
    },
    {
      user_avt:'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGVuc3xlbnwwfHwwfHw%3D&w=1000&q=80',
      user_name:'Nguyễn Thái Nguyên',
      last_chat:'hiiiiiiiiiiiiiiiiiii',
      time_last_chat:'10:00',
    },
    {
      user_avt:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNGZDlgqu5WAs9WAV_HS8wqpmneintd0grew&usqp=CAU',
      user_name:'Nguyễn Thái Nguyên',
      last_chat:'hiiiiiiiiiiiiiiiiiii',
      time_last_chat:'10:00',
    },
    {
      user_avt:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7w-VUkvVobuC_P3TImDJalLsfOGGijkNRmA&usqp=CAU',
      user_name:'Nguyễn Thái Nguyên',
      last_chat:'hiiiiiiiiiiiiiiiiiii',
      time_last_chat:'10:00',
    },
    {
      user_avt:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnPGqX4s6HDBoVTLwIhy3fFmdxvMiDIfUtdA&usqp=CAU',
      user_name:'Nguyễn Thái Nguyên',
      last_chat:'hiiiiiiiiiiiiiiiiiii',
      time_last_chat:'10:00',
    },
    {
      user_avt:'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGVuc3xlbnwwfHwwfHw%3D&w=1000&q=80',
      user_name:'Nguyễn Thái Nguyên',
      last_chat:'hiiiiiiiiiiiiiiiiiii',
      time_last_chat:'10:00',
    },
    {
      user_avt:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvR2EmeDnAttbXXbBr_HtCX1qjGmUoSlP1_Q&usqp=CAU',
      user_name:'Nguyễn Thái Nguyên',
      last_chat:'hiiiiiiiiiiiiiiiiiii',
      time_last_chat:'10:00',
    },
    {
      user_avt:'data:image/jpeg;base64,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',
      user_name:'Nguyễn Thái Nguyên',
      last_chat:'hiiiiiiiiiiiiiiiiiii',
      time_last_chat:'10:00',
    },
  ]
  return (
      <View style={styles.container}>
        <FlatList
          data={DATA}
          renderItem={({item})=>(
            <TouchableOpacity
             onPress={()=> navigation.navigate('ChattingScreen')}
             onLongPress={()=>setModalVisible(currentValue => !currentValue)}
             > 
              <Conversation
                item={item}
                />
            </TouchableOpacity>
          )}/>
    <Modal
                        visible={modalVisible}
                        transparent={true}
                        onRequestClose={() => setModalVisible(false)}
                        animationType='slide'
                        hardwareAccelerated>
                        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                            <View style={styles.centered_view} >
                                <View style={styles.modal_cont}>
                                    <Text style={styles.modal_title}>Tải lên hình ảnh</Text>
                                    <View style={styles.modal_body}>
                                        <TouchableOpacity
                                            onPress={() => openCamera()}
                                            style={styles.choose}>
                                            <Ionicons name='camera-outline' size={26} color={'#056282'}/>
                                            <Text style={styles.text_choose}>Chụp ảnh mới</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => showImagePicker()}
                                            style={styles.choose}>
                                            <Ionicons name='images-outline' size={26} color={'#056282'}/>
                                            <Text style={styles.text_choose}>Chọn ảnh từ thiết bị</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setModalVisible(false)}
                                            style={styles.choose}>
                                            <Ionicons name='close-circle-outline' size={26} color={'#056282'}/>
                                            <Text style={styles.text_choose}>Hủy</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
    </Modal>
      </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  //demo
  centered_view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000099',
  },
  modal_cont: {
    width: 300,
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  modal_title: {
    borderBottomWidth:1,
    borderBottomColor:'#D0D4D3',
    padding:10,
    fontSize:20,
    fontWeight:'500',
  },
  modal_body:{
    padding:20,
  },
  choose:{
    height:50,
    justifyContent:'flex-start',
    alignItems:'center',
    flexDirection:'row',
  },
  text_choose:{
        marginLeft:15,
        fontSize:16,
  }
})

