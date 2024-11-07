import React from 'react';
import { View,Text,Modal,StyleSheet, Image } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native-gesture-handler';

function ProfileImage({ isModalOpen, setIsModalOpen, profilePhoto, setProfilePhoto }) {
    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const photo = e.target.result;
                setProfilePhoto(photo);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleUpload = () => {

    }
    
    const handleSaveClick = () => {
        setProfilePhoto(profilePhoto);
        localStorage.setItem('profilePhoto', profilePhoto);
        window.dispatchEvent(new Event('profile-photo-updated'));
        setIsModalOpen(false);
    };

    const handleCancelClick = () => {
        setProfilePhoto(profilePhoto);
        setIsModalOpen(false);
    };

    const handleDeleteClick = () => {
        setProfilePhoto(DEFAULT_PROFILE_ICON);
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

               
                <View className="relative mb-4 flex justify-center">
                    {profilePhoto ? (
                        // <Image source={profilePhoto!=''?require(profilePhoto):require('../assets/rn-logo.png')} style={styles.userImage} />
                        <View style={styles.img}>
                        <Image
                            source={require('../assets/rn-logo.png')}
                            alt="Profile"
                            style={{
                                flex: 1,
                                resizeMode: 'contain',
                            }}
                        />
                        </View>
                    ) : (
                        <View style={styles.img}>
                            <Text>No Photo</Text>
                        </View>
                    )}
                </View>

               
                <View style={{ width: '60%', ...styles.rowContainer}}>
                    <TouchableOpacity style={{marginHorizontal:10}} onPress={handleUpload}>
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
                    <Button 
                        style={{width:"45%"}}
                        onPress={handleSaveClick}
                    >
                        <View style={{...styles.rowContainer, width:"100%", }}>
                            <FontAwesome style={{marginHorizontal:5}} name="save" size={24} color="white" />
                            <Text style={{marginHorizontal:5,...styles.buttonText}}>Save</Text>
                        </View>
                    </Button>
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
            color:"white",fontSize:"18px"
        },
        img: {
            width: "33.3%",
            aspectRatio: 1,
            marginHorizontal:'auto',
            borderRadius:"100%",
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