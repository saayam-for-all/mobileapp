import {useState, useEffect, useRef} from 'react';
import { View,Text,Modal,StyleSheet, Image, Alert, TouchableOpacity, ActivityIndicator} from 'react-native';
import Button from '../components/Button';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { uploadProfileImage, deleteProfileImage, fetchProfileImage } from '../services/volunteerServices';
import useAuthUser from '../hooks/useAuthUser';

const DEFAULT_PROFILE_ICON = require('../assets/rn-logo.png');

function ProfileImage({ isModalOpen, setIsModalOpen, profilePhoto, setProfilePhoto }) {
    const [file, setFile] = useState({});
    const [error, setError] = useState(null);
    const [photoLoading, setPhotoLoading] = useState(false);
    const pendingFileRef = useRef(null);
    
    const user = useAuthUser();
    const userDbId = user?.attributes?.userDbId;

    useEffect(() => {
        if (!isModalOpen) return;
        setFile(profilePhoto);
    }, [isModalOpen]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", "Sorry, we need camera roll permission to upload images.");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({ base64: false });
            if (!result?.canceled) {
                const asset = result.assets[0];
                pendingFileRef.current = {
                    uri: asset.uri,
                    type: asset.mimeType || 'image/jpeg',
                    name: asset.fileName || 'profile.jpg',
                };
                setFile({ uri: asset.uri });
                setError(null);
            }
        }
    };

    const handleSaveClick = async () => {
        if (userDbId && pendingFileRef.current) {
            setPhotoLoading(true);
            try {
                await uploadProfileImage(userDbId, pendingFileRef.current);
                const blob = await fetchProfileImage(userDbId);
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    setFile({ uri: url });
                    setProfilePhoto({ uri: url });
                    await AsyncStorage.setItem('profilePhoto', JSON.stringify({ uri: url }));
                }
            } catch (err) {
                setError(err?.message || 'Failed to upload profile photo.');
                setPhotoLoading(false);
                return;
            }
            pendingFileRef.current = null;
            setPhotoLoading(false);
        } else {
            setProfilePhoto(file);
            await AsyncStorage.setItem('profilePhoto', JSON.stringify(file));
        }
        setIsModalOpen(false);
    };

    const handleCancelClick = () => {
        pendingFileRef.current = null;
        setFile(profilePhoto);
        setIsModalOpen(false);
    };

    const handleDeleteClick = async () => {
        if (userDbId) {
            setPhotoLoading(true);
            try {
                await deleteProfileImage(userDbId);
            } catch (err) {
                setError(err?.message || 'Failed to delete profile photo.');
                setPhotoLoading(false);
                return;
            }
            setPhotoLoading(false);
        }
        pendingFileRef.current = null;
        setFile({});
        setProfilePhoto({});
        await AsyncStorage.removeItem('profilePhoto');
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
          <View style={{ width:"80%", aspectRatio:1, backgroundColor:'white', marginTop: 'auto', borderRadius: 20, paddingVertical: 25, marginHorizontal: 'auto', marginVertical: 'auto', borderColor: 'black', borderWidth: 1, ...styles.colContainer }}>
                <Text style={styles.titleText}>Profile Photo</Text>
                <View>
                    {profilePhoto ? (
                        <View style={styles.img}>
                        {file?.uri ? (<Image source={file} alt="Profile" style={{ width:"100%", height:"100%", flex: 1, resizeMode: 'cover' }} />
                        ) : (<Image source={DEFAULT_PROFILE_ICON} alt="Profile" style={{ flex: 1, resizeMode: 'contain' }} />)}
                        </View>
                    ) : (
                        <View style={styles.img}><Text>No Photo</Text></View>
                    )}
                </View>
                {error && <Text style={{ color: 'red', fontSize: 12 }}>{error}</Text>}
                <View style={{ width: '60%', ...styles.rowContainer}}>
                    <TouchableOpacity style={{marginHorizontal:10}} onPress={pickImage} disabled={photoLoading}>
                        <View style={{ width: '100%', ...styles.colContainer}}>
                            <FontAwesome name="camera" size={24} color="black" />
                            <Text>Upload</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginHorizontal:10}} onPress={handleCancelClick} disabled={photoLoading}>
                        <View style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesome name="times" size={24} color="black" />
                            <Text>Cancel</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {photoLoading && <ActivityIndicator size="small" color="#000" />}
                <View style={{ width: '80%', ...styles.rowContainer, justifyContent:'space-between'}}>
                    <Button style={{width:"45%"}} onPress={handleSaveClick} disabled={photoLoading}>
                        <View style={{...styles.rowContainer, width:"100%"}}>
                            <FontAwesome style={{marginHorizontal:5}} name="save" size={24} color="white" />
                            <Text style={{marginHorizontal:5,...styles.buttonText}}>Save</Text>
                        </View>
                    </Button>
                    <Button style={{width:"45%"}} onPress={handleDeleteClick} disabled={photoLoading}>
                        <View style={{...styles.rowContainer, width:"100%"}}>
                            <FontAwesome style={{marginHorizontal:5}} name="trash" size={24} color="white" />
                            <Text style={{marginHorizontal:5,...styles.buttonText}}>Delete</Text>
                        </View>
                    </Button>
                </View>
                <View style={{position: 'absolute', top: 10, right: 15}}>
                    <TouchableOpacity onPress={handleCancelClick}>
                        <FontAwesome name="times" size={24} color="black" />
                    </TouchableOpacity>
                </View>
          </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    rowContainer: {
        display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' 
    },
    colContainer: {
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' 
    },
    buttonText: {
        color: "white", fontSize: 18
    },
    img: {
        width: "33.3%",
        aspectRatio: 1,
        marginHorizontal: 'auto',
        borderRadius: 100,
        backgroundColor: "white",
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
});

export default ProfileImage;