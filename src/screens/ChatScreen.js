import React, {Component} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image
} from 'react-native';
import { IconButton, Colors } from 'react-native-paper';
import * as MediaLibrary from 'expo-media-library';
import { Container } from "native-base";
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import styles from '../constants/styles';
import Toast from 'react-native-simple-toast';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import MyHeader from "../components/MyHeader"
import { getToken } from '../helpers/manageTokens';
import * as FileSystem from 'expo-file-system';

export default class ChatScreen extends Component {
  recording = null
  sound=null
  style={
    navigateToChat: false
  }
  itemsRef = null
  constructor(props) {
    super(props);
    this.state = {
      person: {},
      textMessage: '',
      messageList: [],
      soundMessage: null,
      user:null,
      hasCameraPermission: null,
      hasCameraRollPermission: null,
      uuid:null,
      imageSelected:false,
      result:null,
      viewImage:false,
      playStart:false
    };
  }
  callback=(snapshot)=>{
    console.log("still calling callback??")
    if (snapshot.exists()) {
      data = Object.entries(snapshot.val()).map(m=>{
        return m[1]
      }).reverse()
      this.setState({messageList: data})

      Object.entries(snapshot.val()).map(m=>{
        if(m && m[1] && m[1]?.sender === this.props.route.params.currentUser.uid && !m[0].seen)
          firebase.database()
          .ref('messages/'+this.props.route.params.currentUser.chatkey+"/"+m[0]).update({
            seen: true
          })
      })
    }
    else {
      console.log("error234")
      return []
    }
  }
  async componentDidMount(){
    let user = JSON.parse(await getToken())
    this.setState({user})

    let data = []
    this.itemsRef = firebase.database().ref('messages/'+this.props.route.params.currentUser.chatkey)

    await this.itemsRef.on('value',this.callback)

    this.setState({messageList: data})
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraPermission: (status === "granted") });
  }
  componentDidUpdate(){
    console.log("wfe44ghjghjgh",this.props.route.params.currentUser.chatkey)
  }
  componentWillUnmount(){
    console.log("componentWillUnmount")
    this.itemsRef.off('value', this.callback);
  }
  downloadFile(uri){
    // const uri = uri
    let fileUri = FileSystem.documentDirectory + "small.mp4";
    FileSystem.downloadAsync(uri, fileUri)
    .then(({ uri }) => {
        this.saveFile(uri) ;
        Toast.show("File Downloaded Successfully!")
      })
      .catch(error => {
        console.error(error);
      })
  }
  saveFile = async (fileUri) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(fileUri)
        await MediaLibrary.createAlbumAsync("Download", asset, false)
    }
  }
  startRecording=async ()=>{
    console.log("start Recordinhg")
    Toast.show("Start Recording")
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      console.log('Starting recording..');
      this.recording = new Audio.Recording();
      await this.recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await this.recording.startAsync(); 
      // this.setState({recording:recording});
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  stopRecording=async ()=>{
    Toast.show('Stopping Recording');
    // this.setState({recording:null});
    await this.recording.stopAndUnloadAsync();
    const uri = this.recording.getURI(); 
    this.setState({result:{uri}})

    console.log('Recording stopped and stored at', uri);
  }
  handleChange = key => val => {
    this.setState({[key]: val});
  };
  // downloadFile = (FILE_URL) => {
   
  //   // let date = new Date();
  //   // let file_ext = this.getFileExtention(FILE_URL);
   
  //   // file_ext = '.' + file_ext[0];
  //   // const { config, fs } = RNFetchBlob;

  //   // let RootDir = fs.dirs.PictureDir;
  //   // let options = {
  //   //   fileCache: true,
  //   //   addAndroidDownloads: {
  //   //     path:
  //   //       RootDir+
  //   //       '/file_' + 
  //   //       Math.floor(date.getTime() + date.getSeconds() / 2) +
  //   //       file_ext,
  //   //     description: 'downloading file...',
  //   //     notification: true,
  //   //     // useDownloadManager works with Android only
  //   //     useDownloadManager: true,   
  //   //   },
  //   // };
  //   // config(options)
  //   //   .fetch('GET', FILE_URL)
  //   //   .then(res => {
  //   //     // Alert after successful downloading
  //   //     console.log('res -> ', JSON.stringify(res));
  //   //     alert('File Downloaded Successfully.');
  //   //   });
  // };
  convertTime = time => {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    // if (c.getDay() !== d.getDay()) {
    //   // result = d.getDay() + ' ' + d.getMonth() + ' ' + result;

    // }
    return result;
  };

  sendMessage = async () => {
    let m = {
      textMessage:this.state.textMessage,
      timestamp: Date.now(),
      sender: this.state.user.uid,
      seen: false,
    }    
    if(this.props.route.params.currentUser.group) m['sender_name'] = this.state.user.username
    if(this.state.result?.uri) m['uri'] = this.state.result?.uri;
    let type_m = this.state.result?.uri?.split(".")?.pop();
    if(type_m){
      let n = this.state.result.name
      if(n) m['name'] = n
      m['type'] = type_m;
    }
    let mess = this.state.messageList;
    mess.unshift(m)
    this.setState({uuid:null,textMessage: '',messageList:mess,imageSelected:null,result:null});

    if(this.state.result) this.uploadImageToStorage(this.state.result.uri).then(uri=>{
        
        uri &&( m['uri'] = uri)
        console.log("message",m)
        firebase.database().ref('messages/'+this.props.route.params.currentUser.chatkey).push(m).then(m=>{

        }).catch(err=>{
          console.log("err",err)
          Toast.show(err);
        })
    })
    else {
      firebase.database().ref('messages/'+this.props.route.params.currentUser.chatkey).push(m).then(m=>{

      }).catch(err=>{
        console.log("err",err)
        Toast.show(err);
      })
    }

  };

  _selectPicture= async ()=> {
    const result = await ImagePicker.launchImageLibraryAsync()
    if (!result.cancelled) {
    }
  }

  _takePicture= async ()=> {
    const result = await ImagePicker.launchCameraAsync()
    this.setState({imageSelected:true, result:result}) 
    
  }
  _pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    console.log("result",result)
    this.setState({imageSelected:true, result:result})
    // this.uploadImageToStorage(result.uri).then(res=>{
    //   this.setState({uuid:res})
    // })
  }

  uploadImageToStorage= (path) => {
    var uuid = this.create_UUID()
    return new Promise((resolve,rej)=>{
      this.uriToBlob(path).then(blob=>{
        let reference = firebase.storage().ref(uuid);        
        reference.put(blob).then((res) => { 
          
            firebase.storage().ref(uuid).getDownloadURL().then(uri=>{
              console.log("uri",uri)
              console.log('Image uploaded to the bucket!',res);
              resolve(uri)
            }).catch(err=>{
              rej(null)
            });  
        }).catch((e) => console.log('uploading image error => ', e));
      }).catch((err)=>{
        rej(null)
      })})
  }
  // saveToGallery = (imgUrl) => {
  //   RNFetchBlob.config({
  //     fileCache: true,
  //     appendExt: 'png',
  //     indicator: true,
  //     IOSBackgroundTask: true,
  //     path: path,
  //     addAndroidDownloads: {
  //       useDownloadManager: true,
  //       notification: true,
  //       path: path,
  //       description: 'Image'
  //     },

  //   }).fetch("GET", imgUrl).then(res => {
  //     console.log(res, 'end downloaded')
  //   });
  // }

  create_UUID=()=>{
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function() {
        reject(new Error('uriToBlob failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  }
  _setImage=(uri)=> {
    // this.setState({uri})
  }
 
  getDownloadURL= async (uuid)=>{
    let url='https://firebasestorage.googleapis.com/v0/b/chatroom-93691.appspot.com/o/0f472440-ce7b-455b-888a-7e8200cefd0c?alt=media&token=2e6298cc-0340-4e86-ae20-433ae37cb36d'
    await firebase.storage().ref(uuid).getDownloadURL().then(res=>{
      console.log(res)
      url = res
    }).catch(err=>{
    });  
    return url
  }
  openViewImage=(uri)=>{
    // this.setState({viewImage:true}) 
    // this.props.navigation.navigate('ViewImage', { uri: uri } )
  }
  playSound=async(uri)=> {
    console.log("uri", uri)
    this.setState({playStart:true})
    console.log('Loading Sound');
    this.sound = await Audio.Sound.createAsync(
      { uri: uri },
      { shouldPlay: true },
    );
    
    console.log('Playing Sound');
    await this.sound.playAsync() ; 
  }
  pauseSound=async(uri)=>{
    console.log("pause", uri)

    this.setState({playStart:false})
    this.sound.pauseAsync()
  }

  renderRow = ({item}) => {
    return (
      <View style={{
        width: '70%',
        alignSelf: item.sender === this.state.user.uid ? 'flex-end' : 'flex-start',
        backgroundColor: item.sender === this.state.user.uid ? '#00A398' : '#7cb342',
        borderRadius: 10,
        marginBottom: 10
      }}>
        {/* {item.sender_name && <Text>{item.sender_name}</Text>} */}
        {(item.uri && item.type==="m4a") && <View>
        {!this.state.playStart?<IconButton
            icon="play"
            color={Colors.black}
            size={30}
            // style={styles.playIcon}
            onPress={()=>this.playSound(item.uri)}
          />:<IconButton
          icon="pause"
          color={Colors.black}
          size={30}
          // style={styles.playIcon}
          onPress={()=>this.pauseSound(item.uri)}
        />}
        </View> }
        {(item.uri && item.type==="jpg") && <Image 
            source={{ uri: item.uri }}  
            style={{ position:"relative", width: '100%', height: 200, marginTop:20 }}
          ></Image>}
        {(item.uri && item.type!=="jpg" && item.name) &&<View>
          <Text style={{
            color:"white",
            marginBottom:-65,
            fontSize:16,
            padding:10,
          }}>{item.name}
          </Text>
          <IconButton
            icon="download"
            color={Colors.black}
            size={20}
            // style={styles.downloadIcon}
            onPress={()=>this.downloadFile(item.uri)}
          />
          </View>}

          <View
            style={{
              width: '70%',
              borderRadius: 10,
              marginBottom: 10
          }}>
            <Text style={{ color: '#fff', padding: 7, fontSize: 16 }}>
              {item.textMessage}
            </Text>
            <Text style={styles.timestamp_class}>
              {this.convertTime(new Date(item.timestamp))}
            </Text>
            {item.sender !== this.props.route.params.currentUser.uid?<Text style={styles.seen_class}>
              {item.seen?<Feather name="check-circle"  style={styles.seen_class}/>:<Ionicons style={styles.seen_class} name="md-checkmark"/>}
            </Text>:<Text></Text>}
          </View>
      </View>
    );
  };
  
  render() {
    // if(this.state.navigateToChat) return <ChatScreen currentUser={this.state.currentUser} />
    let {height, width} = Dimensions.get('window');
    return (
      <Container>
        <MyHeader showGoBack={true} showSearch={false} title = {this.props.route.params.currentUser.username} navigation={this.props.navigation}/>
        <FlatList
          inverted={1}
          // contentContainerStyle={{ flex: 1, justifyContent: 'flex-end' }}     
          style={{
            // marginTop:10,
            position:"relative",
            padding: 10, 
            paddingBottom:100,
            height: (height-10) * 0.8,
            // marginBottom: -10,
            // display: "flex",
            // flexDirection: "column-reverse"
          }}
          data={this.state.messageList}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
        />
        <View
          style={{
            position:"relative",
            // marginTop: -50,
            flexDirection: 'row',
            height:50,
            backgroundColor:"#efefef",
            // marginBottom:10,
            alignItems: 'center',
            // marginHorizontal: 5,
          }}>
              <IconButton
                icon="camera"
                color={Colors.black }
                style={styles.cameraicon}
                onPress={this._takePicture}
              />
              {/* <FontAwesome style={styles.cameraicon} name="camera" size={24} color="black" /> */}
          {/* </TouchableOpacity> */}
          {/* <Text>{this.state.imageuris.length ? this.state.imageuris.length:''}</Text> */}
          {/* <TouchableOpacity
            onPress={this._pickDocument}
            style={{paddingBottom: 10, marginLeft: 5}}>
              <Entypo style={styles.attachicon} name="attachment" size={24} color="black" />
          </TouchableOpacity> */}
          <IconButton
            icon="attachment"
            color={Colors.black }
            style={styles.attachicon}
            onPress={this._pickDocument}
          />
          {/* <Text>{this.state.docuris.length ?this.state.docuris.length:''}</Text> */}

          <TextInput
            style={styles.input}
            value={this.state.textMessage}
            placeholder="type message here..."
            onChangeText={(e)=>{
              this.setState({textMessage:e})
            }}
          />
          {(this.state.textMessage.length || this.state.imageSelected || this.state.result)?
            // <TouchableOpacity
            //   onPress={this.sendMessage}
            //   style={{paddingBottom: 10, marginLeft: 5}}>
            //       <FontAwesome name="send" style={styles.send} color="black" />
            // </TouchableOpacity>
            <IconButton
              icon="send"
              color={Colors.black }
              style={styles.attachicon}
              onPress={this.sendMessage}
            /> :
            // <IconButton
            //   icon="voice"
            //   color={Colors.black }
            //   style={styles.attachicon}
            //   // onPress={this.sendMessage}
            // />
            
            <TouchableOpacity
              onPressIn={this.startRecording}
              onPressOut={this.stopRecording}
              style={{paddingBottom: 10, marginLeft: 5}}>
                <MaterialIcons style={styles.voiceicon} name="keyboard-voice" color="black" />
            </TouchableOpacity> 
            }
        </View>
      </Container>
    );
  }
}