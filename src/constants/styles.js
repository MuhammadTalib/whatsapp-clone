import {StyleSheet} from 'react-native';
import  ThemeColors from "./ThemeColors";
const styles = StyleSheet.create({
  picture: {
    ...StyleSheet.absoluteFillObject
  },
  container: {
    // height:"100vh",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  input: {
    position:"relative",
    // top:-12,
    padding: 5,
    paddingLeft:20,
    borderWidth: 1,
    marginLeft:0,
    borderColor: '#dedede',
    borderRadius:20,
    width: '64%',
    fontSize:17,
    height:50,
    // marginBottom: 10,
    // borderRadius: 5,
    color: '#000000',
  },
  
  btnTextSubmit: {
    marginTop: 10,
    color: 'darkblue',
    fontSize: 26,
    alignContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'darkblue',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  btnTextUpdate: {
    marginTop: 10,
    color: 'green',
    fontSize: 20,
    alignContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  btnTextLogout: {
    marginTop: 30,
    color: 'red',
    fontSize: 20,
    alignContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  
  headerTitle: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#00A398',
  },
  
  timestamp_class: {
    position:"absolute",
    top:"51%",
    left:"110%",
    // backgroundColor:"red",
    // textAlign:"bottom",
    height: 20,
    color: '#eee',
    // padding: "3px", 
    fontSize: 11
  },
  seen_class:{
    position:"absolute",
    top:"52%",
    left:"130%",
    height: 20,
    color: '#eee',
    fontSize: 13
  },
  fab:{
    backgroundColor: ThemeColors.secondary
  },
  send:{
    fontSize: 35,
    // marginBottom:10
  },
  voiceicon:{
    fontSize: 35,
    marginTop:5
    // marginBottom:20
  },
  cameraicon:{
    color:"black",
    fontSize: 20,
    marginTop:5
    // marginBottom:20
  },
  attachicon:{
    fontSize: 20,
    marginTop:5,
    // marginBottom:20,
    marginLeft:0
  },
  playIcon:{
    fontSize:16,
    marginBottom:-40
  },
  downloadIcon:{
    position:"absolute",
    backgroundColor:"#fefefe",
    height:30,
    width:30,
    marginTop:7,
    marginLeft:130,
    fontSize: 10,
  },
  list:{
    padding: 10, 
    // paddingBottom: 100,
    // height: 100
  },
  image_message:{
    width: 40,
    height: 40
  },
  superscript:{
  }
});

export default styles;
