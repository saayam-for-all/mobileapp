import {useState, useEffect} from 'react';
import { View,Text,Modal,StyleSheet, Image, Alert, TouchableOpacity} from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_PROFILE_ICON = require('../assets/rn-logo.png');
function ProfileImage({ isModalOpen, setIsModalOpen, profilePhoto, setProfilePhoto }) {
    const [file, setFile] = useState(profilePhoto);
    const [error, setError] = useState(null);

    // *** For Testing, android devices might have different behavior

    useEffect(() => {
        const getImage = async () => {
            const value = await AsyncStorage.getItem('profilePhoto');
            if(value) setFile(JSON.parse(value));
        }
        if(!file?.uri) getImage();
        // console.log(file);
        // fetch(file.uri?.replace("file://",'')).then(res=>console.log(res))
        //     .catch(err=>console.log(err))
    },[file])

    const pickImage = async () => {
        const { status } = await ImagePicker.
            requestMediaLibraryPermissionsAsync();
        
        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                "Sorry, we need camera roll permission to upload images."
            );
        } else {
            const result =
                await ImagePicker.launchImageLibraryAsync();
            if (!result?.canceled) {
                setFile({uri:result?.assets[0].uri});
                setError(null);
            }
        }
    };
    
    const handleSaveClick = () => {
        setProfilePhoto(file);
        AsyncStorage.setItem('profilePhoto', JSON.stringify(file));
        setIsModalOpen(false);
    };

    const handleCancelClick = () => {
        setProfilePhoto(profilePhoto);
        setFile(profilePhoto);
        setIsModalOpen(false);
    };

    const handleDeleteClick = async () => {
        setFile({});
        await AsyncStorage.clear();
        setProfilePhoto({});
    };
    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={isModalOpen}
            onRequestClose={() => {
                Alert.alert('Edit closed.');
                setIsModalOpen(!isModalOpen);
            }}
        >
          <View
            style={{
              width:"80%",
              aspectRatio:1,
              backgroundColor:'white',
              marginTop: 'auto',
              borderRadius: 20,
              paddingVertical: 25,
              marginHorizontal: 'auto',
              marginVertical: 'auto',
              borderColor: 'black',
              borderWidth: 1,
              ...styles.colContainer,
            }}
          >
                <Text style={styles.titleText}>Profile Photo</Text>

                <View>
                    
                    {profilePhoto ? (
                        <View style={styles.img}>
                        {file?.uri ? (<Image
                            source={file}
                            alt="Profile"
                            style={{
                                width:"100%",
                                height:"100%",
                                flex: 1,
                                resizeMode: 'cover',
                            }}
                        />) : (<Image
                            source={DEFAULT_PROFILE_ICON}
                            alt="Profile"
                            style={{
                                flex: 1,
                                resizeMode: 'contain',
                            }}
                        />)}
                        </View>
                    ) : (
                        <View style={styles.img}>
                            <Text>No Photo</Text>
                        </View>
                    )}

                </View>
               
                <View style={{ width: '60%', ...styles.rowContainer}}>
                    <TouchableOpacity style={{marginHorizontal:10}} onPress={pickImage}>
                        <View style={{ width: '100%', ...styles.colContainer}}>
                            <FontAwesome name="camera" size={24} color="black" />
                            <Text className="text-blue-600">Upload</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginHorizontal:10}} onPress={handleDeleteClick}>
                        <View style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome name="trash" size={24} color="black" />
                            <Text>Delete</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ width: '80%', ...styles.rowContainer, justifyContent:'space-between'}}>
                    <View style={styles.blueButton}>
                        <Button 
                            style={{width:"45%"}}
                            onPress={handleSaveClick}
                        >
                            <View style={{...styles.rowContainer, width:"100%", }}>
                                <FontAwesome style={{marginHorizontal:5}} name="save" size={24} color="white" />
                                <Text style={{marginHorizontal:5,...styles.buttonText}}>Save</Text>
                            </View>
                        </Button>
                    </View>
                    <View style={styles.blueButton}>
                        <Button
                            style={{width:"45%"}}
                            onPress={handleCancelClick}
                        >   
                            <View style={{...styles.rowContainer, width:"100%", }}>
                                <FontAwesome style={{marginHorizontal:5}} name="times" size={24} color="white" />
                                <Text style={{marginHorizontal:5,...styles.buttonText}}>Cancel</Text>
                            </View>
                        </Button>
                    </View>
                </View>

                <View style={{position: 'absolute', top: 10, right: 15, }} >
                    <TouchableOpacity onPress={handleCancelClick}>
                        <FontAwesome name="times" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                </View>
        </Modal>
    );
}

const styles = StyleSheet.create(
    {
        rowContainer: {
            display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' 
        },
        colContainer: {
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' 
        },
        buttonText: {
            color:"white",fontSize:18
        },
        blueButton:{
            width: "45%"
        },
        img: {
            width: "33.3%",
            aspectRatio: 1,
            marginHorizontal:'auto',
            borderRadius:100,
            backgroundColor:"white",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        },
        titleText: {
            fontSize: 24,
            fontWeight: 'bold',
            color: 'black',
        }
    }
);
export default ProfileImage;