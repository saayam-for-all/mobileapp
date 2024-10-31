import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000/users'; // For Android Emulator


const UserSearch = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users based on search input
  const handleSearch = async () => {
    console.log('Searching for:', query); // Debugging log
  
    try {
      // Fetch all users
      const response = await axios.get(API_URL);
      
      // Filter users by firstName manually (case-insensitive match)
      const filteredUsers = response.data
        .filter((user) =>
          user.firstName.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 3); // Get top 3 users
  
      setUsers(filteredUsers);
  
      if (filteredUsers.length === 0) {
        Alert.alert('No Results', 'No users found with that name.');
      }
    } catch (error) {
      console.error('Error searching for users:', error);
      Alert.alert('Error', 'Failed to fetch users.');
    }
  };

  // Render user details when selected from the dropdown
  const renderUserDetails = (user) => (
    <View style={styles.userDetails}>
      <Text style={styles.detailText}>
        Name: {user.firstName} {user.lastName}
      </Text>
      <Text style={styles.detailText}>Email: {user.email}</Text>
      <Text style={styles.detailText}>Phone: {user.phone}</Text>
      <Text style={styles.detailText}>Zone: {user.zone}</Text>
      <Text style={styles.detailText}>DOB: {user.dob}</Text>
      <Text style={styles.detailText}>Gender: {user.gender}</Text>
      <Text style={styles.detailText}>Rating: {user.rating}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search User</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter First Name"
        value={query}
        onChangeText={setQuery}
      />

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      <Picker
        selectedValue={selectedUser}
        onValueChange={(itemValue) => setSelectedUser(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a User" value={null} />
        {users.map((user) => (
          <Picker.Item
            key={user.id}
            label={`${user.firstName} ${user.lastName}`}
            value={user}
          />
        ))}
      </Picker>

      {selectedUser && renderUserDetails(selectedUser)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  picker: {
    height: 50,
    marginBottom: 15,
  },
  userDetails: {
    marginTop: 20,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default UserSearch;
